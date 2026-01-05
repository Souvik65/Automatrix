import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: LucideIcon;
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
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center h-full gap-6 p-8 text-center",
      className
    )}>
      {Icon && (
        <div className="w-32 h-32 rounded-full bg-muted/30 flex items-center justify-center animate-float">
          <Icon className="w-16 h-16 text-muted-foreground/50" />
        </div>
      )}
      
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-semibold">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      
      {action && (
        <Button 
          size="lg" 
          onClick={action. onClick}
          className="gap-2 gradient-bg-primary hover:opacity-90 transition-opacity"
        >
          {action.icon && <action.icon className="w-5 h-5" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}