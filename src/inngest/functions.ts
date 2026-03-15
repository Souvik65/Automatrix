import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@prisma/client";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { getNodeImplementation } from "@/lib/engine/registry";
import { Item, ExecutionContext } from "@/lib/engine/types";
import { engineChannel } from "./channels/engine";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { geminiChannel } from "./channels/gemini";
import { openAiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";



export const executeWorkflow = inngest.createFunction(
  { 
    id: "execute-workflow" ,
    retries: process.env.NODE_ENV === "production" ? 3 : 0,
    onFailure: async ({ event, step }) => {
      return prisma.execution.update({
        where: { inngestEventId: event.data.event.id },
        data: {
          status: ExecutionStatus.FAILED,
          error: event.data.error.message,
          errorStack: event.data.error.stack,
        },
      });
    },
  },
  { 
    event: "workflows/execute.workflow",
    channels: [
      engineChannel(),
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      geminiChannel(),
      openAiChannel(),
      anthropicChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("Event ID or workflow ID is missing");
    }

    const execution = await step.run("create-execution", async () => {
      return prisma.execution.create({
        data: {
          workflowId,
          inngestEventId,
        }
      })
    })

    const sortedNodes = await step.run("prepare-workflow-node", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort (workflow.nodes, workflow.connections);
    });


    const userId = await step.run("find-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: { userId: true },
      });
      return workflow.userId;
    });

    if (sortedNodes.length === 0) {
      throw new NonRetriableError("Workflow has no nodes to execute");
    }

    // Item-based data flow tracking
    const nodeResults: Record<string, Item[]> = {};

    // Determine trigger node and inject initial data as an Item array
    const startNode = sortedNodes[0];
    nodeResults[startNode.id] = [{ json: event.data.initialData || {} }];

    const workflowConnections = await step.run("get-connections", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: { connections: true }
      });
      return workflow.connections;
    });

    // Execute each node in order
    for (const node of sortedNodes) {
      // Setup input data strictly from incoming edges
      let inputItems: Item[] = [];
      const incomingEdges = workflowConnections.filter(c => c.toNodeId === node.id);
      
      if (incomingEdges.length > 0) {
        // Here we handle the n8n Item array. If multiple edges point to this node,
        // we merge all incoming items into one array.
        inputItems = incomingEdges.flatMap(edge => nodeResults[edge.fromNodeId] || []) as any;
      } else if (node.id === startNode.id) {
        // Start node uses injected trigger data
        inputItems = nodeResults[node.id] as any;
      }

      // Check if it's a new Engine Node type or an old executor type
      const engineNode = getNodeImplementation(node.type as string);
      
      let nextData: any = null;

      if (engineNode) {
         // Notify UI of start
         await step.run(`publish-start-${node.id}`, async () => {
             await publish(
                 engineChannel().status({
                     nodeId: node.id,
                     status: "RUNNING",
                 })
             );
         });

         // Run via the new Item-based Execution Engine
         const result = await step.run(`execute-${node.id}`, async () => {
            const context: ExecutionContext = {
              workflowId,
              executionId: inngestEventId,
              nodeData: node.data as Record<string, any>,
              inputData: inputItems,
              getCredentials: async (_credentialName: string) => {
                 if (node.credentialId) {
                   const cred = await prisma.credential.findUnique({ where: { id: node.credentialId } });
                   if (cred) return { [cred.type.toString()]: cred.value };
                 }
                 return {};
              },
              getVariable: (name) => {
                 return inputItems.length > 0 ? inputItems[0].json[name] : null;
              },
              setVariable: (name, value) => {
                 if (inputItems.length > 0) {
                     inputItems[0].json[name] = value;
                 }
              }
            };
            return await engineNode.execute(context);
         });

         // Notify UI of completion
         await step.run(`publish-end-${node.id}`, async () => {
             await publish(
                 engineChannel().status({
                     nodeId: node.id,
                     status: result.success ? "SUCCESS" : "FAILED",
                 })
             );
         });

         if (!result.success) throw new Error(result.error ?? "Node execution failed");
         nodeResults[node.id] = result.data as unknown as Item[];

         // Log execution state explicitly for UI tracking
         await step.run(`log-${node.id}`, async () => {
            try {
              await prisma.executionLog.create({
                data: {
                  executionId: execution.id,
                  nodeId: node.id,
                  status: 'SUCCESS',
                  inputSnapshot: inputItems as unknown as any,
                  outputSnapshot: result.data as unknown as any,
                }
              });
            } catch {
              // ExecutionLog table may not exist yet — skip logging rather than failing the run
            }
         });
         
      } else {
        // Fallback or old legacy node runners
        const executor = getExecutor(node.type as NodeType);
        const legacyContext = inputItems.length > 0 ? inputItems[0].json : {};
        nextData = await executor({
          data: node.data as Record<string, unknown>,
          nodeId: node.id,
          userId,
          context: legacyContext,
          step,
          publish,
        });
        nodeResults[node.id] = [{ json: nextData }];
      }
    }

    await step.run("update-execution", async () => {
      const completedAt = new Date();
      const durationMs = completedAt.getTime() - new Date(execution.startedAt).getTime();
      return prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.COMPLETED,
          completedAt,
          durationMs,
          output: nodeResults as any,
        },
      })
    });


    return { 
      workflowId,
      result: nodeResults,
     };
  },
);