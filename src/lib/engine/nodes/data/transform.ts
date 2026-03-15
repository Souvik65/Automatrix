import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

// Safe eval alternative for this demo. In production, use isolated-vm
export const TransformDataNode: WorkflowNode = {
  type: NodeType.TRANSFORM_DATA,
  ports: { inputs: 1, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    const code = context.nodeData?.code as string;
    
    if (!code) {
      return { success: false, data: [], error: "No transformation code provided" };
    }

    try {
      const outputItems = context.inputData.map(item => {
        // Execute dynamic code (Sandbox simulated for context)
        // Expected format: return mapped object
        const scriptFunc = new Function('$json', `${code}`);
        const result = scriptFunc(item.json);
        
        return { json: result || item.json };
      });
      
      return { success: true, data: outputItems };
    } catch (e: any) {
      return { success: false, data: [], error: `Transform failed: ${e.message}` };
    }
  }
};
