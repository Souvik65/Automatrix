import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

export const createTriggerNode = (type: NodeType): WorkflowNode => ({
  type,
  ports: { inputs: 0, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    // Triggers receive their initial payload injected directly into context.inputData
    // from the Inngest event that started the workflow.
    return {
      success: true,
      data: context.inputData,
    };
  }
});

export const CronTriggerNode = createTriggerNode(NodeType.CRON_TRIGGER);
export const WebhookTriggerNode = createTriggerNode(NodeType.WEBHOOK_TRIGGER);
export const EmailReceivedTriggerNode = createTriggerNode(NodeType.EMAIL_RECEIVED_TRIGGER);
export const GithubEventTriggerNode = createTriggerNode(NodeType.GITHUB_EVENT_TRIGGER);
