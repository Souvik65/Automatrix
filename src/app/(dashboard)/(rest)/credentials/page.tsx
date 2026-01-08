import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { CredentialsContainer, CredentialsError, CredentialsList } from "@/features/credentials/components/credentials";
import { Loading } from "@/components/ui/loading";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    await requireAuth();

    const params = await credentialsParamsLoader(searchParams);
    prefetchCredentials(params);
    
    return (
        <CredentialsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<CredentialsError />}>
                    <Suspense fallback={
                        <div className="flex items-center justify-center h-full min-h-[400px]">
                            <Loading size="md" text="Loading credentials..." />
                        </div>
                    }>
                        <CredentialsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </CredentialsContainer>
    )
};

export default Page;