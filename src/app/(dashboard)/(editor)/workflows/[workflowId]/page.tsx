import { Editor, EditorError, EditorLoading } from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Loading } from "@/components/ui/loading";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        workflowId: string;
    }>
};

const Page = async ({params }: PageProps) => {
    await requireAuth();
    const { workflowId } = await params;
    prefetchWorkflow(workflowId);

    return (
        <HydrateClient>
            <ErrorBoundary fallback={<EditorError />}>
                <div className="flex flex-col h-screen">
                    <Suspense fallback={<Loading size="lg" text="Loading workflow editor..." />}>
                        <EditorHeader workflowId={workflowId} />
                        <main className="flex-1 min-h-0 animate-slide-in-right">
                            <Editor workflowId={workflowId} />
                        </main>
                    </Suspense>
                </div>
            </ErrorBoundary>
        </HydrateClient>
    )
};

export default Page;