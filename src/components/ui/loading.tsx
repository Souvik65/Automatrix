import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function Loading({ size = "md", text, className }: LoadingProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 animate-fade-in",
        className
      )}
    >
      <div className={cn("relative", sizes[size])}>
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />

        {/* Animated gradient ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-blue-500 animate-spin" />

        {/* Inner pulsing circle */}
        <div className="absolute inset-3 rounded-full gradient-bg-primary animate-pulse opacity-50" />

        {/* Center glow */}
        <div className="absolute inset-6 rounded-full bg-white dark:bg-purple-500 animate-ping opacity-75" />
      </div>

      {text && (
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium animate-pulse">{text}</p>
          <div className="flex gap-1 justify-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
            <div
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-5 h-5", className)}>
      <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin" />
    </div>
  );
}