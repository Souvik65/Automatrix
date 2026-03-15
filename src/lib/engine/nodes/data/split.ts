import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

export const SplitDataNode: WorkflowNode = {
  type: NodeType.SPLIT_DATA,
  ports: { inputs: 1, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    const { path } = context.nodeData;
    
    if (!path) return { success: true, data: context.inputData };

    const splitItems: any[] = [];
    context.inputData.forEach(item => {
       const arrayData = item.json[path as string];
       if (Array.isArray(arrayData)) {
          arrayData.forEach(element => {
             splitItems.push({ json: typeof element === 'object' ? element : { value: element } });
          });
       } else {
          splitItems.push(item);
       }
    });

    return { success: true, data: splitItems };
  }
};
