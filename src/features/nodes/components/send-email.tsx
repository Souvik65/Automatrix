"use client";

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { type NodeProps, useReactFlow } from "@xyflow/react";
import { MailIcon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { SendEmailDialog, SendEmailFormValues } from "./dialogs/send-email-dialog";
import { fetchEngineRealtimeToken } from "@/features/executions/components/engine/actions";

export const SendEmailActionComponent = memo((props: NodeProps) => {
    const status = useNodeStatus({ 
        nodeId: props.id, 
        channel: 'engine', 
        topic: 'status', 
        refreshToken: fetchEngineRealtimeToken 
    });
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: SendEmailFormValues) => {
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

    const nodeData = props.data as Partial<SendEmailFormValues>;
    const description = nodeData?.to ? `To: ${nodeData.to}` : "Unconfigured";

    return (
        <>
            <SendEmailDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                name="Send Email"
                description={description}
                icon={MailIcon}
                status={status}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});
SendEmailActionComponent.displayName = "SendEmailActionComponent";
