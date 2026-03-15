import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

export const GoogleSheetsIntegrationNode: WorkflowNode = {
  type: NodeType.GOOGLE_SHEETS_INTEGRATION,
  ports: { inputs: 1, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    const { spreadsheetId, range, action } = context.nodeData;
    return { success: true, data: context.inputData };
  }
};
