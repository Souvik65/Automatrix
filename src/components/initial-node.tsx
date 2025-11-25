"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";

export const InitialNode = memo((props: NodeProps) => {
    return (
        <WorkflowNode showToolbar={false}>
            <PlaceholderNode
                {...props}
            >
                <div className="cursor-pointer flex  items-center justify-center aspect-square ">
                    <PlusIcon className=" w-6 h-6  rounded-full bg-blue-400 text-white" /> 
                </div>
            </PlaceholderNode>
        </WorkflowNode>
    )
});

InitialNode.displayName = "InitialNode";