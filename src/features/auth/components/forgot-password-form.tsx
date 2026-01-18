"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { 
    MailIcon, 
    ArrowLeftIcon, 
    CheckCircle2Icon,
    LockIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";
import { useState } from "react";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
    email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
    const router = useRouter();
    const [emailSent, setEmailSent] = useState(false);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues:  {
            email: "",
        },
    });

    const onSubmit = async (values: ForgotPasswordFormValues) => {
        try {
            // TODO: Implement forgot password with better-auth
            // await authClient.forgetPassword({ email: values.email });
            
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            
            setEmailSent(true);
            toast.success("Password reset link sent to your email");
        } catch (error) {
            toast.error("Failed to send reset link. Please try again.");
        }
    };

    const isPending = form.formState.isSubmitting;

    if (emailSent) {
        return (
            <div className="flex flex-col gap-6">
                <div className="relative group">
                    <div className="absolute -inset-0.5 gradient-bg-primary rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity" />
                    
                    <Card className="relative glass-card border-white/20 rounded-2xl shadow-2xl">
                        <CardContent className="pt-12 pb-8">
                            {/* Success Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full glass-effect flex items-center justify-center animate-scale-in">
                                    <div className="w-16 h-16 rounded-full gradient-bg-success flex items-center justify-center animate-glow-pulse">
                                        <CheckCircle2Icon className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Success Message */}
                            <div className="text-center space-y-4 mb-8">
                                <h2 className="text-2xl font-bold gradient-text">
                                    Check Your Email
                                </h2>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    We've sent a password reset link to{" "}
                                    <span className="font-semibold text-foreground">
                                        {form.getValues("email")}
                                    </span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    The link will expire in 24 hours. If you don't see the email,
                                    check your spam folder. 
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <Button
                                    onClick={() => router.push("/login")}
                                    className="w-full h-12 gradient-bg-primary hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:shadow-purple-500/50 font-semibold"
                                >
                                    Back to Login
                                </Button>
                                
                                <Button
                                    onClick={() => setEmailSent(false)}
                                    variant="ghost"
                                    className="w-full h-12"
                                >
                                    Resend Email
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Back Button */}
            <Link
                href="/login"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group w-fit"
            >
                <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to login
            </Link>

            {/* Main Card */}
            <div className="relative group">
                <div className="absolute -inset-0.5 gradient-bg-primary rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity" />

                <Card className="relative glass-card border-white/20 rounded-2xl shadow-2xl">
                    <CardHeader className="text-center pb-6 space-y-2">
                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-2xl glass-effect flex items-center justify-center">
                                <div className="w-12 h-12 rounded-xl gradient-bg-primary flex items-center justify-center">
                                    <LockIcon className="w-9 h-9" />
                                </div>
                            </div>
                        </div>

                        <CardTitle className="text-3xl font-bold gradient-text">
                            Forgot Password? 
                        </CardTitle>
                        <CardDescription className="text-base">
                            No worries! Enter your email and we'll send you reset instructions
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Email Address
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative group/input">
                                                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                                                    <Input
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        className="h-12 pl-11 glass-effect border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                        {...field}
                                                        disabled={isPending}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className={cn(
                                        "w-full h-12 gradient-bg-primary hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:shadow-purple-500/50 font-semibold text-base",
                                        isPending && "opacity-70"
                                    )}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <LoadingSpinner className="w-5 h-5" />
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </form>
                        </Form>

                        {/* Info Box */}
                        <div className="glass-effect border-white/10 rounded-xl p-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
                                    <MailIcon className="w-4 h-4 text-info" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Email not received?</p>
                                    <p className="text-xs text-muted-foreground">
                                        Check your spam folder or try resending after a few minutes
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}