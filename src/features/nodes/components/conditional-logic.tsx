"use client";

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { type NodeProps, useReactFlow } from "@xyflow/react";
import { GitBranchIcon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { ConditionalLogicDialog, ConditionalLogicFormValues } from "./dialogs/conditional-logic-dialog";
import { fetchEngineRealtimeToken } from "@/features/executions/components/engine/actions";

export const ConditionalLogicComponent = memo((props: NodeProps) => {
    const status = useNodeStatus({ 
        nodeId: props.id, 
        channel: 'engine', 
        topic: 'status', 
        refreshToken: fetchEngineRealtimeToken 
    });
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: ConditionalLogicFormValues) => {
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

    const nodeData = props.data as Partial<ConditionalLogicFormValues>;
    const description = nodeData?.field ? `If ${nodeData.field} ${nodeData.operator} ${nodeData.value}` : "Unconfigured";

    return (
        <>
            <ConditionalLogicDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                name="If / Else"
                description={description}
                icon={GitBranchIcon}
                status={status}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});
ConditionalLogicComponent.displayName = "ConditionalLogicComponent";
