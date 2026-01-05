import { cn } from "@/lib/utils";

export type Status = 'running' | 'success' | 'error' | 'idle' | 'warning' | 'pending';

interface StatusBadgeProps {
  status: Status;
  className?: string;
  showDot?: boolean;
  children?: React.ReactNode;
}

export function StatusBadge({ 
  status, 
  className, 
  showDot = true,
  children 
}:  StatusBadgeProps) {
  const styles = {
    running: 'bg-info/10 text-info border-info/20',
    success: 'bg-success/10 text-success border-success/20',
    error: 'bg-error/10 text-error border-error/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    idle: 'bg-muted text-muted-foreground border-border',
    pending: 'bg-muted text-muted-foreground border-border',
  };
  
  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        styles[status],
        className
      )}
    >
      {showDot && (
        <span 
          className={cn(
            "w-1.5 h-1.5 rounded-full bg-current",
            status === 'running' && "animate-pulse"
          )} 
        />
      )}
      {children || status. charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}