import { requireAuth } from "@/lib/auth-utils";
import { AnalyticsDashboard } from "@/features/analytics/components/dashboard";

export default async function AnalyticsPage() {
    await requireAuth();
    return (
        <div className="h-full p-8 max-w-6xl mx-auto">
            <AnalyticsDashboard />
        </div>
    );
}
