"use client";

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { type NodeProps, useReactFlow } from "@xyflow/react";
import { CogIcon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { TransformDataDialog, TransformDataFormValues } from "./dialogs/transform-data-dialog";
import { fetchEngineRealtimeToken } from "@/features/executions/components/engine/actions";

export const TransformDataComponent = memo((props: NodeProps) => {
    const status = useNodeStatus({ 
        nodeId: props.id, 
        channel: 'engine', 
        topic: 'status', 
        refreshToken: fetchEngineRealtimeToken 
    });
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: TransformDataFormValues) => {
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

    const nodeData = props.data as Partial<TransformDataFormValues>;
    const description = "Map JSON Objects using code";

    return (
        <>
            <TransformDataDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                name="Transform Data"
                description={description}
                icon={CogIcon}
                status={status}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});
TransformDataComponent.displayName = "TransformDataComponent";
