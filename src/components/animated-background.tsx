"use client";

import { useEffect, useRef, useState } from "react";

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
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null); // ✅ Changed to ref to avoid re-render issues
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window. innerHeight;
    };
    updateCanvasSize();

    // Initialize particles (180 particles as per config)
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = 180;

      for (let i = 0; i < particleCount; i++) {
        const baseSize = Math.random() * 1 + 1;
        const baseOpacity = Math.random() * 0.2 + 0.75;

        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: baseSize,
          baseSize: baseSize,
          speedX: (Math.random() - 0.5) * 0.6,
          speedY: (Math. random() - 0.5) * 0.6,
          opacity: baseOpacity,
          baseOpacity: baseOpacity,
          pulseSpeed: Math. random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    initParticles();

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mousePos = mousePosRef. current; // ✅ Use ref instead of state

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas. height;
        if (particle. y > canvas.height) particle.y = 0;

        // Pulse animation for size and opacity
        particle.pulsePhase += particle.pulseSpeed;
        const pulse = Math.sin(particle.pulsePhase) * 0.5 + 0.5;
        particle.size = particle.baseSize * (0.8 + pulse * 0.4);
        particle.opacity = particle.baseOpacity * (0.8 + pulse * 0.4);

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(133, 120, 227, ${particle. opacity})`;
        ctx.fill();

        // Draw connections between nearby particles
        particles.forEach((otherParticle, otherIndex) => {
          if (index >= otherIndex) return;

          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const lineOpacity = 0.4 * (1 - distance / 80);
            ctx.strokeStyle = `rgba(133, 120, 227, ${lineOpacity})`;
            ctx.lineWidth = 1;
            ctx. stroke();
          }
        });

        // Draw connection to mouse (grab effect)
        if (mousePos) {
          const dx = particle.x - mousePos.x;
          const dy = particle. y - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            const lineOpacity = 0.584 * (1 - distance / 150);
            ctx.strokeStyle = `rgba(133, 120, 227, ${lineOpacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Particle glows when connected to mouse
            ctx. beginPath();
            ctx.arc(particle.x, particle.y, particle.size + 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(133, 120, 227, ${particle.opacity * 1.5})`;
            ctx.fill();
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse move handler - ✅ Attach to window instead of canvas
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      mousePosRef.current = null;
    };

    // Click handler - spawn new particles
    const handleClick = (e:  MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      // Spawn 4 new particles at click position
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI * 2 * i) / 4;
        const baseSize = Math.random() * 1 + 1;
        const baseOpacity = Math. random() * 0.2 + 0.25;

        particlesRef.current.push({
          x: clickX,
          y: clickY,
          size: baseSize,
          baseSize: baseSize,
          speedX: Math.cos(angle) * 2,
          speedY: Math.sin(angle) * 2,
          opacity:  baseOpacity,
          baseOpacity: baseOpacity,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      // Limit total particles
      if (particlesRef.current.length > 300) {
        particlesRef.current = particlesRef.current.slice(-250);
      }
    };

    // Resize handler
    const handleResize = () => {
      updateCanvasSize();
      initParticles();
    };

    // ✅ Add event listeners to WINDOW, not canvas
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []); // ✅ Empty dependency array - no need to depend on mousePos

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20"
      style={{ zIndex: 0 }}
    />
  );
}
