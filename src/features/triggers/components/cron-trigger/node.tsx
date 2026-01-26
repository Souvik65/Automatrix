import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { CronTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchCronTriggerRealtimeToken } from "./actions";
import { CRON_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/cron-trigger";
import { ClockIcon } from "lucide-react";

export const CronTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: CRON_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchCronTriggerRealtimeToken,
    });

    const handleOpenSettings = () => setDialogOpen(true);

    const cronExpression = (props.data as any)?.cronExpression;
    const description = cronExpression 
        ? `Schedule: ${cronExpression}`
        : "Not configured";

    return (
        <>
            <CronTriggerDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                nodeId={props.id}
            />

            <BaseTriggerNode
                {...props}
                icon={ClockIcon}
                name="Cron Schedule"
                description={description}
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

CronTriggerNode.displayName = "CronTriggerNode";