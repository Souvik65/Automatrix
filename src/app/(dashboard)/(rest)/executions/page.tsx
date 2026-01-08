import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { executionsParamsLoader } from "@/features/executions/server/params-loader";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import { ExecutionsContainer, ExecutionsError, ExecutionsList } from "@/features/executions/components/executions";
import { Loading } from "@/components/ui/loading";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    await requireAuth();

    const params = await executionsParamsLoader(searchParams);
    prefetchExecutions(params);
    
    return (
        <ExecutionsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<ExecutionsError />}>
                    <Suspense fallback={
                        <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
                            <Loading size="lg" text="Loading credentials..." />
                        </div>
                    }>
                        <ExecutionsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </ExecutionsContainer>
    )
};

export default Page;