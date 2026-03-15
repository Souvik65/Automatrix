import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";

export const FileUploadActionNode: WorkflowNode = {
  type: NodeType.FILE_UPLOAD_ACTION,
  ports: { inputs: 1, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    return { success: true, data: context.inputData };
  }
};

export const FileDownloadActionNode: WorkflowNode = {
  type: NodeType.FILE_DOWNLOAD_ACTION,
  ports: { inputs: 1, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    return { success: true, data: context.inputData };
  }
};
