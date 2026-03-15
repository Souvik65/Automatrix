import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { type NodeProps, useReactFlow } from "@xyflow/react";
import { TimerIcon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { DelayLogicDialog, DelayLogicFormValues } from "./dialogs/delay-logic-dialog";
import { fetchEngineRealtimeToken } from "@/features/executions/components/engine/actions";

export const DelayLogicComponent = memo((props: NodeProps) => {
    const status = useNodeStatus({ 
        nodeId: props.id, 
        channel: 'engine', 
        topic: 'status', 
        refreshToken: fetchEngineRealtimeToken 
    });
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: DelayLogicFormValues) => {
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

    const nodeData = props.data as Partial<DelayLogicFormValues>;
    const description = nodeData?.durationMs ? `Wait ${nodeData.durationMs}ms` : "Unconfigured";

    return (
        <>
            <DelayLogicDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                name="Delay"
                description={description}
                icon={TimerIcon}
                status={status}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});
DelayLogicComponent.displayName = "DelayLogicComponent";
