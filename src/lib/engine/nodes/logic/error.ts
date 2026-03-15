import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

export const ErrorHandlerLogicNode: WorkflowNode = {
  type: NodeType.ERROR_HANDLER_LOGIC,
  ports: { inputs: 1, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    return { success: true, data: context.inputData };
  }
};
