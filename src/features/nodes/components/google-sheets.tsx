import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { type NodeProps, useReactFlow } from "@xyflow/react";
import { FileSpreadsheetIcon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GoogleSheetsDialog, GoogleSheetsFormValues } from "@/features/nodes/components/dialogs/google-sheets-dialog";
import { fetchEngineRealtimeToken } from "@/features/executions/components/engine/actions";

export const GoogleSheetsComponent = memo((props: NodeProps) => {
    const status = useNodeStatus({ 
        nodeId: props.id, 
        channel: 'engine', 
        topic: 'status', 
        refreshToken: fetchEngineRealtimeToken 
    });
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: GoogleSheetsFormValues) => {
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

    const nodeData = props.data as Partial<GoogleSheetsFormValues>;
    const description = nodeData?.spreadsheetId ? `${nodeData.action} in ${nodeData.spreadsheetId.substring(0, 10)}...` : "Unconfigured";

    return (
        <>
            <GoogleSheetsDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                name="Google Sheets"
                description={description}
                icon={FileSpreadsheetIcon}
                status={status}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});
GoogleSheetsComponent.displayName = "GoogleSheetsComponent";
