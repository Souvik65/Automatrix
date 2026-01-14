"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchIcon, BellIcon } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const AppHeader = () => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const { data: session } = authClient.useSession(); // Get user session

    const user = session?.user;
    const initials = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";
    const displayName = user?.name || user?.email || "User";

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
                {/* <div className="flex items-center gap-2">
                    Notifications Dropdown
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative hover:bg-accent/50 rounded-lg transition-all hover:scale-105"
                            >
                                <BellIcon className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse ring-2 ring-background" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium">New workflow executed</span>
                                    <span className="text-sm text-muted-foreground">Your "My Workflow 1" ran successfully.</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium">Credential updated</span>
                                    <span className="text-sm text-muted-foreground">Your GitHub token has been refreshed.</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium">System maintenance</span>
                                    <span className="text-sm text-muted-foreground">Scheduled maintenance completed.</span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    Separator
                    <div className="w-px h-6 bg-border/40 mx-2" />

                    User Profile Dropdown
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="gap-2 px-3 hover:bg-accent/50 rounded-lg transition-all hover:scale-105"
                            >
                                <Avatar className="w-8 h-8">
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
                            <DropdownMenuItem disabled>
                                <span className="text-sm">{user?.email}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut}>
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div> */}
            </div>
        </header>
    );
};

export default AppHeader;