import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const useMetrics = () => {
    const trpc = useTRPC();
    return useQuery(trpc.analytics.getMetrics.queryOptions());
};
