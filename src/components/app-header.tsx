"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchIcon, BellIcon, UserIcon, LogOutIcon, TrashIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotifications, Notification  } from "@/contexts/notifications-context";

export const AppHeader = () => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const { data: session } = authClient.useSession(); // Get user session

    const user = session?.user;
    const initials = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";
    const displayName = user?.name || user?.email || "User";
    const { notifications, clearNotifications, removeNotification } = useNotifications();  // this is destructuring

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchValue.trim()) {
            router.push(`/workflows?search=${encodeURIComponent(searchValue.trim())}`);
        }
    };

    const handleSignOut = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                },
            },
        });
    };

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border/40 supports-backdrop-filter:bg-background/60 shadow-sm">
            <div className="flex h-16 items-center gap-4 px-6">
                {/* Left: Sidebar Trigger */}
                <SidebarTrigger className="hover:bg-accent/50 rounded-lg transition-colors" />

                {/* Right: Actions */}
                <div className="flex items-center gap-2 ml-auto">
                    {/* Notifications Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative hover:bg-accent/50 rounded-lg transition-all hover:scale-105"
                            >
                                <BellIcon className="w-5 h-5" />
                                {notifications.length > 0 && (  // Only show the dot if there are notifications
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse ring-2 ring-background" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <div className="flex items-center justify-between p-2">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                {notifications.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearNotifications}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <TrashIcon className="w-4 h-4 mr-1" />
                                        Clear All
                                    </Button>
                                )}
                            </div>
                            <DropdownMenuSeparator />
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground">
                                    No notifications yet.
                                </div>
                            ) : (
                                notifications.map((notif: Notification) => (  // Add type annotation
                                    <DropdownMenuItem key={notif.id} className="flex items-start gap-2 p-3 relative group">
                                        <div
                                            className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                                                notif.type === "success"
                                                    ? "bg-green-500"
                                                : notif.type === "error"
                                                    ? "bg-red-500"
                                                    : "bg-blue-500"
                                            }`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <span className="text-sm block">{notif.message}</span>
                                            <span className="text-xs text-muted-foreground block mt-1 sm:hidden">
                                                {new Date(notif.timestamp).toLocaleString()}
                                            </span>
                                            <span className="text-xs text-muted-foreground hidden sm:block">
                                                {new Date(notif.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeNotification(notif.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 transition-opacity p-1 h-6 w-6 shrink-0"
                                            aria-label="Dismiss notification"
                                        >
                                            <XIcon className="w-3 h-3" />
                                        </Button>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="gap-2 px-3 hover:bg-accent/50 rounded-lg transition-all hover:scale-105"
                            >
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={user?.image || undefined} alt={displayName} />
                                    <AvatarFallback className="bg-linear-to-br from-purple-500 to-blue-500 text-white text-sm font-bold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium hidden sm:inline">{displayName}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push("/account")}>
                                <UserIcon className="w-4 h-4 mr-2" />
                                Account Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <span className="text-sm">{user?.email}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut}>
                                <LogOutIcon className="w-4 h-4 mr-2" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;