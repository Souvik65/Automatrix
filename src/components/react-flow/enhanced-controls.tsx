"use client";

import { Controls, ControlButton } from '@xyflow/react';
import { ZoomInIcon, ZoomOutIcon, MaximizeIcon, LocateIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedControlsProps {
  className?: string;
}

export function EnhancedControls({ className }: EnhancedControlsProps) {
  return (
    <Controls
      className={cn("glass-effect rounded-lg shadow-lg", className)}
      showZoom={true}
      showFitView={true}
      showInteractive={true}
    >
      <ControlButton 
        className="hover:bg-accent transition-colors"
        onClick={() => {/* zoom in */}}
      >
        <ZoomInIcon className="w-4 h-4" />
      </ControlButton>
      <ControlButton 
        className="hover:bg-accent transition-colors"
        onClick={() => {/* zoom out */}}
      >
        <ZoomOutIcon className="w-4 h-4" />
      </ControlButton>
      <ControlButton 
        className="hover:bg-accent transition-colors"
        onClick={() => {/* fit view */}}
      >
        <MaximizeIcon className="w-4 h-4" />
      </ControlButton>
      <ControlButton 
        className="hover:bg-accent transition-colors"
        onClick={() => {/* center */}}
      >
        <LocateIcon className="w-4 h-4" />
      </ControlButton>
    </Controls>
  );
}