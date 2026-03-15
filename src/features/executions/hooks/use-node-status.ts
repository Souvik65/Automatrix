import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useState, useRef, useCallback } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

interface UseNodeStatusOptions {
    nodeId: string;
    channel: string;
    topic: string;
    refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export function useNodeStatus({
    nodeId,
    channel,
    topic,
    refreshToken,
}: UseNodeStatusOptions) {
    const [status, setStatus] = useState<NodeStatus>("initial");

    const refreshRef = useRef(refreshToken);
    useEffect(() => {
        refreshRef.current = refreshToken;
    }, [refreshToken]);
    
    const stableRefreshToken = useCallback(() => refreshRef.current(), []);

    const { data } = useInngestSubscription({
        refreshToken: stableRefreshToken,
        enabled: true,
    });

    useEffect(() => {
        if (!data?.length) {
            return;
        }

        // Find the latest message for this node
        const latestMessage = data
            .filter(
                (msg) => 
                    msg.kind === "data" &&
                    msg.channel === channel &&
                    msg.topic === topic &&
                    msg.data.nodeId === nodeId,
            )
            .sort((a, b) => {
                if (a.kind === "data" && b.kind === "data") {
                    return (
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                }
                return 0;
            })[0];

        if (latestMessage?.kind === "data") {
            const rawStatus = latestMessage.data.status as string;
            let mappedStatus: NodeStatus = "initial";
            if (rawStatus === "RUNNING" || rawStatus === "loading") mappedStatus = "loading";
            if (rawStatus === "SUCCESS" || rawStatus === "success") mappedStatus = "success";
            if (rawStatus === "FAILED" || rawStatus === "ERROR" || rawStatus === "error") mappedStatus = "error";
            
            setStatus(mappedStatus);
        }  
    }, [data, nodeId, channel, topic]);
    return status;
};