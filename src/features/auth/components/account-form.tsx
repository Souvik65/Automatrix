"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
    UserIcon, 
    MailIcon, 
    LockIcon, 
    ArrowRightIcon, 
    EyeOffIcon, 
    EyeIcon,
    CalendarIcon,
    ClockIcon,
    ImageIcon,
    TrashIcon,
    DownloadIcon,
    AlertTriangleIcon,
    ShieldCheckIcon,
    ActivityIcon
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
import { authClient } from "@/lib/auth-client";
import { LoadingSpinner } from "@/components/ui/loading";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { useState, useRef } from "react";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

// Profile update schema
const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    image: z.string().optional(),
});

// Password change schema
const passwordSchema = z. object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z. string(),
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const trpc = useTRPC();
    
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.image || null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [isExportingData, setIsExportingData] = useState(false);
    
    const { showSuccess, showError } = useToastNotification();

    // Fetch usage statistics using the correct pattern
    const { data: workflowsData } = useQuery(trpc.workflows.getMany.queryOptions({ page:  1, search: "" }));
    const { data: credentialsData } = useQuery(trpc.credentials.getMany.queryOptions({ page: 1 }));
    // Note: Add executions if you have an endpoint
    // const { data: executionsData } = useQuery(trpc.executions.getMany.queryOptions({ page: 1 }));

    const stats = {
        workflows: workflowsData?.totalCount || 0,  // ✅ Changed from totalItems to totalCount
        executions: 0, // Replace with actual data when available
        credentials: credentialsData?.totalCount || 0,  // ✅ Changed from totalItems to totalCount
        successRate: 100, // Calculate this based on execution data
    };

    // Profile form
    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?. name || "",
            image: user?.image || "",
        },
        mode: "onChange",
    });

    // Password form
    const passwordForm = useForm<PasswordFormValues>({
        resolver:  zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Format date
    const formatDate = (date:  string | number | Date | undefined) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Format relative time for last active
    const formatRelativeTime = (date: string | number | Date | undefined) => {
        if (!date) return 'N/A';
        const now = new Date();
        const then = new Date(date);
        const diffInMs = now.getTime() - then.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' :  ''} ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        
        return formatDate(date);
    };

    // Handle avatar upload
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (! file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showError("Image size should be less than 5MB");
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showError("Please upload an image file");
            return;
        }

        setIsUploadingAvatar(true);
        
        try {
            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader. result as string);
            };
            reader.readAsDataURL(file);

            // TODO: Upload to your storage solution (e.g., Cloudinary, S3, etc.)
            // For now, we'll use base64
            const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader. readAsDataURL(file);
            });

            // Update user profile with new image
            await authClient.updateUser({
                image: base64, // In production, use the uploaded URL from your storage
            }, {
                onSuccess: () => {
                    showSuccess("Profile picture updated successfully!");
                    router.refresh();
                },
                onError: (ctx) => {
                    showError(ctx.error.message);
                    setAvatarPreview(user?.image || null);
                },
            });
        } catch (error) {
            showError("Failed to upload profile picture");
            setAvatarPreview(user?. image || null);
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const onProfileSubmit = async (values: ProfileFormValues) => {
        setIsUpdatingProfile(true);
        try {
            await authClient.updateUser({
                name: values.name,
            }, {
                onSuccess: () => {
                    showSuccess("Profile updated successfully!");
                    router.refresh();
                },
                onError: (ctx) => {
                    showError(ctx. error.message);
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

    // Handle account deletion
    const handleDeleteAccount = async () => {
        setIsDeletingAccount(true);
        try {
            // TODO: Implement account deletion API call
            // await authClient.deleteAccount();
            showSuccess("Account deletion request submitted.  You will receive a confirmation email.");
            // In production, redirect to home page after deletion
            // router.push('/');
        } catch (error) {
            showError("Failed to delete account.  Please try again.");
        } finally {
            setIsDeletingAccount(false);
        }
    };

    // Handle data export
    const handleExportData = async () => {
        setIsExportingData(true);
        try {
            // TODO: Implement data export API call
            
            // Mock data for demonstration
            const exportData = {
                user: {
                    id: user?.id,
                    name: user?.name,
                    email: user?.email,
                    emailVerified: user?.emailVerified,
                    createdAt: user?.createdAt,
                    updatedAt:  user?.updatedAt,
                },
                stats: stats,
                exportedAt: new Date().toISOString(),
            };

            // Create and download JSON file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document. createElement('a');
            a.href = url;
            a. download = `automatrix-data-export-${new Date().toISOString()}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            showSuccess("Your data has been exported successfully!");
        } catch (error) {
            showError("Failed to export data.  Please try again.");
        } finally {
            setIsExportingData(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg: grid-cols-3 gap-8">
            {/* Left Column - Profile & Account Info */}
            <div className="lg:col-span-2 space-y-8">
                {/* Profile Section */}
                <EnhancedCard variant="default" shimmer className="animate-slide-up overflow-hidden">
                    <CardHeader className="space-y-3 px-8 pt-8">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <UserIcon className="w-6 h-6" />
                            Profile Information
                        </CardTitle>
                        <CardDescription className="text-base">
                            Update your personal details and profile picture. 
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                                {/* Avatar Upload */}
                                <div className="flex items-center gap-8 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                                    <Avatar className="w-28 h-28 ring-4 ring-purple-500/20 transition-all hover:ring-purple-500/40 hover:scale-105">
                                        <AvatarImage src={avatarPreview || user?. image || undefined} alt={user?.name} />
                                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl font-bold">
                                            {user?.name ?  getInitials(user.name) : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-semibold text-lg">Profile Picture</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Upload a new avatar.  JPG, PNG or GIF.  Max 5MB.
                                        </p>
                                        <div className="flex flex-wrap gap-3 pt-2">
                                            {/* Upload Button */}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploadingAvatar}
                                                className="group/upload h-10 px-4"
                                            >
                                                {isUploadingAvatar ? (
                                                    <LoadingSpinner className="w-4 h-4 mr-2" />
                                                ) : (
                                                    <ImageIcon className="w-4 h-4 mr-2 group-hover/upload:scale-110 transition-transform" />
                                                )}
                                                Upload New
                                            </Button>

                                            {/* Cancel Button - Only show if there's a preview different from saved */}
                                            {avatarPreview && avatarPreview !== user?. image && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setAvatarPreview(user?.image || null);
                                                        if (fileInputRef.current) {
                                                            fileInputRef. current.value = '';
                                                        }
                                                    }}
                                                    className="text-muted-foreground hover:text-foreground h-10 px-4"
                                                    disabled={isUploadingAvatar}
                                                >
                                                    Cancel
                                                </Button>
                                            )}

                                            {/* Reset to Default Button - Only show if user has a custom image */}
                                            {user?.image && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={async () => {
                                                        setIsUploadingAvatar(true);
                                                        try {
                                                            await authClient. updateUser({
                                                                image:  null,
                                                            }, {
                                                                onSuccess: () => {
                                                                    setAvatarPreview(null);
                                                                    showSuccess("Profile picture reset to default!");
                                                                    router.refresh();
                                                                },
                                                                onError: (ctx) => {
                                                                    showError(ctx. error.message);
                                                                },
                                                            });
                                                        } catch (error) {
                                                            showError("Failed to reset profile picture");
                                                        } finally {
                                                            setIsUploadingAvatar(false);
                                                        }
                                                    }}
                                                    className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 h-10 px-4"
                                                    disabled={isUploadingAvatar}
                                                >
                                                    Reset to Default
                                                </Button>
                                            )}

                                            {/* Remove Button with AlertDialog - Only show if user has a saved custom image */}
                                            {user?. image && avatarPreview === user?.image && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive/90 h-10 px-4"
                                                            disabled={isUploadingAvatar}
                                                        >
                                                            <TrashIcon className="w-4 h-4 mr-2" />
                                                            Remove
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="flex items-center gap-2">
                                                                <ImageIcon className="w-5 h-5 text-destructive" />
                                                                Remove Profile Picture? 
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently remove your profile picture from your account.  
                                                                Your profile will display your initials instead.  You can always upload a new picture later.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel disabled={isUploadingAvatar}>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={async (e) => {
                                                                    e.preventDefault();
                                                                    setIsUploadingAvatar(true);
                                                                    try {
                                                                        await authClient. updateUser({
                                                                            image: "",
                                                                        }, {
                                                                            onSuccess: () => {
                                                                                setAvatarPreview(null);
                                                                                showSuccess("Profile picture removed!");
                                                                                router.refresh();
                                                                            },
                                                                            onError: (ctx) => {
                                                                                showError(ctx.error.message);
                                                                            },
                                                                        });
                                                                    } catch (error) {
                                                                        showError("Failed to remove profile picture");
                                                                    } finally {
                                                                        setIsUploadingAvatar(false);
                                                                    }
                                                                }}
                                                                className="bg-destructive hover: bg-destructive/90"
                                                                disabled={isUploadingAvatar}
                                                            >
                                                                {isUploadingAvatar ? (
                                                                    <LoadingSpinner className="w-4 h-4 mr-2" />
                                                                ) : (
                                                                    <TrashIcon className="w-4 h-4 mr-2" />
                                                                )}
                                                                Remove Picture
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </div>
                                </div>

                                {/* Name Field */}
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
                                                        className="h-12 pl-11 glass-effect border-white/20 focus: border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                        {... field}
                                                        disabled={isUpdatingProfile}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email (read-only) */}
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
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Email cannot be changed.  Contact support if needed.
                                    </p>
                                </FormItem>

                                <Button
                                    type="submit"
                                    className="w-full h-12 gradient-bg-primary hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:shadow-purple-500/50 font-semibold text-base group/submit"
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
                <EnhancedCard variant="default" shimmer className="animate-slide-up overflow-hidden" style={{ animationDelay: '0.1s' }}>
                    <CardHeader className="space-y-3 px-8 pt-8">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <LockIcon className="w-6 h-6" />
                            Change Password
                        </CardTitle>
                        <CardDescription className="text-base">
                            Update your password for better security.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm. handleSubmit(onPasswordSubmit)} className="space-y-6">
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
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        placeholder="Enter current password"
                                                        className="h-12 pl-11 pr-11 glass-effect border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                        {...field}
                                                        disabled={isChangingPassword}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
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
                                                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input: text-primary transition-colors" />
                                                    <Input
                                                        type={showNewPassword ?  "text" : "password"}
                                                        placeholder="Enter new password"
                                                        className="h-12 pl-11 pr-11 glass-effect border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                        {... field}
                                                        disabled={isChangingPassword}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    >
                                                        {showNewPassword ? <EyeOffIcon className="w-4 h-4" /> :  <EyeIcon className="w-4 h-4" />}
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
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Confirm new password"
                                                        className="h-12 pl-11 pr-11 glass-effect border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                        {...field}
                                                        disabled={isChangingPassword}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                                                        onClick={() => setShowConfirmPassword(! showConfirmPassword)}
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
                                    className="w-full h-12 gradient-bg-primary hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:shadow-purple-500/50 font-semibold text-base group/submit"
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

                {/* Danger Zone */}
                <EnhancedCard variant="default" className="border-destructive/50 animate-slide-up overflow-hidden" style={{ animationDelay: '0.2s' }}>
                    <CardHeader className="space-y-3 px-8 pt-8">
                        <CardTitle className="flex items-center gap-3 text-destructive text-xl">
                            <AlertTriangleIcon className="w-6 h-6" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription className="text-base">
                            Irreversible actions.  Please proceed with caution.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 px-8 pb-8 pt-3">
                        {/* Export Data */}
                        <div className="flex items-center justify-between p-5 rounded-xl border border-border/50 hover:border-primary/50 transition-all group/export bg-background/50">
                            <div className="space-y-2 flex-1 pr-4">
                                <h4 className="font-semibold flex items-center gap-2 text-base">
                                    <DownloadIcon className="w-5 h-5" />
                                    Export Your Data
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Download a copy of all your data in JSON format.
                                </p>
                            </div>
                            <Button
                                variant="default"
                                onClick={handleExportData}
                                disabled={isExportingData}
                                className="group-hover/export:scale-105 transition-transform h-10 px-4 shrink-0"
                            >
                                {isExportingData ? (
                                    <LoadingSpinner className="w-4 h-4 mr-2" />
                                ) : (
                                    <DownloadIcon className="w-4 h-4 mr-2" />
                                )}
                                Export
                            </Button>
                        </div>

                        {/* Delete Account */}
                        <div className="flex items-center justify-between p-5 rounded-xl border border-destructive/50 bg-destructive/5 hover:bg-destructive/10 transition-all group/delete">
                            <div className="space-y-2 flex-1 pr-4">
                                <h4 className="font-semibold flex items-center gap-2 text-destructive text-base">
                                    <TrashIcon className="w-5 h-5" />
                                    Delete Account
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Permanently delete your account and all associated data.
                                </p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        className="group-hover/delete:scale-105 transition-transform h-10 px-4 shrink-0"
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="flex items-center gap-2">
                                            <AlertTriangleIcon className="w-5 h-5 text-destructive" />
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="space-y-2">
                                            <p>
                                                This action cannot be undone. This will permanently delete your
                                                account and remove your data from our servers.
                                            </p>
                                            <p className="font-semibold text-destructive">
                                                All your workflows, credentials, and execution history will be lost.
                                            </p>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeleteAccount}
                                            disabled={isDeletingAccount}
                                            className="bg-destructive hover: bg-destructive/90"
                                        >
                                            {isDeletingAccount ? (
                                                <LoadingSpinner className="w-4 h-4 mr-2" />
                                            ) : (
                                                <TrashIcon className="w-4 h-4 mr-2" />
                                            )}
                                            Delete Account
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </EnhancedCard>
            </div>

            {/* Right Column - Account Stats & Info */}
            <div className="space-y-8">
                {/* Account Information */}
                <EnhancedCard variant="default" shimmer className="animate-slide-up overflow-hidden" style={{ animationDelay:  '0.15s' }}>
                    <CardHeader className="space-y-3 px-8 pt-8">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <ShieldCheckIcon className="w-6 h-6" />
                            Account Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-8 pb-8">
                        {/* Account Created */}
                        <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 hover:from-green-500/15 hover:to-emerald-500/15 transition-all group/stat">
                            <div className="p-3 rounded-xl bg-green-500/20 group-hover/stat:scale-110 group-hover/stat:bg-green-500/30 transition-all shrink-0 shadow-sm">
                                <CalendarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1 space-y-1.5 min-w-0">
                                <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">Member Since</p>
                                <p className="text-base font-bold text-foreground truncate">
                                    {formatDate(user?. createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Last Updated */}
                        <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/15 hover:to-cyan-500/15 transition-all group/stat">
                            <div className="p-3 rounded-xl bg-blue-500/20 group-hover/stat: scale-110 group-hover/stat: bg-blue-500/30 transition-all shrink-0 shadow-sm">
                                <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 space-y-1.5 min-w-0">
                                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">Last Updated</p>
                                <p className="text-base font-bold text-foreground truncate">
                                    {formatRelativeTime(user?.updatedAt)}
                                </p>
                            </div>
                        </div>

                        {/* Account ID */}
                        <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 hover: from-purple-500/15 hover:to-pink-500/15 transition-all group/stat">
                            <div className="p-3 rounded-xl bg-purple-500/20 group-hover/stat:scale-110 group-hover/stat:bg-purple-500/30 transition-all shrink-0 shadow-sm">
                                <ShieldCheckIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1 space-y-1.5 min-w-0">
                                <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">Account ID</p>
                                <p className="text-xs font-mono font-bold text-foreground truncate bg-background/50 px-3 py-1.5 rounded-md" title={user?.id}>
                                    {user?.id || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </EnhancedCard>

                {/* Usage Statistics */}
                <EnhancedCard variant="default" shimmer className="animate-slide-up overflow-hidden" style={{ animationDelay:  '0.2s' }}>
                    <CardHeader className="space-y-3 px-8 pt-8">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <ActivityIcon className="w-6 h-6" />
                            Usage Stats
                        </CardTitle>
                        <CardDescription className="text-base">
                            Your activity overview
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5 px-8 pb-8">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Workflows */}
                            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 transition-all cursor-pointer group/metric">
                                <div className="space-y-3">
                                    <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover/metric:scale-110 transition-transform inline-block">
                                        {stats. workflows}
                                    </p>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Workflows</p>
                                </div>
                            </div>

                            {/* Executions */}
                            <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:scale-105 hover:shadow-lg hover: shadow-green-500/10 transition-all cursor-pointer group/metric">
                                <div className="space-y-3">
                                    <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent group-hover/metric:scale-110 transition-transform inline-block">
                                        {stats.executions}
                                    </p>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Executions</p>
                                </div>
                            </div>

                            {/* Credentials */}
                            <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:scale-105 hover: shadow-lg hover:shadow-orange-500/10 transition-all cursor-pointer group/metric">
                                <div className="space-y-3">
                                    <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent group-hover/metric:scale-110 transition-transform inline-block">
                                        {stats.credentials}
                                    </p>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Credentials</p>
                                </div>
                            </div>

                            {/* Success Rate */}
                            <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer group/metric">
                                <div className="space-y-3">
                                    <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent group-hover/metric:scale-110 transition-transform inline-block">
                                        {stats.successRate}%
                                    </p>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Success Rate</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </EnhancedCard>
            </div>
        </div>
    );
};