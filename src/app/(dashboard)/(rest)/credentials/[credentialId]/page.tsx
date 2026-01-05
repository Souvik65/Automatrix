import { CredentialView } from "@/features/credentials/components/credential";
import { CredentialsError, CredentialsLoading } from "@/features/credentials/components/credentials";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { Loading } from "@/components/ui/loading";

interface PageProps {
    params: Promise<{
        credentialId: string;
    }>
};

const Page = async ({params }: PageProps) => {
    await requireAuth();
    const { credentialId } = await params;
    prefetchCredential(credentialId);

    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full animate-scale-in">
                <HydrateClient>
                    <ErrorBoundary fallback={<CredentialsError />}>
                        <Suspense fallback={<Loading size="lg" text="Loading credential..." />}>
                            <EnhancedCard variant="glass" shimmer>
                                <CredentialView credentialId={credentialId}/>
                            </EnhancedCard>
                        </Suspense>
                    </ErrorBoundary>
                </HydrateClient>
            </div>
        </div>
    )
};

export default Page;