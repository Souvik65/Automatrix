import { InitialNode } from "@/components/initial-node";
import { AnthropicNode } from "@/features/executions/components/anthropic/node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { OpenAINode } from "@/features/executions/components/openai/node";
import { GoogleFormTrigger } from "@/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { NodeType } from "@prisma/client";
import type { NodeTypes } from "@xyflow/react";
import { GenericNode } from "@/components/react-flow/generic-node";
import { SendEmailActionComponent } from "@/features/nodes/components/send-email";
import { ConditionalLogicComponent } from "@/features/nodes/components/conditional-logic";
import { DatabaseQueryComponent } from "@/features/nodes/components/database-query";
import { WebhookTriggerComponent } from "@/features/nodes/components/webhook-trigger";
import { CronTriggerComponent } from "@/features/nodes/components/cron-trigger";
import { TransformDataComponent } from "@/features/nodes/components/transform-data";
import { LoopLogicComponent } from "@/features/nodes/components/loop-logic";
import { GithubApiComponent } from "@/features/nodes/components/github-api";
import { GoogleSheetsComponent } from "@/features/nodes/components/google-sheets";
import { NotionComponent } from "@/features/nodes/components/notion";
import { SwitchLogicComponent } from "@/features/nodes/components/switch-logic";
import { DelayLogicComponent } from "@/features/nodes/components/delay-logic";
import { FilterDataComponent } from "@/features/nodes/components/filter-data";
import { MergeDataComponent } from "@/features/nodes/components/merge-data";
import { SplitDataComponent } from "@/features/nodes/components/split-data";
import { JsonParseDataComponent } from "@/features/nodes/components/json-parse-data";
export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
    [NodeType.GEMINI]: GeminiNode,
    [NodeType.OPENAI]: OpenAINode,
    [NodeType.ANTHROPIC]: AnthropicNode,
    [NodeType.CRON_TRIGGER]: CronTriggerComponent,
    [NodeType.WEBHOOK_TRIGGER]: WebhookTriggerComponent,
    [NodeType.EMAIL_RECEIVED_TRIGGER]: GenericNode,
    [NodeType.GITHUB_EVENT_TRIGGER]: GenericNode,
    [NodeType.SEND_EMAIL_ACTION]: SendEmailActionComponent,
    [NodeType.DATABASE_QUERY_ACTION]: DatabaseQueryComponent,
    [NodeType.FILE_UPLOAD_ACTION]: GenericNode,
    [NodeType.FILE_DOWNLOAD_ACTION]: GenericNode,
    [NodeType.CONDITIONAL_LOGIC]: ConditionalLogicComponent,
    [NodeType.SWITCH_LOGIC]: SwitchLogicComponent,
    [NodeType.LOOP_LOGIC]: LoopLogicComponent,
    [NodeType.DELAY_LOGIC]: DelayLogicComponent,
    [NodeType.ERROR_HANDLER_LOGIC]: GenericNode,
    [NodeType.TRANSFORM_DATA]: TransformDataComponent,
    [NodeType.FILTER_DATA]: FilterDataComponent,
    [NodeType.MERGE_DATA]: MergeDataComponent,
    [NodeType.SPLIT_DATA]: SplitDataComponent,
    [NodeType.JSON_PARSE_DATA]: JsonParseDataComponent,
    [NodeType.GITHUB_API_INTEGRATION]: GithubApiComponent,
    [NodeType.GOOGLE_SHEETS_INTEGRATION]: GoogleSheetsComponent,
    [NodeType.NOTION_INTEGRATION]: NotionComponent,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
