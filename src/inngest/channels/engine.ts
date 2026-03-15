import { channel, topic } from "@inngest/realtime";

export const ENGINE_CHANNEL_NAME = "engine";

export const engineChannel = channel(ENGINE_CHANNEL_NAME)
    .addTopic(
        topic("status").type<{
            nodeId: string;
            status: "RUNNING" | "SUCCESS" | "FAILED";
        }>(),
    );
