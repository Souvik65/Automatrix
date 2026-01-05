"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
  className?: string;
  onClick?: () => void;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient = "from-blue-500 to-purple-600",
  className,
  onClick,
}: FeatureCardProps) {
  const [mousePosition, setMousePosition] = React. useState({ x: 0, y: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 cursor-pointer",
        "glass-card hover-lift",
        "border border-white/10 hover:border-white/20 transition-all duration-300",
        className
      )}
    >
      {/* Spotlight effect */}
      <div
        className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          width: "300px",
          height: "300px",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%)`,
        }}
      />

      {/* Icon with gradient background */}
      <div
        className={cn(
          "relative w-14 h-14 rounded-xl bg-linear-to-br mb-4",
          "flex items-center justify-center",
          "group-hover:scale-110 transition-transform duration-300",
          "animate-glow-pulse",
          gradient
        )}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-purple-500/10 to-transparent rounded-bl-full" />
    </div>
  );
}