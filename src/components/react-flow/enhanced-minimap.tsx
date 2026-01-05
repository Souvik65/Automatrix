"use client";

import { MiniMap } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface EnhancedMinimapProps {
  className?:  string;
}

export function EnhancedMinimap({ className }: EnhancedMinimapProps) {
  return (
    <MiniMap
      className={cn(
        "glass-effect rounded-lg shadow-lg border border-border/50",
        className
      )}
      nodeColor={(node) => {
        switch (node.type) {
          case 'initial':
            return 'var(--primary)';
          default:
            return 'var(--muted)';
        }
      }}
      maskColor="rgba(0, 0, 0, 0.1)"
      style={{
        backgroundColor: 'var(--glass-bg)',
      }}
    />
  );
}