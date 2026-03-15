import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

export const MergeDataNode: WorkflowNode = {
  type: NodeType.MERGE_DATA,
  ports: { inputs: 2, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    const { strategy } = context.nodeData; // 'shallow', 'deep', 'array_concat'
    
    if (context.inputData.length <= 1) return { success: true, data: context.inputData };
    
    let mergedJson = {};
    if (strategy === 'array_concat') {
      mergedJson = { items: context.inputData.map(i => i.json) };
    } else {
      context.inputData.forEach(item => {
         mergedJson = { ...mergedJson, ...item.json };
      });
    }

    return { success: true, data: [{ json: mergedJson }] };
  }
};
