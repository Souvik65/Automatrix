import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

export const DelayLogicNode: WorkflowNode = {
  type: NodeType.DELAY_LOGIC,
  ports: { inputs: 1, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    const { durationMs } = context.nodeData;
    return { success: true, data: context.inputData };
  }
};
