import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { sendWorkflowExecution, topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@prisma/client";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { geminiChannel } from "./channels/gemini";
import { openAiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";
import { cronTriggerChannel } from "./channels/cron-trigger";
import { webhookTriggerChannel } from "./channels/webhook-trigger";
import * as parser from "cron-parser";



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
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      geminiChannel(),
      openAiChannel(),
      anthropicChannel(),
      webhookTriggerChannel(),
      cronTriggerChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("Event ID or workflow ID is missing");
    }

    await step.run("create-execution", async () => {
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

    // Initialize the  context with any initial data from the trigger 
    let context = event.data.initialData || {};

    // Execute each node in order
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
        publish,
      });
    }

    await step.run("update-execution", async () => {
      return prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.COMPLETED,
          completedAt: new Date(),
          output: context,
        },
      })
    });


    return { 
      workflowId,
      result: context,
     };
  },
);

export const executeCronWorkflows = inngest.createFunction(
  {
    id: "execute-cron-workflows",
    retries: process.env.NODE_ENV === "production" ? 3 : 0,
  },
  {
    cron: "* * * * *",
  },
  
  async ({ step }) => {
    const now = new Date();

    // Find all enabled cron schedules that are due
    const dueSchedules = await step.run("find-due-schedules", async () => {
      return prisma.cronSchedule.findMany({
        where: {
          enabled: true,
          OR: [
            { nextRunAt: null },
            { nextRunAt: { lte: now } },
          ],
        },
        include: {
          workflow: {
            select: {
              id: true,
              userId: true,
            },
          },
        },
      });
    });

    // Execute each due workflow
    for (const schedule of dueSchedules) {
      await step.run(`execute-cron-${schedule.id}`, async () => {
        // Trigger workflow execution
        await sendWorkflowExecution({
          workflowId: schedule.workflowId,
          initialData: {
            cron: {
              scheduleId: schedule.id,
              expression: schedule.cronExpression,
              executedAt: now.toISOString(),
            },
          },
        });

        // Calculate next run time
        const interval = parser.parseExpression(schedule.cronExpression, {
          currentDate: now,
          tz: schedule.timezone,
        });
        const nextRun = interval.next().toDate();

        // Update schedule
        await prisma.cronSchedule.update({
          where: { id: schedule.id },
          data: {
            lastRunAt: now,
            nextRunAt: nextRun,
          },
        });
      });
    }

    return { 
      executed: dueSchedules.length,
      timestamp: now.toISOString(),
    };
  }
);