import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";

export const topologicalSort = (
    nodes: Node[],
    connections: Connection[],
): Node[] => {
    //if no connections, return nodes as is
    if (connections.length === 0) {
        return nodes;
    }

    // Create edges for toposort
    const edges: [string,string][] = connections.map((conn) => [
        conn.fromNodeId,
        conn.toNodeId,
    ]);

    // Add nodes with no connections as self-edges to ensure they are included
    const connectedNodeIdes = new Set<string>();
    for (const conn of connections) {
        connectedNodeIdes.add(conn.fromNodeId);
        connectedNodeIdes.add(conn.toNodeId);
    }

    for (const node of nodes) {
        if (!connectedNodeIdes.has(node.id)) {
            edges.push([node.id, node.id]);
        }
    }

    //perfoem topological sort
    let sortedNodeIds: string[];
    try {
        sortedNodeIds = toposort(edges);
        // Remove duplicates (form self-edges)
        sortedNodeIds = [...new Set(sortedNodeIds)];
    } catch (error) {
        if (error instanceof Error && error.message.includes("Cyclic")) {
            throw new Error("Workflow contains a cycle");
        }
        throw error;
    }

    // Map sorted IDs back to nodes objects
    const nodeMap = new Map(nodes.map((n) => [n.id,n]));
    return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
}