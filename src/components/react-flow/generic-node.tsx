import React from "react";
import { type NodeProps } from "@xyflow/react";
import { PlaceholderNode } from "./placeholder-node";

export function GenericNode(props: NodeProps) {
  return (
    <PlaceholderNode {...props}>
      <div className="font-semibold text-sm">
        {props.type?.replace(/_/g, " ")}
      </div>
    </PlaceholderNode>
  );
}
