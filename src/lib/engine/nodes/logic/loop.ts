import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

export const LoopLogicNode: WorkflowNode = {
  type: NodeType.LOOP_LOGIC,
  ports: { inputs: 1, outputs: 2 }, 
  async execute(context: ExecutionContext): Promise<NodeResult> {
    const { targetArray, batchSize } = context.nodeData;
    
    // Iterator outputs one item per array element on the loop branch, and the remaining payload on the 'done' branch.
    // Simulated iterator
    return { success: true, data: context.inputData };
  }
};
