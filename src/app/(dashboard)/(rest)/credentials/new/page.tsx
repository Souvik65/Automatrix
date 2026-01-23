import { CredentialForm } from "@/features/credentials/components/credential";
import { requireAuth } from "@/lib/auth-utils";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { SparklesIcon } from "lucide-react";

const Page = async() => {
    await requireAuth();

    return ( 
        <div className="p-3 sm:p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-full sm:max-w-3xl w-full flex flex-col gap-y-4 sm:gap-y-8 h-full animate-scale-in">
                {/* Page Header */}
                <div className="space-y-4">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                        New Credential
                    </h1>
                    <p className="text-muted-foreground">
                        Add a new credential to connect with external services
                    </p>
                </div>

                <EnhancedCard variant="glass" shimmer>
                    <div className="p-6">
                        <CredentialForm />
                    </div>
                </EnhancedCard>
            </div>
        </div>
     );
}
 
export default Page;