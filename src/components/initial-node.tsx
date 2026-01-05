"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon, SparklesIcon } from "lucide-react";
import { memo, useState } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

export const InitialNode = memo((props: NodeProps) => {
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
            <WorkflowNode showToolbar={false}>
                <PlaceholderNode
                    {... props}
                    onClick={() => setSelectorOpen(true)}
                >
                    <div 
                        className="group relative cursor-pointer flex items-center justify-center aspect-square transition-all duration-300"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Animated ring on hover */}
                        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                            isHovered ? 'animate-pulse-ring' : ''
                        }`} />
                        
                        {/* Gradient background with glow effect */}
                        <div className="relative w-14 h-14 rounded-full bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/50 group-hover:scale-110 transition-all duration-300">
                            <PlusIcon className="w-7 h-7 text-white group-hover:rotate-90 transition-transform duration-300" />
                            
                            {/* Sparkle effect on hover */}
                            {isHovered && (
                                <SparklesIcon className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                            )}
                        </div>
                        
                        {/* Floating particles effect */}
                        <div 
                            className="absolute -z-10 w-2 h-2 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 group-hover:animate-float" 
                            style={{top: '-10px', left: '10px'}} 
                        />
                        <div 
                            className="absolute -z-10 w-2 h-2 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 group-hover:animate-float" 
                            style={{bottom: '-10px', right: '10px', animationDelay: '0.5s'}} 
                        />
                        <div 
                            className="absolute -z-10 w-1. 5 h-1.5 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100 group-hover:animate-float" 
                            style={{top: '5px', right: '-15px', animationDelay: '0.3s'}} 
                        />
                        
                        {/* Helper text */}
                        <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Click to add node
                        </p>
                    </div>
                </PlaceholderNode>
            </WorkflowNode>
        </NodeSelector>
    )
});

InitialNode.displayName = "InitialNode";