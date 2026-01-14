import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ModernEmptyStateProps {
  icon?: LucideIcon;
  title:  string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "gradient" | "glass";
  };
  className?: string;
}

export function ModernEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: ModernEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full gap-8 p-12 text-center",
        className
      )}
    >
      {Icon && (
        <div className="relative">
          {/* Animated icon container */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-linear-to-r from-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
            <div className="relative w-24 h-24 rounded-3xl glass-card flex items-center justify-center animate-float">
              <div className="w-16 h-16 rounded-2xl gradient-bg-primary flex items-center justify-center animate-glow-pulse">
                <Icon className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-purple-500/40 animate-pulse" />
          <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-blue-500/40 animate-ping" />
        </div>
      )}

      <div className="space-y-4 max-w-md">
        <h3 className="text-3xl font-bold gradient-text">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>
        )}
      </div>

      {action && (
        <Button
          size="lg"
          variant={action.variant || "gradient"}
          onClick={action.onClick}
          className="gap-2 px-8"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}