import { NodeType } from "@prisma/client";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { openAiExecutor } from "../components/openai/executor";
import { anthropicExecutor } from "../components/anthropic/executor";
import { webhookTriggerExecutor } from "@/features/triggers/components/webhook-trigger/executor";
import { cronTriggerExecutor } from "@/features/triggers/components/cron-trigger/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor, 
    [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
    [NodeType.GEMINI]: geminiExecutor,
    [NodeType.OPENAI]: openAiExecutor,
    [NodeType.ANTHROPIC]: anthropicExecutor, 
    [NodeType.WEBHOOK_TRIGGER]: webhookTriggerExecutor,    
    [NodeType.CRON_TRIGGER]: cronTriggerExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => { 
    const executor = executorRegistry[type];
    if (!executor) {
        throw new Error(`No executor found for node type: ${type}`);
    }

    return executor;
};