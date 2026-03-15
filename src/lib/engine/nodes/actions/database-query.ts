import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

export const DatabaseQueryActionNode: WorkflowNode = {
  type: NodeType.DATABASE_QUERY_ACTION,
  ports: { inputs: 1, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    const { queryTemplate, connectionStringId } = context.nodeData;
    
    // In a real environment, you look up the connection string using getCredentials and run the query.
    // We will simulate the output for the scope of the project.
    const outputItems = context.inputData.map(item => ({
      ...item,
      json: {
        ...item.json,
        queryResult: [{ id: "mock_row", value: "simulated_db_data" }]
      }
    }));

    return { success: true, data: outputItems };
  }
};
