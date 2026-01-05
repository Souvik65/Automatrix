"use client";

import {
    CreditCardIcon,
    FolderOpenIcon,
    HistoryIcon,
    KeyIcon,
    LogOutIcon,
    StarIcon,
    WorkflowIcon,
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
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
// import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";

const menuItems = [
    {
        title: "Main",
        items: [
            {
                title: "Workflows",
                icon: FolderOpenIcon,
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
    // const {hasActiveSubscription, isLoading } =useHasActiveSubscription();

    return (
        <Sidebar collapsible="icon" className="border-r border-white/10">
            <SidebarHeader className="border-b border-white/10 p-4">
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-3 h-12 px-3 hover:bg-accent/50 rounded-xl transition-all">
                        <Link href="/" prefetch>
                            <Image src="/logos/logo.svg" alt="automatrix" width={32} height={32} />
                            <div className="flex flex-col">
                                <span className="font-bold text-sm gradient-text">Automatrix</span>
                            </div>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            
            <SidebarContent className="p-2">
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-3 py-2">
                            {group.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive =
                                        item.url === "/"
                                            ? pathname === "/"
                                            : pathname. startsWith(item.url);

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                isActive={isActive}
                                                asChild
                                                className={cn(
                                                    "relative overflow-hidden transition-all rounded-xl h-11",
                                                    "hover: bg-accent/50",
                                                    isActive && "bg-accent/70 shadow-md"
                                                )}
                                            >
                                                <a href={item.url} className="group/item flex items-center gap-3">
                                                    {/* Icon with gradient */}
                                                    <div
                                                        className={cn(
                                                            "w-9 h-9 rounded-lg flex items-center justify-center",
                                                            "bg-linear-to-br transition-all duration-300",
                                                            "group-hover/item:scale-110 group-hover/item:shadow-lg",
                                                            isActive && "shadow-lg animate-glow-pulse",
                                                            item.gradient
                                                        )}
                                                    >
                                                        <item.icon className="w-4. 5 h-4.5 text-white" />
                                                    </div>

                                                    <span className="font-medium">{item.title}</span>

                                                    {/* Active indicator */}
                                                    {isActive && (
                                                        <div className="absolute inset-y-0 right-0 w-1 rounded-tr-xl rounded-br-xl bg-white/30" />
                                                    )}

                                                    {/* Hover shimmer */}
                                                    <div className="absolute inset-0 -translate-x-full group-hover/item: translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 p-2">
                <SidebarMenu className="space-y-1">
                    {/* {!hasActiveSubscription && !isLoading && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                            tooltip= "Upgrade to pro"
                                className="gap-x-4 h-10 px-4"
                                onClick={() => authClient.checkout({ slug: "pro" })}
                            >
                                <StarIcon className="h-4 w-4" />
                                <span>Upgrade to Pro</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )} */}
                    {/* <SidebarMenuItem>
                        <SidebarMenuButton
                        tooltip= "Billing Portal"
                            className="gap-x-4 h-10 px-4"
                            onClick={() => authClient.customer.portal()}
                        >
                            <CreditCardIcon className="h-4 w-4" />
                            <span>Billing Portal</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem> */}

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="log out"
                            className="group/item relative overflow-hidden h-11 rounded-xl hover: bg-accent/50 transition-all"
                            onClick={() =>
                                authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            router.push("/login");
                                        },
                                    },
                                })
                            }
                        >
                            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-gray-500 to-gray-700 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                                <LogOutIcon className="w-4. 5 h-4.5 text-white" />
                            </div>
                            <span className="font-medium">Log out</span>
                            <div className="absolute inset-0 -translate-x-full group-hover/item:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};