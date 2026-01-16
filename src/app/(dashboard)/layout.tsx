import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AnimatedBackground } from "@/components/animated-background";
import { NotificationsProvider } from "@/contexts/notifications-context";

const Layout = ({ children }: { children:  React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AnimatedBackground />
      <AppSidebar />
      <SidebarInset className="relative mesh-gradient bg-grid">
        <NotificationsProvider>
          {children}
        </NotificationsProvider>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;