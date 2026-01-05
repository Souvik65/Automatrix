"use client";

import * as React from "react";
import { SearchIcon, BellIcon, SettingsIcon, SparklesIcon } from "lucide-react";
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
  children,
}: EnhancedHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "glass-card",
        isScrolled
          ? "shadow-lg shadow-purple-500/10"
          :  "border-b border-transparent",
        className
      )}
    >
      <div className="container flex h-16 items-center gap-4 px-4">
        {/* Logo Section with animation */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
            <span className="text-white font-bold text-lg">A</span>
            <SparklesIcon className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-lg gradient-text hidden sm:inline block">
              Automatrix
            </span>
            <p className="text-xs text-muted-foreground hidden md:block">
              Workflow Automation
            </p>
          </div>
        </div>

        {/* Search Bar with enhanced focus state */}
        {showSearch && (
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                className={cn(
                  "w-full pl-10 pr-4 h-10 rounded-xl",
                  "glass-effect border-white/10",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-purple-500/20",
                  "transition-all duration-300",
                  searchFocused && "scale-105"
                )}
                placeholder="Search workflows, nodes, credentials..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded bg-muted text-muted-foreground hidden lg:inline-block">
                ⌘K
              </kbd>
            </div>
          </div>
        )}

        {/* Right Section with enhanced buttons */}
        <div className="ml-auto flex items-center gap-2">
          {children}

          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-accent/50 rounded-xl transition-all hover-scale"
          >
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1. 5 right-1.5 w-2 h-2 bg-error rounded-full animate-pulse ring-2 ring-background" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent/50 rounded-xl transition-all hover-scale"
          >
            <SettingsIcon className="w-5 h-5" />
          </Button>

          {/* Profile Avatar */}
          <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover-scale shadow-md">
            U
          </div>
        </div>
      </div>
    </header>
  );
}