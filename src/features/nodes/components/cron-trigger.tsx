"use client";

import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";
import { type NodeProps, useReactFlow } from "@xyflow/react";
import { ClockIcon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { CronTriggerDialog, CronTriggerFormValues } from "./dialogs/cron-trigger-dialog";
import { fetchEngineRealtimeToken } from "@/features/executions/components/engine/actions";

export const CronTriggerComponent = memo((props: NodeProps) => {
    const status = useNodeStatus({ 
        nodeId: props.id, 
        channel: 'engine', 
        topic: 'status', 
        refreshToken: fetchEngineRealtimeToken 
    });
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: CronTriggerFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values,
                    }
                }
            }
            return node;
        }))
    }

    const nodeData = props.data as Partial<CronTriggerFormValues>;
    
    // Friendly schedule mappings mapper text
    const scheduleMappings: Record<string, string> = {
        "* * * * *": "Every Minute",
        "*/5 * * * *": "Every 5 Minutes",
        "*/15 * * * *": "Every 15 Minutes",
        "*/30 * * * *": "Every 30 Minutes",
        "0 * * * *": "Every Hour",
        "0 0 * * *": "Every Day at Midnight",
        "0 0 * * 1": "Every Week (Monday)",
        "0 0 1 * *": "Every Month (1st Day)",
    };

    const friendlySchedule = nodeData?.cronExpression ? scheduleMappings[nodeData.cronExpression] || "Custom Schedule" : undefined;
    const description = friendlySchedule ? `${friendlySchedule} (${nodeData.timezone})` : "Unconfigured";

    return (
        <>
            <CronTriggerDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseTriggerNode
                {...props}
                name="Time Schedule"
                description={description}
                icon={ClockIcon}
                status={status}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});
CronTriggerComponent.displayName = "CronTriggerComponent";
