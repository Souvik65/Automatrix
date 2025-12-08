import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer2Icon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";
import { fetchManualTriggertRealtimeToken } from "./actions";

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: MANUAL_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchManualTriggertRealtimeToken,
    });

    const handleOpenSettings = () => setDialogOpen(true);

    return (
        <>
            <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode
            {...props}
            icon={MousePointer2Icon}
            name="When clicking 'Execute workflow'"
            status={nodeStatus}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
            />
        </>
    )
})