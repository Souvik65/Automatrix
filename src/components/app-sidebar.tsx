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
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
// import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";

const menuItems = [
    {
        title: "Main",
        items: [
            {
                title: "Workflows",
                icon: FolderOpenIcon,
                url: "/workflows",
            },
            {
                title: "Credentials",
                icon: KeyIcon,
                url: "/credentials",
            },
            {
                title: "Executions",
                icon: HistoryIcon,
                url: "/executions",
            }
        ],
    }
];

export const AppSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    // const {hasActiveSubscription, isLoading } =useHasActiveSubscription();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
                        <Link href="/" prefetch>
                            <Image src="/logos/logo.svg" alt="automatrix" width={32} height={32} />
                            <span className="font-semibold text-sm">automatrix</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            tooltip = {item.title}
                                            isActive={
                                                item.url === "/"
                                                    ? pathname === "/"
                                                    :pathname.startsWith(item.url)
                                            }
                                            asChild
                                            className="group/item relative overflow-hidden transition-all hover:bg-accent/50"
                                        >
                                            <a href={item.url} className="group/item" >
                                                <div className="w-8 h-8 rounded-md gradient-bg-primary flex items-center justify-center mr-2 group-hover/item:scale-110 transition-transform">
                                                    <item.icon className="size-4" />
                                                </div>
                                                                                                
                                                {/* Active indicator */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 data-[active=true]:scale-y-100 transition-transform rounded-r-full" 
                                                     data-active={
                                                        item.url === "/"
                                                            ?  pathname === "/"
                                                            : pathname.startsWith(item.url)
                                                     }
                                                /> 
                                                
                                               {/* Hover shimmer effect */}
                                                <div className="absolute inset-0 -translate-x-full group-hover/item:translate-x-full transition-transform duration-600 bg-gradient-to-r from-transparent via-white to-transparent" />
                                                
                                                {/* <item.icon className="size-4" /> */}
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
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
                            className="gap-x-4 h-10 px-4 group/item relative overflow-hidden"
                            onClick={() => authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        router.push("/login");
                                    },
                                },
                            })}
                        >
                            <LogOutIcon className="h-4 w-4" />
                            <span>Log out</span>
                            <div className="absolute inset-0 -translate-x-full group-hover/item:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};