"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y:  number;
  size: number;
  baseSize: number;
  speedX: number;
  speedY: number;
  opacity: number;
  baseOpacity: number;
  pulseSpeed: number;
  pulsePhase: number;
  depth: number; // ✨ NEW: For parallax effect
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window. innerHeight;
    };
    updateCanvasSize();

    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = 180;

      for (let i = 0; i < particleCount; i++) {
        const depth = Math.random() * 0.5 + 0.5; // ✨ 0.5 to 1.0 for depth
        const baseSize = (Math.random() * 1 + 1) * depth; // ✨ Size based on depth
        const baseOpacity = (Math.random() * 0.2 + 0.5) * depth; // ✨ Opacity based on depth

        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: baseSize,
          baseSize: baseSize,
          speedX: (Math.random() - 0.5) * 0.6 * depth, // ✨ Speed based on depth
          speedY:  (Math.random() - 0.5) * 0.6 * depth,
          opacity: baseOpacity,
          baseOpacity: baseOpacity,
          pulseSpeed:  Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
          depth: depth,
        });
      }
    };

    initParticles();

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mousePos = mousePosRef.current;

      particles.forEach((particle, index) => {
        // ✨ Mouse Attraction (gentle)
        if (mousePos) {
          const dx = mousePos.x - particle.x;
          const dy = mousePos. y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const attractForce = ((200 - distance) / 200) * 0.0003 * particle.depth;
            particle.speedX += dx * attractForce;
            particle.speedY += dy * attractForce;
          }
        }

        // Update position with depth-based speed
        particle.x += particle. speedX;
        particle.y += particle. speedY;

        // ✨ Add friction to prevent particles from going too fast
        particle.speedX *= 0.99;
        particle.speedY *= 0.99;

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas. height) particle.y = 0;

        // Pulse animation
        particle.pulsePhase += particle.pulseSpeed;
        const pulse = Math.sin(particle.pulsePhase) * 0.5 + 0.5;
        particle.size = particle. baseSize * (0.8 + pulse * 0.4);
        particle.opacity = particle.baseOpacity * (0.8 + pulse * 0.4);

        // ✨ Glow Effect
        ctx.shadowBlur = 15 * particle.depth;
        ctx.shadowColor = `rgba(133, 120, 227, ${particle.opacity * 0.8})`;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle. x, particle.y, particle. size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(133, 120, 227, ${particle.opacity})`;
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;

        // Draw connections between nearby particles
        particles.forEach((otherParticle, otherIndex) => {
          if (index >= otherIndex) return;

          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // ✨ Connection distance based on depth similarity
          const depthDiff = Math.abs(particle.depth - otherParticle.depth);
          const maxDistance = 80 * (1 - depthDiff * 0.5);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const lineOpacity = 0.4 * (1 - distance / maxDistance) * particle.depth;
            ctx.strokeStyle = `rgba(133, 120, 227, ${lineOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Mouse grab effect
        if (mousePos) {
          const dx = particle.x - mousePos.x;
          const dy = particle.y - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle. y);
            ctx.lineTo(mousePos.x, mousePos.y);
            const lineOpacity = 0.584 * (1 - distance / 150) * particle.depth;
            ctx.strokeStyle = `rgba(133, 120, 227, ${lineOpacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Enhanced glow when connected
            ctx.shadowBlur = 20 * particle.depth;
            ctx.shadowColor = `rgba(133, 120, 227, ${particle. opacity})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size + 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(133, 120, 227, ${particle. opacity * 1.5})`;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current = null;
    };

    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI * 2 * i) / 4;
        const depth = Math.random() * 0.5 + 0.5;
        const baseSize = (Math.random() * 1 + 1) * depth;
        const baseOpacity = (Math.random() * 0.2 + 0.25) * depth;

        particlesRef.current.push({
          x: clickX,
          y: clickY,
          size:  baseSize,
          baseSize:  baseSize,
          speedX:  Math.cos(angle) * 2 * depth,
          speedY: Math.sin(angle) * 2 * depth,
          opacity:  baseOpacity,
          baseOpacity: baseOpacity,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
          depth: depth,
        });
      }

      if (particlesRef.current.length > 300) {
        particlesRef. current = particlesRef.current.slice(-250);
      }
    };

    const handleResize = () => {
      updateCanvasSize();
      initParticles();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window. removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20"
      style={{ zIndex: 0 }}
    />
  );
}
