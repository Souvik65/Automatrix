"use server";

import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { engineChannel, ENGINE_CHANNEL_NAME } from "@/inngest/channels/engine";

export type EngineToken = Realtime.Token<
    typeof engineChannel,
    ["status"]
>;

export async function fetchEngineRealtimeToken(): Promise<EngineToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: engineChannel(),
        topics: ["status"],
    });

    return token as any;
};
