"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UserIcon, MailIcon, LockIcon, ArrowRightIcon, EyeOffIcon, EyeIcon } from "lucide-react";
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
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { useState } from "react";
import { useToastNotification } from "@/hooks/use-toast-notification";  

// Profile update schema (only name is editable)
const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

// Password change schema
const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export const AccountForm = () => {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { showSuccess, showError } = useToastNotification();

    // Profile form
    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
        },
        mode: "onChange",
    });

    // Password form
    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const onProfileSubmit = async (values: ProfileFormValues) => {
        setIsUpdatingProfile(true);
        try {
            await authClient.updateUser({
                name: values.name,
            }, {
                onSuccess: () => {
                    showSuccess("Profile updated successfully!");
                    router.refresh(); // Refresh to update session
                },
                onError: (ctx) => {
                    showError(ctx.error.message);
                },
            });
        } catch (error) {
            showError("Failed to update profile.");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const onPasswordSubmit = async (values: PasswordFormValues) => {
        setIsChangingPassword(true);
        try {
            await authClient.changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            }, {
                onSuccess: () => {
                    showSuccess("Password changed successfully!");
                    passwordForm.reset();
                },
                onError: (ctx) => {
                    // Customize the error message
                    const message = ctx.error.message === "Invalid password" ? "Old password incorrect" : ctx.error.message;
                    showError(message);
                },
            });
        } catch (error) {
            showError("Failed to change password.");
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Profile Section */}
            <EnhancedCard variant="glass" shimmer>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>
                        Update your personal details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                            {/* // Name Field */}
                            <FormField
                                control={profileForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                                        <FormControl>
                                            <div className="relative group/input">
                                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                                                <Input
                                                    type="text"
                                                    placeholder="Your full name"
                                                    className="h-12 pl-11 glass-effect border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                    {...field}
                                                    disabled={isUpdatingProfile}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* // Email (read-only) */}
                            <FormItem>
                                <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                                <FormControl>
                                    <div className="relative group/input">
                                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            value={user?.email || ""}
                                            className="h-12 pl-11 glass-effect border-white/20 bg-muted/50 cursor-not-allowed"
                                            disabled
                                        />
                                    </div>
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                    Email cannot be changed. Contact support if needed.
                                </p>
                            </FormItem>
                               

                            <Button
                                type="submit"
                                className=" h-12 gradient-bg-primary hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:shadow-purple-500/50 font-semibold text-base group/submit"
                                disabled={isUpdatingProfile}
                            >
                                {isUpdatingProfile ? (
                                    <LoadingSpinner className="w-5 h-5" />
                                ) : (
                                    <>
                                        <span>Update Profile</span>
                                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/submit:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </EnhancedCard>

            {/* Password Change Section */}
            <EnhancedCard variant="glass" shimmer>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LockIcon className="w-5 h-5" />
                        Change Password
                    </CardTitle>
                    <CardDescription>
                        Update your password for better security.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Current Password</FormLabel>
                                        <FormControl>
                                            <div className="relative group/input">
                                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                                                <Input
                                                    type={showCurrentPassword ? "text" : "password"}  // Updated
                                                    placeholder="Enter current password"
                                                    className="h-12 pl-11 pr-11 glass-effect border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                    {...field}
                                                    disabled={isChangingPassword}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground hover:text-foreground"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                >
                                                    {showCurrentPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative group/input">
                                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                                                <Input
                                                    type={showNewPassword ? "text" : "password"}  // Updated
                                                    placeholder="Enter new password"
                                                    className="h-12 pl-11 pr-11 glass-effect border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                    {...field}
                                                    disabled={isChangingPassword}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground hover:text-foreground"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Confirm New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative group/input">
                                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}  // Updated
                                                    placeholder="Confirm new password"
                                                    className="h-12 pl-11 pr-11 glass-effect border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                    {...field}
                                                    disabled={isChangingPassword}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground hover:text-foreground"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className=" h-12 gradient-bg-primary hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:shadow-purple-500/50 font-semibold text-base group/submit"
                                disabled={isChangingPassword}
                            >
                                {isChangingPassword ? (
                                    <LoadingSpinner className="w-5 h-5" />
                                ) : (
                                    <>
                                        <span>Change Password</span>
                                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/submit:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </EnhancedCard>
        </div>
    );
};