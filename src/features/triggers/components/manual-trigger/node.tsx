import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer2Icon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialohOpen, setDialogOpen] = useState(false);

    const nodeStatus = "initial";

    const handleOpenSettings = () => setDialogOpen(true);

    return (
        <>
            <ManualTriggerDialog open={dialohOpen} onOpenChange={setDialogOpen} />
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