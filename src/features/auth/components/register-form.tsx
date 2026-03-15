"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
    MailIcon, LockIcon, ArrowRightIcon, EyeIcon, EyeOffIcon, UserIcon, ShieldCheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { LoadingSpinner } from "@/components/ui/loading";
import { useState } from "react";
import Image from "next/image";

const registerSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email({ message: "Enter a valid email address" }),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
        acceptTerms: z.boolean().refine((val) => val === true, {
            message: "You must accept Terms & Privacy Policy",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const colors = ["#ef4444", "#f59e0b", "#22c55e", "#16a34a"];
    const labels = ["Weak", "Fair", "Good", "Strong"];
    return { score, label: labels[score - 1] ?? "Weak", color: colors[score - 1] ?? "#ef4444", percent: (score / 4) * 100 };
};

const checkPasswordRules = (password: string) => ({
    length: password.length >= 8,
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
});

export function RegisterForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", password: "", confirmPassword: "", acceptTerms: false },
    });

    const acceptTerms = form.watch("acceptTerms");
    const passwordValue = form.watch("password");
    const strength = getPasswordStrength(passwordValue || "");
    const rules = checkPasswordRules(passwordValue || "");

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

    const onSubmit = async (values: RegisterFormValues) => {
        await authClient.signUp.email(
            { name: values.name, email: values.email, password: values.password, callbackURL: "/" },
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
                {/* Colored top bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 rounded-t-3xl" />

                {/* Header */}
                <div className="text-center mb-6 relative mt-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        Create account
                    </h1>
                    <p className="text-gray-500 text-sm">Get started with Automatrix today</p>
                </div>

                {/* Social Buttons */}
                <div className="space-y-3 mb-5 relative">
                    <Button
                        onClick={signInGithub}
                        variant="outline"
                        size="lg"
                        className="w-full h-11 font-medium rounded-xl border-2 border-gray-200 bg-white hover:border-gray-900 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-300 group"
                        type="button"
                        disabled={isPending}
                    >
                        <div className="w-4 h-4 mr-3 relative transition-transform duration-300 group-hover:scale-110">
                            <Image src="/logos/github.svg" alt="GitHub" fill className="object-contain" />
                        </div>
                        Continue with GitHub
                    </Button>
                    <Button
                        onClick={signInGoogle}
                        variant="outline"
                        size="lg"
                        className="w-full h-11 font-medium rounded-xl border-2 border-gray-200 bg-white hover:border-[#4285F4] hover:bg-blue-50 text-gray-700 hover:text-[#4285F4] transition-all duration-300 group"
                        type="button"
                        disabled={isPending}
                    >
                        <div className="w-4 h-4 mr-3 relative transition-transform duration-300 group-hover:scale-110">
                            <Image src="/logos/google.svg" alt="Google" fill className="object-contain" />
                        </div>
                        Continue with Google
                    </Button>
                </div>

                {/* Divider */}
                <div className="relative mb-5">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white text-gray-400">or continue with email</span>
                    </div>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative">
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                placeholder="John Doe"
                                                className="h-11 pl-10 bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-purple-500 focus:bg-white transition-all"
                                                {...field}
                                                disabled={isPending}
                                            />
                                            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />

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
                                                className="h-11 pl-10 bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-purple-500 focus:bg-white transition-all"
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
                                    <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create a password"
                                                className="h-11 pl-10 pr-10 bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-purple-500 focus:bg-white transition-all"
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

                                    {/* Strength bar */}
                                    {passwordValue && (
                                        <div className="mt-2 space-y-1.5">
                                            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${strength.percent}%`, backgroundColor: strength.color }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-gray-500">
                                                    Strength: <span className="font-medium" style={{ color: strength.color }}>{strength.label}</span>
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    {[
                                                        { ok: rules.length, label: "8+ chars" },
                                                        { ok: rules.number, label: "number" },
                                                        { ok: rules.special, label: "symbol" },
                                                    ].map(({ ok, label }) => (
                                                        <span key={label} className={`text-[10px] px-1.5 py-0.5 rounded-full border ${ok ? "border-green-500 text-green-600 bg-green-50" : "border-gray-200 text-gray-400"}`}>
                                                            {label}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm your password"
                                                className="h-11 pl-10 pr-10 bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-purple-500 focus:bg-white transition-all"
                                                {...field}
                                                disabled={isPending}
                                            />
                                            <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Terms */}
                        <FormField
                            control={form.control}
                            name="acceptTerms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <label className="flex items-start gap-3 text-xs text-gray-500 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                className="hidden"
                                            />
                                            <div
                                                className={`mt-0.5 w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 
                                                ${field.value ? "bg-purple-600 border-purple-600" : "border-gray-300 group-hover:border-purple-400"}`}
                                            >
                                                <svg
                                                    className={`w-2.5 h-2.5 text-white transition-all ${field.value ? "opacity-100" : "opacity-0"}`}
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                                                >
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </div>
                                            <span className="leading-relaxed">
                                                By signing up, you agree to our{" "}
                                                <Link href="#" className="text-purple-600 hover:text-purple-700 font-medium">Terms</Link>{" "}and{" "}
                                                <Link href="#" className="text-purple-600 hover:text-purple-700 font-medium">Privacy Policy</Link>
                                            </span>
                                        </label>
                                    </FormControl>
                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Submit */}
                        <Button
                            type="submit"
                            size="lg"
                            className={`w-full h-12 font-semibold rounded-xl text-white transition-all duration-500 mt-1
                                ${acceptTerms
                                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                                    : "bg-gray-100 border border-gray-200 text-gray-300 cursor-not-allowed"
                                }`}
                            disabled={isPending || !acceptTerms}
                        >
                            {isPending ? (
                                <LoadingSpinner className="w-5 h-5" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Create account
                                    <ArrowRightIcon className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>
                </Form>

                {/* Footer */}
                <div className="mt-5 text-center relative">
                    <p className="text-xs text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Security Badge */}
            <div className="mt-5 flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-200 bg-green-50">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs text-green-600/80">Your data is encrypted and secure</span>
            </div>
        </div>
    );
}