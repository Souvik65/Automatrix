import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchIcon } from "lucide-react";
export const AppHeader = () => {
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
            <SidebarTrigger />
        </header>
    );
};

// Modern header with sticky blur effect
<header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-16 items-center gap-4">
    {/* Logo with gradient */}
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <span className="text-white font-bold text-sm">A</span>
      </div>
      <span className="font-semibold text-lg gradient-text">Automatrix</span>
    </div>
    
    {/* Search bar with icon */}
    <div className="flex-1 max-w-md">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border/50 bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder="Search workflows..."
        />
      </div>
    </div>
  </div>
</header>