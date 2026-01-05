import { AppHeader } from "@/components/app-header";

const Layout = ({ children }: {children:  React.ReactNode; }) => {
    return (
        <>
            <AppHeader />
            <main className="flex-1 animate-slide-in-right">{children}</main>
        </>
    );
};

export default Layout;