import { inngest } from "../client";
import prisma from "@/lib/db";
import { parseExpression } from "cron-parser";

/**
 * 1-Minute Polling Cron Scheduler
 * Scans all Workflows for CRON_TRIGGER nodes and triggers them if their
 * schedule expression matches the current minute bucket.
 */
export const masterCronScheduler = inngest.createFunction(
    { id: "master-cron-scheduler" },
    { cron: "* * * * *" }, // Run strictly every minute
    async ({ step }) => {
        // Find all active Nodes that are of type CRON_TRIGGER
        const cronNodes = await step.run("fetch-cron-nodes", async () => {
            const nodes = await prisma.node.findMany({
                where: {
                    type: "CRON_TRIGGER",
                },
                include: {
                    workflow: true,
                }
            });
            
            if (nodes.length > 0) {
                console.log(`[Cron Scheduler] Found ${nodes.length} active CRON_TRIGGER nodes in database.`);
            }
            
            return nodes;
        });

        if (cronNodes.length === 0) {
            return { skipped: true, reason: "No active cron nodes found" };
        }

        const triggeredWorkflows: string[] = [];

        // Evaluate each node's cron expression against the current minute
        await step.run("evaluate-and-dispatch", async () => {
            const now = new Date();
            // Start of current minute for accurate boundary checking
            now.setSeconds(0, 0);
            const nowTime = now.getTime();

            for (const node of cronNodes) {
                const data = node.data as { cronExpression?: string, timezone?: string };
                if (!data.cronExpression) continue;

                try {
                    const interval = parseExpression(data.cronExpression, {
                        tz: data.timezone || "UTC",
                    });

                    // Get the PREVIOUS run timestamp explicitly based on the cron
                    const prevRun = interval.prev().toDate();
                    prevRun.setSeconds(0, 0);

                    // If the expected run time exactly matches the current minute boundary
                    if (prevRun.getTime() === nowTime) {
                        // Dispatch the execution event for this workflow
                        await inngest.send({
                            id: `cron-${node.workflowId}-${nowTime}`,
                            name: "workflows/execute.workflow",
                            data: {
                                workflowId: node.workflowId,
                                initialData: {
                                    trigger: "CRON_TRIGGER",
                                    timestamp: new Date().toISOString(),
                                    nodeId: node.id,
                                }
                            }
                        });
                        triggeredWorkflows.push(node.workflowId);
                    }

                } catch (e) {
                    // Invalid cron expression, log and skip
                    console.error(`Invalid cron expression on node ${node.id}:`, e);
                }
            }
        });

        return { triggeredCount: triggeredWorkflows.length, triggeredWorkflows };
    }
);
