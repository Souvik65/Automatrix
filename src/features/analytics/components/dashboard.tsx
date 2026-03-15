"use client";

import { useMetrics } from "../hooks/use-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";

export const AnalyticsDashboard = () => {
    const { data: metrics, isLoading, isError } = useMetrics();

    if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2Icon className="animate-spin size-8 text-primary"/></div>;
    if (isError || !metrics) return <div className="p-8 text-center text-red-500">Failed to load analytics.</div>;

    const maxRuns = Math.max(...metrics.chartData.map(d => d.success + d.failed), 1); // Avoid division by 0

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">Monitor your workflow performance and execution history.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalExecutions}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg duration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round(metrics.avgDuration / 1000)}s</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.activeWorkflows}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Execution Trends (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[250px] w-full flex items-end gap-4 p-4 mt-8 bg-black/5 rounded-xl border border-black/5 border-dashed">
                        {metrics.chartData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                                <div className="w-full max-w-[40px] flex justify-center items-end gap-1 h-full mx-auto">
                                   <div className="w-1/2 bg-emerald-500 rounded-t-sm transition-all" style={{ height: `${Math.max((d.success / maxRuns) * 100, 2)}%` }} title={`Success: ${d.success}`}></div>
                                   <div className="w-1/2 bg-rose-500 rounded-t-sm transition-all" style={{ height: `${Math.max((d.failed / maxRuns) * 100, 2)}%` }} title={`Failed: ${d.failed}`}></div>
                                </div>
                                <span className="text-xs text-muted-foreground font-medium truncate">{d.date.split('-').slice(1).join('/')}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
