import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

export const JsonParseDataNode: WorkflowNode = {
  type: NodeType.JSON_PARSE_DATA,
  ports: { inputs: 1, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    const { targetField } = context.nodeData;
    
    if (!targetField) return { success: true, data: context.inputData };

    const parsedItems = context.inputData.map(item => {
      try {
        const value = item.json[targetField as string];
        if (typeof value === 'string') {
          return {
            ...item,
            json: {
              ...item.json,
              [targetField as string]: JSON.parse(value)
            }
          };
        }
      } catch(e) {}
      return item;
    });

    return { success: true, data: parsedItems };
  }
};
