import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { type NodeProps, useReactFlow } from "@xyflow/react";
import { FilterIcon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { FilterDataDialog, FilterDataFormValues } from "./dialogs/filter-data-dialog";
import { fetchEngineRealtimeToken } from "@/features/executions/components/engine/actions";

export const FilterDataComponent = memo((props: NodeProps) => {
    const status = useNodeStatus({ 
        nodeId: props.id, 
        channel: 'engine', 
        topic: 'status', 
        refreshToken: fetchEngineRealtimeToken 
    });
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: FilterDataFormValues) => {
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

    const nodeData = props.data as Partial<FilterDataFormValues>;
    const description = nodeData?.filterExpression ? `Filter where ${nodeData.filterExpression}` : "Unconfigured";

    return (
        <>
            <FilterDataDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                name="Filter"
                description={description}
                icon={FilterIcon}
                status={status}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});
FilterDataComponent.displayName = "FilterDataComponent";
