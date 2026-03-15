import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const analyticsRouter = createTRPCRouter({
    getMetrics: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.auth.user.id;

        // Total Executions
        const totalExecutions = await prisma.execution.count({
            where: { workflow: { userId } }
        });

        // Active Workflows
        const activeWorkflows = await prisma.workflow.count({
            where: { userId }
        });

        // Executions from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentExecutions = await prisma.execution.findMany({
            where: {
                workflow: { userId },
                startedAt: { gte: sevenDaysAgo }
            },
            select: {
                status: true,
                durationMs: true,
                startedAt: true,
            }
        });

        const successfulRuns = recentExecutions.filter(e => e.status === "COMPLETED").length;
        const failedRuns = recentExecutions.filter(e => e.status === "FAILED").length;
        
        let successRate = 0;
        if (successfulRuns + failedRuns > 0) {
            successRate = (successfulRuns / (successfulRuns + failedRuns)) * 100;
        }

        const completedWithDuration = recentExecutions.filter(e => e.status === "COMPLETED" && e.durationMs !== null);
        let avgDuration = 0;
        if (completedWithDuration.length > 0) {
            avgDuration = completedWithDuration.reduce((acc, curr) => acc + (curr.durationMs || 0), 0) / completedWithDuration.length;
        }

        // Daily chart data for Recharts (last 7 days)
        const dailyStats: Record<string, { date: string, success: number, failed: number, avgTime: number, totalTime: number }> = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            dailyStats[dateStr] = { date: dateStr, success: 0, failed: 0, avgTime: 0, totalTime: 0 };
        }

        recentExecutions.forEach(e => {
            const dateStr = new Date(e.startedAt).toISOString().split('T')[0];
            if (dailyStats[dateStr]) {
                if (e.status === "COMPLETED") {
                    dailyStats[dateStr].success += 1;
                    if (e.durationMs) {
                        dailyStats[dateStr].totalTime += e.durationMs;
                    }
                } else if (e.status === "FAILED") {
                    dailyStats[dateStr].failed += 1;
                }
            }
        });

        const chartData = Object.values(dailyStats).map(day => {
            day.avgTime = day.success > 0 ? (day.totalTime / day.success) : 0;
            return day;
        });

        return {
            totalExecutions,
            activeWorkflows,
            successRate,
            avgDuration,
            chartData,
        };
    })
});
