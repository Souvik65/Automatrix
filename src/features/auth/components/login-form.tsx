"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MailIcon, LockIcon, ArrowRightIcon, EyeIcon, EyeOffIcon, GithubIcon, Chrome, ShieldCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import Image from "next/image";

const loginSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

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
        await authClient.signIn. social(
            {
                provider: "github",
            },
            {
                onSuccess: () => {
                    router.push("/");
                },
                onError: () => {
                    toast.error("Error signing in with Github");
                },
            }
        );
    };

    const signInGoogle = async () => {
        await authClient.signIn. social(
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
        <div className="min-w-[320px] w-full flex flex-col items-center">
            {/* Logo and Automatrix for mobile view */}
            <div className="md:hidden flex items-center justify-center mb-6">
                <Image
                    src="/logos/logo.svg" // Assuming logo path, adjust if needed
                    alt="Automatrix Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                />
                <span className="ml-3 text-4xl font-bold text-gray-900 dark:text-white">Automatrix</span>
            </div>

            {/* Main Card - Ultra Clean Design */}
            <div className="relative w-full max-w-[440px]">
                {/* Card */}
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                    {/* Minimalist Header */}
                    <div className="text-center mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:text-white mb-3">
                            Welcome back
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Social Buttons - Clean Style */}
                    <div className="space-y-3 mb-8">
                        <Button
                            onClick={signInGithub}
                            variant="outline"
                            size="lg"
                            className="
                                w-full h-12 md:h-14 text-sm md:text-base font-medium 
                                border-2 border-gray-200 dark:border-gray-700 
                                rounded-full transition-all duration-300
                                hover:border-black dark:hover:border-white
                                hover:bg-black/5 dark:hover:bg-white/10
                                hover:text-black dark:hover:text-white
                                group
                            "
                            type="button"
                            disabled={isPending}
                        >
                            <div className="w-4 h-4 md:w-5 md:h-5 mr-3 relative transition-transform duration-300 group-hover:scale-180">
                                <Image
                                    src="/logos/github.svg"
                                    alt="GitHub"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            Continue with GitHub
                        </Button>


                        <Button
                            onClick={signInGoogle}
                            variant="outline"
                            size="lg"
                            className="
                                w-full h-12 md:h-14 text-sm md:text-base font-medium 
                                border-2 border-gray-200 dark:border-gray-700 
                                rounded-full transition-all duration-300
                                hover:border-[#4285F4] 
                                hover:bg-[#4285F4]/5 
                                hover:text-[#4285F4]
                                group
                            "
                            type="button"
                            disabled={isPending}
                        >
                            <div className="w-4 h-4 md:w-5 md:h-5 mr-3 relative transition-transform duration-300 group-hover:scale-180">
                                <Image
                                    src="/logos/google.svg"
                                    alt="Google"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            Continue with Google
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 font-medium">
                                or
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="email"
                                                    placeholder="name@company.com"
                                                    className="h-12 md:h-14 pl-10 md:pl-12 text-sm md:text-base border-2 focus:border-purple-500 dark:focus:border-purple-500 rounded-xl"
                                                    {...field}
                                                    disabled={isPending}
                                                />
                                                <MailIcon className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between mb-1">
                                            <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                Password
                                            </FormLabel>
                                            <Link
                                                href="/forgot-password"
                                                className="text-xs md:text-sm font-bold text-blue-600 hover:text-purple-700 dark:text-purple-400"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ?  "text" : "password"}
                                                    placeholder="Enter your password"
                                                    className="h-12 md:h-14 pl-10 md:pl-12 pr-10 md:pr-12 text-sm md:text-base border-2 focus:border-purple-500 dark:focus:border-purple-500 rounded-xl"
                                                    {...field}
                                                    disabled={isPending}
                                                />
                                                <LockIcon className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {showPassword ? (
                                                        <EyeOffIcon className="w-4 h-4 md:w-5 md:h-5" />
                                                    ) : (
                                                        <EyeIcon className="w-4 h-4 md:w-5 md:h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-12 md:h-14 text-sm md:text-base font-semibold 
                                            bg-gradient-to-r from-purple-600 to-blue-600 
                                            hover:from-blue-700 hover:to-blue-700
                                            text-white rounded-xl 
                                            shadow-lg shadow-purple-500/20 
                                            hover:shadow-xl hover:shadow-blue-500/30 
                                            transition-all duration-500 ease-in-out "
                                disabled={isPending}
                                >
                                {isPending ? (
                                    <LoadingSpinner className="w-4 h-4 md:w-5 md:h-5" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Sign in
                                        <ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Footer */}
                    <div className="mt-4 text-center">
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400"
                            >
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 pt-6 md:pt-8">
                        <div className="flex items-center px-3 md:px-4 py-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-full">
                            <ShieldCheckIcon className="w-3 h-3 md:w-4 md:h-4 text-green-600 dark:text-green-400" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-300 ml-2">
                                Your data is encrypted and secure
                            </span>
                        </div>
                    </div>
                </div>

                {/* Subtle decoration */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-purple-500/5 rounded-full blur-3xl -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 md:w-32 md:h-32 bg-blue-500/5 rounded-full blur-3xl -z-10" />

            </div>
        </div>
    );
}