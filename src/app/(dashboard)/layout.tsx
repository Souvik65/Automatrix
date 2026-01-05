import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AnimatedBackground } from "@/components/animated-background";

const Layout = ({ children }: { children:  React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AnimatedBackground />
      <AppSidebar />
      <SidebarInset className="relative mesh-gradient bg-grid">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;