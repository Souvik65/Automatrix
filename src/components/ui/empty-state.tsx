import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  icon?:  LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export function EmptyState({
  icon:  Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full gap-8 p-8 text-center animate-fade-in",
        className
      )}
    >
      {Icon && (
        <div className="relative">
          {/* Floating icon container */}
          <div className="w-32 h-32 rounded-3xl glass-card flex items-center justify-center animate-float">
            <div className="w-20 h-20 rounded-2xl gradient-bg-primary flex items-center justify-center animate-gradient-rotate">
              <Icon className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-500/20 animate-ping" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-blue-500/20 animate-pulse" />
        </div>
      )}

      <div className="space-y-3 max-w-md">
        <h3 className="text-2xl font-bold">{title}</h3>
        {description && (
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>

      {action && (
        <Button
          size="lg"
          onClick={action.onClick}
          className="gap-2 gradient-bg-primary hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:shadow-purple-500/50 hover-scale px-8"
        >
          {action.icon && <action.icon className="w-5 h-5" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}