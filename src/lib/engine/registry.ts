import { NodeType } from "@prisma/client";
import { WorkflowNode } from "./types";
import { SendEmailActionNode } from "./nodes/actions/send-email";
import { ConditionalLogicNode } from "./nodes/logic/conditional";
import { TransformDataNode } from "./nodes/data/transform";
import { CronTriggerNode, WebhookTriggerNode, EmailReceivedTriggerNode, GithubEventTriggerNode } from "./nodes/triggers/generic";
import { DatabaseQueryActionNode } from "./nodes/actions/database-query";
import { FileUploadActionNode, FileDownloadActionNode } from "./nodes/actions/file";
import { SwitchLogicNode } from "./nodes/logic/switch";
import { LoopLogicNode } from "./nodes/logic/loop";
import { DelayLogicNode } from "./nodes/logic/delay";
import { ErrorHandlerLogicNode } from "./nodes/logic/error";
import { FilterDataNode } from "./nodes/data/filter";
import { JsonParseDataNode } from "./nodes/data/json-parse";
import { MergeDataNode } from "./nodes/data/merge";
import { SplitDataNode } from "./nodes/data/split";
import { GithubApiIntegrationNode } from "./nodes/integrations/github";
import { GoogleSheetsIntegrationNode } from "./nodes/integrations/google-sheets";
import { NotionIntegrationNode } from "./nodes/integrations/notion";

const registry = new Map<string, WorkflowNode>();

export function registerNode(node: WorkflowNode) {
  registry.set(node.type, node);
}

// Pre-register all available Nodes
registerNode(CronTriggerNode);
registerNode(WebhookTriggerNode);
registerNode(EmailReceivedTriggerNode);
registerNode(GithubEventTriggerNode);
registerNode(SendEmailActionNode);
registerNode(DatabaseQueryActionNode);
registerNode(FileUploadActionNode);
registerNode(FileDownloadActionNode);
registerNode(ConditionalLogicNode);
registerNode(SwitchLogicNode);
registerNode(LoopLogicNode);
registerNode(DelayLogicNode);
registerNode(ErrorHandlerLogicNode);
registerNode(TransformDataNode);
registerNode(FilterDataNode);
registerNode(JsonParseDataNode);
registerNode(MergeDataNode);
registerNode(SplitDataNode);
registerNode(GithubApiIntegrationNode);
registerNode(GoogleSheetsIntegrationNode);
registerNode(NotionIntegrationNode);

export function getNodeImplementation(type: string): WorkflowNode | undefined {
  return registry.get(type);
}

export function getAllNodes() {
  return Array.from(registry.values());
}
