import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

export const NotionIntegrationNode: WorkflowNode = {
  type: NodeType.NOTION_INTEGRATION,
  ports: { inputs: 1, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    const { databaseId, action } = context.nodeData;
    return { success: true, data: context.inputData };
  }
};
