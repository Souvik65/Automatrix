"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
    MailIcon, LockIcon, ArrowRightIcon, EyeIcon, EyeOffIcon, ShieldCheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const signInGithub = async () => {
        await authClient.signIn.social({ provider: "github" }, {
            onSuccess: () => { router.push("/"); },
            onError: () => { toast.error("Error signing in with Github"); },
        });
    };

    const signInGoogle = async () => {
        await authClient.signIn.social({ provider: "google" }, {
            onSuccess: () => { router.push("/"); },
            onError: () => { toast.error("Error signing in with Google"); },
        });
    };

    const onSubmit = async (values: LoginFormValues) => {
        await authClient.signIn.email(
            { email: values.email, password: values.password, callbackURL: "/" },
            {
                onSuccess: () => { router.push("/"); },
                onError: (ctx) => { toast.error(ctx.error.message); },
            }
        );
    };

    const isPending = form.formState.isSubmitting;

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* White card */}
            <div className="relative w-full max-w-[440px] rounded-3xl border border-gray-100 bg-white shadow-xl shadow-purple-100/60 p-8 overflow-hidden">
                {/* Subtle top gradient accent */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 rounded-t-3xl" />

                {/* Header */}
                <div className="text-center mb-8 relative mt-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        Welcome back
                    </h1>
                    <p className="text-gray-500 text-sm">Sign in to continue to Automatrix</p>
                </div>

                {/* Social Buttons */}
                <div className="space-y-3 mb-6 relative">
                    <Button
                        onClick={signInGithub}
                        variant="outline"
                        size="lg"
                        className="w-full h-12 font-medium rounded-xl border-2 border-gray-200 bg-white hover:border-gray-900 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-300 group"
                        type="button"
                        disabled={isPending}
                    >
                        <div className="w-5 h-5 mr-3 relative transition-transform duration-300 group-hover:scale-110">
                            <Image src="/logos/github.svg" alt="GitHub" fill className="object-contain" />
                        </div>
                        Continue with GitHub
                    </Button>

                    <Button
                        onClick={signInGoogle}
                        variant="outline"
                        size="lg"
                        className="w-full h-12 font-medium rounded-xl border-2 border-gray-200 bg-white hover:border-[#4285F4] hover:bg-blue-50 text-gray-700 hover:text-[#4285F4] transition-all duration-300 group"
                        type="button"
                        disabled={isPending}
                    >
                        <div className="w-5 h-5 mr-3 relative transition-transform duration-300 group-hover:scale-110">
                            <Image src="/logos/google.svg" alt="Google" fill className="object-contain" />
                        </div>
                        Continue with Google
                    </Button>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white text-gray-400 font-medium">or continue with email</span>
                    </div>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative">
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="email"
                                                placeholder="name@company.com"
                                                className="h-12 pl-11 bg-gray-50 border-gray-200 border-2 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-purple-500 focus:bg-white transition-all"
                                                {...field}
                                                disabled={isPending}
                                            />
                                            <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400 text-xs" />
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
                                        <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</FormLabel>
                                        <Link href="/forgot-password" className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                className="h-12 pl-11 pr-11 bg-gray-50 border-gray-200 border-2 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-purple-500 focus:bg-white transition-all"
                                                {...field}
                                                disabled={isPending}
                                            />
                                            <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Submit */}
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-12 font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 mt-2"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <LoadingSpinner className="w-5 h-5" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Sign in
                                    <ArrowRightIcon className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>
                </Form>

                {/* Footer */}
                <div className="mt-6 text-center relative">
                    <p className="text-xs text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>

            {/* Security Badge */}
            <div className="mt-5 flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/5">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs text-green-400/70">Your data is encrypted and secure</span>
            </div>
        </div>
    );
}