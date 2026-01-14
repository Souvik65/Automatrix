"use client";

import {
    CreditCardIcon,
    FolderOpenIcon,
    HistoryIcon,
    KeyIcon,
    LogOutIcon,
    StarIcon,
    WorkflowIcon,
    ZapIcon,
    ArrowRightIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";


const menuItems = [
    {
        title: "Main",
        items: [
            {
                title: "Workflows",
                icon: WorkflowIcon,
                url: "/workflows",
                gradient: "from-blue-500 to-cyan-500",
            },
            {
                title: "Credentials",
                icon: KeyIcon,
                url: "/credentials",
                gradient: "from-purple-500 to-pink-500",
            },
            {
                title: "Executions",
                icon: HistoryIcon,
                url: "/executions",
                gradient: "from-orange-500 to-red-500",
            },
        ],
    },
];

export const AppSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { state } = useSidebar();
    const collapsed = state === 'collapsed';
    // const {hasActiveSubscription, isLoading } =useHasActiveSubscription();

    return (
        <Sidebar collapsible="icon" className=" border-white/10 bg-background/50 backdrop-blur-sm">
            {/* Header with Logo */}
            <SidebarHeader className="border-b border-white/10   list-none">
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-3 h-12 px-3 hover:bg-accent/50 rounded-xl transition-all">
                        <Link href="/" prefetch>
                            <div className={cn(
                                "relative w-8 h-8 rounded-4xl bg-linear-to-br from-blue-500 to-blue-300 flex items-center justify-center shrink-0 shadow-md",
                                collapsed ? "-translate-x-2" : ""  // Shift left when collapsed
                            )}>
                                <Image src="/logos/logo.svg" alt="automatrix" width={32} height={32} className="rounded-lg" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-3xl gradient-text">Automatrix</span>
                            </div>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>

            {/* Navigation Content */}
            <SidebarContent className="gap-0 [&>*: not(:first-child)]:border-t [&>*:not(:first-child)]:border-white/10">
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title} className="py-6">
                        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
                            {group.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-2">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.url;
                                    const Icon = item.icon;

                                    return (
                                        <SidebarMenuItem key={item.url}>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.title}
                                                className={cn(
                                                    "group/item relative overflow-hidden gap-x-3 h-10 px-4 rounded-lg transition-all duration-200",
                                                    isActive
                                                        ? "bg-linear-to-r " + item.gradient + " text-white shadow-lg hover:shadow-xl"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                                )}
                                            >

                                                <Link href={item.url} prefetch className="flex items-center gap-3 w-full">
                                                     {/* Hover shimmer */}
                                                    <div className="absolute inset-0 -translate-x-full group-hover/item:translate-x-full transition-transform duration-600 bg-linear-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                                                
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-md flex items-center justify-center transition-transform",
                                                        isActive ? "scale-110" : "group-hover:scale-110"
                                                    )}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-medium text-sm">{item.title}</span>

                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="border-t border-white/10 p-4 gap-3">
                {/* Upgrade Banner */}
                {/* <div className="relative group px-2 py-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity" />
                    <div className="relative flex items-start gap-2">
                        <StarIcon className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">Upgrade to Pro</p>
                            <p className="text-xs text-muted-foreground leading-snug mt-0.5">Unlock advanced features</p>
                        </div>
                    </div>
                </div> */}

                {/* Logout Button */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={async () => {
                                await authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            router.push("/login");
                                        },
                                    },
                                });
                            }}
                            className="gap-x-3 h-10 px-4 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
                        >
                            <LogOutIcon className="w-5 h-5" />
                            
                            <span className="font-medium text-sm">Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};