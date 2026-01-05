import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const Layout = ({ children }: {children: React.ReactNode; }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-linear-to-br from-accent/10 via-background to-accent/5">
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Layout;