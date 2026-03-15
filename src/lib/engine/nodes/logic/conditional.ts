import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

export const ConditionalLogicNode: WorkflowNode = {
  type: NodeType.CONDITIONAL_LOGIC,
  ports: { inputs: 1, outputs: 2 }, // True/False branches
  async execute(context: ExecutionContext): Promise<NodeResult> {
    const { field, operator, value } = context.nodeData;
    
    if (!field || !operator) {
      return { success: false, data: [], error: "Missing conditional configuration." };
    }

    // In a real execution environment routing is handled slightly differently.
    // For item-based, we filter the incoming items into the "true" output port and the "false" output port.
    const trueItems = [];
    const falseItems = [];

    for (const item of context.inputData) {
      const itemValue = item.json[field as string];
      let isMatch = false;

      switch(operator) {
        case 'eq': isMatch = itemValue === value; break;
        case 'neq': isMatch = itemValue !== value; break;
        case 'gt': isMatch = itemValue > value; break;
        case 'lt': isMatch = itemValue < value; break;
        case 'includes': isMatch = String(itemValue).includes(String(value)); break;
      }

      if (isMatch) trueItems.push(item);
      else falseItems.push(item);
    }

    // Returning metadata explicitly pointing to output ports (0 = True, 1 = False)
    // The engine's router will intercept this.
    return {
      success: true,
      data: trueItems, // Default output data is true port
      metadata: {
        routedData: {
          0: trueItems,
          1: falseItems
        }
      }
    };
  }
};
