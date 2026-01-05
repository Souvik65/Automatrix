"use client";

import * as React from "react";
import { SearchIcon, BellIcon, SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EnhancedHeaderProps {
  className?: string;
  showSearch?: boolean;
  children?: React.ReactNode;
}

export function EnhancedHeader({ 
  className, 
  showSearch = true,
  children 
}: EnhancedHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window. addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "backdrop-blur-md bg-background/80 supports-backdrop-filter:bg-background/60",
        isScrolled ?  "border-b border-border/40 shadow-sm" : "border-b border-transparent",
        className
      )}
    >
      <div className="container flex h-16 items-center gap-4 px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-lg gradient-text hidden sm:inline">
            Automatrix
          </span>
        </div>
        
        {/* Search Bar */}
        {showSearch && (
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                className="w-full pl-10 pr-4 h-9 rounded-lg border-border/50 bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Search workflows..."
              />
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-2">
          {children}
          
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1. 5 right-1.5 w-2 h-2 bg-error rounded-full animate-pulse" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <SettingsIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}