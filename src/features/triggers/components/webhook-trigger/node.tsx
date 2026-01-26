import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { WebhookTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchWebhookTriggerRealtimeToken } from "./actions";
import { WEBHOOK_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/webhook-trigger";
import { WebhookIcon } from "lucide-react";

export const WebhookTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: WEBHOOK_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchWebhookTriggerRealtimeToken,
    });

    const handleOpenSettings = () => setDialogOpen(true);

    return (
        <>
            <WebhookTriggerDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen} 
            />

            <BaseTriggerNode
                {...props}
                icon={WebhookIcon}
                name="Webhook"
                description="Triggered by external HTTP requests"
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

WebhookTriggerNode.displayName = "WebhookTriggerNode";