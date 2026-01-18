"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MailIcon, LockIcon, ArrowRightIcon, EyeIcon, EyeOffIcon } from "lucide-react";
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
import { authClient } from "@/lib/auth-client";
import { LoadingSpinner } from "@/components/ui/loading";
import { useState } from "react";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z. infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver:  zodResolver(loginSchema),
        defaultValues: {
            email:  "",
            password: "",
        },
    });

    const signInGithub = async () => {
        await authClient.signIn.social(
            {
                provider: "github",
            },
            {
                onSuccess: () => {
                    router.push("/");
                },
                onError:  () => {
                    toast.error("Error signing in with Github");
                },
            }
        );
    };

    const signInGoogle = async () => {
        await authClient. signIn.social(
            {
                provider: "google",
            },
            {
                onSuccess: () => {
                    router.push("/");
                },
                onError: () => {
                    toast.error("Error signing in with Google");
                },
            }
        );
    };

    const onSubmit = async (values: LoginFormValues) => {
        await authClient.signIn.email(
            {
                email: values.email,
                password: values.password,
                callbackURL: "/",
            },
            {
                onSuccess: () => {
                    router.push("/");
                },
                onError: (ctx) => {
                    toast. error(ctx.error.message);
                },
            }
        );
    };

    const isPending = form.formState.isSubmitting;

    return (
        <div className="flex flex-col gap-6">
            {/* Main Card */}
            <div className="relative group">
                {/* Gradient border effect */}
                <div className="absolute -inset-0.5 gradient-bg-primary rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity" />

                <Card className="relative glass-card border-white/20 rounded-2xl shadow-2xl">
                    <CardHeader className="text-center pb-6 space-y-2">
                        <CardTitle className="text-3xl font-bold gradient-text">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-base">
                            Sign in to continue your automation journey
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Social Login Buttons */}
                        <div className="grid gap-3">
                            <Button
                                onClick={signInGithub}
                                variant="outline"
                                className="w-full h-12 glass-effect hover:bg-accent/50 border-white/20 group/btn relative overflow-hidden transition-all hover-scale"
                                type="button"
                                disabled={isPending}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 relative">
                                        <Image
                                            src="/logos/github.svg"
                                            alt="Github"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="font-medium">Continue with Github</span>
                                </div>
                                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </Button>

                            <Button
                                onClick={signInGoogle}
                                variant="outline"
                                className="w-full h-12 glass-effect hover:bg-accent/50 border-white/20 group/btn relative overflow-hidden transition-all hover-scale"
                                type="button"
                                disabled={isPending}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 relative">
                                        <Image
                                            src="/logos/google.svg"
                                            alt="Google"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="font-medium">Continue with Google</span>
                                </div>
                                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-4 text-muted-foreground font-medium">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        {/* Email/Password Form */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                                            <FormControl>
                                                <div className="relative group/input">
                                                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                                                    <Input
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        className="h-12 pl-11 glass-effect border-white/20 focus: border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                        {...field}
                                                        disabled={isPending}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Password</FormLabel>
                                            <FormControl>
                                                <div className="relative group/input">
                                                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        className="h-12 pl-11 pr-11 glass-effect border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                        {...field}
                                                        disabled={isPending}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOffIcon className="w-5 h-5" />
                                                        ) : (
                                                            <EyeIcon className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Forgot Password */}
                                <div className="flex justify-end">
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-primary hover:underline font-medium"
                                    >
                                        Forgot password? 
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className={cn(
                                        "w-full h-12 gradient-bg-primary hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover: shadow-purple-500/50 font-semibold text-base group/submit",
                                        isPending && "opacity-70"
                                    )}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <LoadingSpinner className="w-5 h-5" />
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/submit:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        {/* Sign Up Link */}
                        <div className="text-center pt-4 border-t border-white/10">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link
                                    href="/signup"
                                    className="text-primary hover:underline font-semibold"
                                >
                                    Create one now
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <LockIcon className="w-3 h-3" />
                <span>Your data is encrypted and secure</span>
            </div>
        </div>
    );
}