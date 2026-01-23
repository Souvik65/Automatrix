"use client";

import { AccountForm } from "@/features/auth/components/account-form";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();

    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-6xl w-full flex flex-col gap-y-8 h-full">
                {/* Page Header with Back Button */}
                <div className="flex items-center gap-4 animate-fade-in">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="hover:bg-accent/50 rounded-lg transition-all hover:scale-105 hover:-translate-x-1"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            My Account
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your account settings and preferences. 
                        </p>
                    </div>
                </div>

                <AccountForm />
            </div>
        </div>
    );
};

export default Page;