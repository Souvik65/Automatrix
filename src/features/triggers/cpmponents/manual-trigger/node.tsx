import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer2Icon } from "lucide-react";

export const ManualTriggerNode = memo((props: NodeProps) => {
    return (
        <>
            <BaseTriggerNode
            {...props}
            icon={MousePointer2Icon}
            name="When clicking 'Execute workflow'"
            // status={nodeStatus}
            // onSettings={handleOpenSettings} TODO: add settings
            // onDoubleClick={handleOpenSettings}
            />
        </>
    )
})