import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { type NodeProps, useReactFlow } from "@xyflow/react";
import { BookIcon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { NotionDialog, NotionFormValues } from "@/features/nodes/components/dialogs/notion-dialog";
import { fetchEngineRealtimeToken } from "@/features/executions/components/engine/actions";

export const NotionComponent = memo((props: NodeProps) => {
    const status = useNodeStatus({ 
        nodeId: props.id, 
        channel: 'engine', 
        topic: 'status', 
        refreshToken: fetchEngineRealtimeToken 
    });
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: NotionFormValues) => {
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

    const nodeData = props.data as Partial<NotionFormValues>;
    const description = nodeData?.databaseId ? `${nodeData.action} ${nodeData.databaseId.substring(0, 8)}...` : "Unconfigured";

    return (
        <>
            <NotionDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                name="Notion"
                description={description}
                icon={BookIcon}
                status={status}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});
NotionComponent.displayName = "NotionComponent";
