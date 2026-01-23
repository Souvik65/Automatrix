"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
    MailIcon,
    LockIcon,
    ArrowRightIcon,
    EyeIcon,
    EyeOffIcon,
    UserIcon,
    ShieldCheckIcon,

} from "lucide-react";
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

export function RegisterForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
        },
    });

    const acceptTerms = form.watch("acceptTerms");

    //  ========== Password Strength Meter ==========       
    const getPasswordStrength = (password: string) => {
        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const levels = ["Weak", "Fair", "Good", "Strong"];
        return {
            score,
            label: levels[score - 1] || "Weak",
            percent: (score / 4) * 100,
        };
    };

    const checkPasswordRules = (password: string) => {
        return {
            length: password.length >= 8,
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };
    };


    const passwordValue = form.watch("password");
    // const strength = getPasswordStrength(passwordValue || "");
    const rules = checkPasswordRules(passwordValue || "");



    const signInGithub = async () => {
        await authClient.signIn.social(
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
        await authClient.signIn.social(
            { 
                provider: "google" 
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

    const onSubmit = async (values: RegisterFormValues) => {
        await authClient.signUp.email(
            {
                name: values.name,
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
                    src="/logos/logo.svg" 
                    alt="Automatrix Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                />
                <span className="ml-3 text-4xl font-bold text-gray-900 dark:text-white">Automatrix</span>
            </div>

            {/* Main Card */}
            <div className="relative w-full max-w-[440px]">
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                    {/* Header */}
                    <div className="text-center mb-6 md:mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-gray-900 dark:text-white mb-3">
                            Create account
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                            Get started with Automatrix today
                        </p>
                    </div>

                    {/* Social Buttons */}
                    <div className="space-y-3 mb-6 md:mb-8">
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
                    <div className="relative mb-3">
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
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">

                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            Full name
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className="h-12 md:h-14 pl-10 md:pl-12 text-sm md:text-base border-2 focus:border-purple-500 dark:focus:border-purple-500 rounded-xl"
                                                    {...field}
                                                    disabled={isPending}
                                                />
                                                <UserIcon className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                        <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            Password
                                        </FormLabel>

                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Create a password"
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
                                                    {showPassword ? <EyeOffIcon className="w-4 h-4 md:w-5 md:h-5" /> : <EyeIcon className="w-4 h-4 md:w-5 md:h-5" />}
                                                </button>
                                            </div>
                                        </FormControl>

                                        {/* Strength Bar */}
                                        {passwordValue && (
                                            <div className="mt-3 space-y-2">
                                                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full transition-all duration-300 rounded-full"
                                                        style={{
                                                            width: `${getPasswordStrength(passwordValue).percent}%`,
                                                            backgroundColor:
                                                                getPasswordStrength(passwordValue).score <= 1
                                                                    ? "#ef4444"
                                                                    : getPasswordStrength(passwordValue).score === 2
                                                                    ? "#f59e0b"
                                                                    : getPasswordStrength(passwordValue).score === 3
                                                                    ? "#22c55e"
                                                                    : "#16a34a",
                                                        }}
                                                    />
                                                </div>

                                                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    Strength:{" "}
                                                    <span className="font-semibold">
                                                        {getPasswordStrength(passwordValue).label}
                                                    </span>
                                                </p>

                                                {/* Password Rules Checklist */}
                                                <ul className="space-y-1 text-xs md:text-sm mt-2">
                                                    <li className={`flex items-center gap-2 ${rules.length ? "text-green-600" : "text-gray-500"}`}>
                                                        <span className={`w-3 h-3 md:w-4 md:h-4 flex items-center justify-center rounded-full border ${rules.length ? "bg-green-600 text-white border-green-600" : "border-gray-400"}`}>
                                                            ✓
                                                        </span>
                                                        At least 8 characters
                                                    </li>

                                                    <li className={`flex items-center gap-2 ${rules.number ? "text-green-600" : "text-gray-500"}`}>
                                                        <span className={`w-3 h-3 md:w-4 md:h-4 flex items-center justify-center rounded-full border ${rules.number ? "bg-green-600 text-white border-green-600" : "border-gray-400"}`}>
                                                            ✓
                                                        </span>
                                                        Contains a number
                                                    </li>

                                                    <li className={`flex items-center gap-2 ${rules.special ? "text-green-600" : "text-gray-500"}`}>
                                                        <span className={`w-3 h-3 md:w-4 md:h-4 flex items-center justify-center rounded-full border ${rules.special ? "bg-green-600 text-white border-green-600" : "border-gray-400"}`}>
                                                            ✓
                                                        </span>
                                                        Contains a special character
                                                    </li>
                                                </ul>
                                            </div>
                                        )}

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                            {/* Confirm Password */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            Confirm password
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirm your password"
                                                    className="h-12 md:h-14 pl-10 md:pl-12 pr-10 md:pr-12 text-sm md:text-base border-2 focus:border-purple-500 dark:focus:border-purple-500 rounded-xl"
                                                    {...field}
                                                    disabled={isPending}
                                                />
                                                <LockIcon className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {showConfirmPassword ? <EyeOffIcon className="w-4 h-4 md:w-5 md:h-5" /> : <EyeIcon className="w-4 h-4 md:w-5 md:h-5" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Terms */}
                            <FormField
                                control={form.control}
                                name="acceptTerms"
                                render={({ field }) => (
                                    <FormItem className="mt-4">
                                        <FormControl>
                                            <label className="flex items-start gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 cursor-pointer group">

                                                {/* Hidden native checkbox */}
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                    className="hidden"
                                                />

                                                {/* Custom animated checkbox */}
                                                <div
                                                    className={`w-4 h-4 md:w-5 md:h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 
                                                    ${field.value 
                                                        ? "bg-purple-600 border-purple-600 scale-105" 
                                                        : "border-gray-400 group-hover:border-purple-400"}`}
                                                >
                                                    <svg
                                                        className={`w-3 h-3 md:w-3.5 md:h-3.5 text-white transition-all duration-200 
                                                        ${field.value ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>

                                                {/* Text */}
                                                <span className="leading-snug">
                                                    By signing up, you agree to our{" "}
                                                    <Link href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                                                        Terms
                                                    </Link>{" "}
                                                    and{" "}
                                                    <Link href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                                                        Privacy Policy
                                                    </Link>
                                                </span>

                                            </label>
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />




                            {/* Submit Button */}
                            <Button
                                type="submit"
                                size="lg"
                                className={`w-full h-12 md:h-14 text-sm md:text-base font-semibold rounded-xl shadow-lg transition-all duration-500 ease-in-out mt-2
                                    ${acceptTerms 
                                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white hover:shadow-xl hover:shadow-blue-500/30" 
                                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed shadow-none"}
                                `}
                                disabled={isPending || !acceptTerms}
                            >
                                {isPending ? (
                                    <LoadingSpinner className="w-4 h-4 md:w-5 md:h-5" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Create account
                                        <ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5" />
                                    </span>
                                )}
                            </Button>

                        </form>
                    </Form>

                    {/* Footer */}
                    <div className="mt-6 md:mt-8 text-center">
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>


                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 pt-6 md:pt-8">
                    <div className="flex items-center px-3 md:px-4 py-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-full">
                        <ShieldCheckIcon className="w-3 h-3 md:w-4 md:h-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs md:text-sm font-medium text-green-700 dark:text-green-300">
                            Your data is encrypted and secure
                        </span>
                    </div>
                </div>

                {/* Glow blobs */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-purple-500/5 rounded-full blur-3xl -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 md:w-32 md:h-32 bg-blue-500/5 rounded-full blur-3xl -z-10" />
            </div>
        </div>
    );
}