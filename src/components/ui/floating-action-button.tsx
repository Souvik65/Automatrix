import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface FloatingActionButtonProps {
  icon:  LucideIcon;
  onClick: () => void;
  label?:  string;
  className?: string;
  tooltip?: string;
}

export const FloatingActionButton = React.forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(({ icon:  Icon, onClick, label, className, tooltip }, ref) => {
  return (
    <Button
      ref={ref}
      onClick={onClick}
      title={tooltip}
      variant="gradient"
      size="lg"
      className={cn(
        "fixed bottom-8 right-8 rounded-full h-14 w-14 p-0 shadow-xl hover:shadow-2xl hover: shadow-purple-500/50 hover:-translate-y-2 transition-all duration-300 animate-float",
        className
      )}
    >
      <Icon className="w-6 h-6" />
    </Button>
  );
});

FloatingActionButton.displayName = "FloatingActionButton";