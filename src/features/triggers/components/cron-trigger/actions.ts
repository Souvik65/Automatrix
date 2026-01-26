"use server";

import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { cronTriggerChannel } from "@/inngest/channels/cron-trigger";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import * as parser from "cron-parser";

export type CronTriggerToken = Realtime.Token<
    typeof cronTriggerChannel,
    ["status"]
>;

export async function fetchCronTriggerRealtimeToken(): Promise<CronTriggerToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: cronTriggerChannel(),
        topics: ["status"],
    });

    return token;
}

export async function saveCronSchedule(params: {
    workflowId: string;
    nodeId: string;
    cronExpression: string;
    timezone: string;
    enabled: boolean;
}) {
    const { workflowId, nodeId, cronExpression, timezone, enabled } = params;

    // Calculate next run time
    
    const interval = parser.parseExpression(cronExpression, {
        currentDate: new Date(),
        tz: timezone,
    });
    const nextRunAt = interval.next().toDate();

    // Upsert cron schedule
    return await prisma.cronSchedule.upsert({
        where: { nodeId },
        create: {
            workflowId,
            nodeId,
            cronExpression,
            timezone,
            enabled,
            nextRunAt,
        },
        update: {
            cronExpression,
            timezone,
            enabled,
            nextRunAt,
        },
    });
}