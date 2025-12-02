"use client";

import { useState, useCallback } from "react";
import { 
    ReactFlow, 
    applyNodeChanges, 
    applyEdgeChanges, 
    addEdge, 
    type Node, 
    type Edge, 
    type NodeChange,
    type EdgeChange,
    type Connection,
    Background,
    Controls,
    MiniMap,
    Panel,
} from "@xyflow/react";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

import '@xyflow/react/dist/style.css';
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";

export const EditorLoading = () => {
    return <LoadingView message="Loading workflow..." />;
};

export const EditorError = () => {
    return <ErrorView message="Failed to load workflow." />;
}

export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { 
        data: workflow 
    } = useSuspenseWorkflow(workflowId);

    const setEditor = useSetAtom(editorAtom);

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);


    const onNodesChange = useCallback(
        (changes:NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );



    return (
        <div className="size-full">
            <ReactFlow 
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeComponents}
                onInit={setEditor}
                fitView
                snapGrid={[10, 10]}
                // snapToGrid //use for snapping nodes to grid
                zoomOnScroll={true}
                // panOnScroll={true} // enable panning when scrolling
                // panOnDrag={true} // enable panning when dragging the canvas
                // proOptions={{ hideAttribution: true}} // hide reactflow watermark attribution
            >
                <Background />
                <Controls />
                <MiniMap />
                <Panel position="top-right">
                    <AddNodeButton />
                </Panel>
            </ReactFlow>
        </div>
    );
};