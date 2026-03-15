import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

export const FilterDataNode: WorkflowNode = {
  type: NodeType.FILTER_DATA,
  ports: { inputs: 1, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    const { filterExpression } = context.nodeData;
    
    if (!filterExpression) {
      return { success: true, data: context.inputData }; // pass-through if missing
    }

    const filteredItems = [];

    for (const item of context.inputData) {
      try {
        // Very basic sandbox for expression evaluation over item payload
        // In a strict production system, use isolated-vm or jsonata
        const fn = new Function('item', `try { return ${filterExpression}; } catch(e) { return false; }`);
        const isMatch = fn(item.json);
        if (isMatch) {
           filteredItems.push(item);
        }
      } catch (e) {
         // Silently drop items that fail evaluation, or log them
      }
    }

    return {
      success: true,
      data: filteredItems,
    };
  }
};
