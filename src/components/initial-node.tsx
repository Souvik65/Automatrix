"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

export const InitialNode = memo((props: NodeProps) => {
    const [selectorOpen, setSelectorOpen] = useState(false);

    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
            <WorkflowNode showToolbar={false}>
                <PlaceholderNode
                    {...props}
                    onClick={() => setSelectorOpen(true)}
                    >
                    <div className="cursor-pointer flex  items-center justify-center aspect-square ">
                        <PlusIcon className=" w-6 h-6  rounded-full bg-blue-400 text-white" /> 
                    </div>
                </PlaceholderNode>
            </WorkflowNode>
        </NodeSelector>
    )
});

InitialNode.displayName = "InitialNode";