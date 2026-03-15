"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Particle {
    x: number;
    y: number;
    size: number;
    baseSize: number;
    speedX: number;
    speedY: number;
    opacity: number;
    baseOpacity: number;
    pulseSpeed: number;
    pulsePhase: number;
    hue: number; // for rainbow in dark mode
}

// Rotating list of vivid rainbow hues
const RAINBOW_HUES = [0, 30, 60, 120, 180, 210, 260, 300, 330];

export function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePosRef = useRef<{ x: number; y: number } | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateCanvasSize();

        const initParticles = () => {
            particlesRef.current = [];
            for (let i = 0; i < 180; i++) {
                const baseSize = Math.random() * 1 + 1;
                const baseOpacity = Math.random() * 0.75 + 0.95;
                particlesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: baseSize,
                    baseSize,
                    speedX: (Math.random() - 0.5) * 0.6,
                    speedY: (Math.random() - 0.5) * 0.6,
                    opacity: baseOpacity,
                    baseOpacity,
                    pulseSpeed: Math.random() * 0.02 + 0.01,
                    pulsePhase: Math.random() * Math.PI * 2,
                    hue: RAINBOW_HUES[Math.floor(Math.random() * RAINBOW_HUES.length)],
                });
            }
        };
        initParticles();

        let hueOffset = 0;

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Slowly rotate all hues in dark mode for the spinning rainbow effect
            hueOffset = isDark ? (hueOffset + 0.4) % 360 : 0;

            const particles = particlesRef.current;
            const mousePos = mousePosRef.current;

            particles.forEach((particle, index) => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                particle.pulsePhase += particle.pulseSpeed;
                const pulse = Math.sin(particle.pulsePhase) * 0.5 + 0.5;
                particle.size = particle.baseSize * (0.8 + pulse * 0.4);
                particle.opacity = particle.baseOpacity * (0.8 + pulse * 0.4);

                // Color: rainbow in dark mode, soft purple in light mode
                const color = isDark
                    ? `hsla(${(particle.hue + hueOffset) % 360}, 100%, 99%, ${particle.opacity})`
                    : `rgba(133, 120, 227, ${particle.opacity})`;

                const lineColor = isDark
                    ? `hsla(${(particle.hue + hueOffset) % 360}, 100%, 70%, `
                    : `rgba(133, 120, 227, `;

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();

                // Connections between nearby particles
                particles.forEach((other, otherIndex) => {
                    if (index >= otherIndex) return;
                    const dx = particle.x - other.x;
                    const dy = particle.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 80) {
                        const lineOpacity = 0.4 * (1 - dist / 80);
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `${lineColor}${lineOpacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });

                // Mouse grab connections
                if (mousePos) {
                    const dx = particle.x - mousePos.x;
                    const dy = particle.y - mousePos.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const lineOpacity = 0.584 * (1 - dist / 150);
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(mousePos.x, mousePos.y);
                        ctx.strokeStyle = `${lineColor}${lineOpacity})`;
                        ctx.lineWidth = 1.5;
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, particle.size + 1, 0, Math.PI * 2);
                        ctx.fillStyle = isDark
                            ? `hsla(${(particle.hue + hueOffset) % 360}, 100%, 70%, ${particle.opacity * 1.5})`
                            : `rgba(133, 120, 227, ${particle.opacity * 1.5})`;
                        ctx.fill();
                    }
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();

        const handleMouseMove = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseLeave = () => { mousePosRef.current = null; };
        const handleClick = (e: MouseEvent) => {
            const clickX = e.clientX;
            const clickY = e.clientY;
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI * 2 * i) / 4;
                const baseSize = Math.random() * 1 + 1;
                const baseOpacity = Math.random() * 0.2 + 0.25;
                particlesRef.current.push({
                    x: clickX, y: clickY,
                    size: baseSize, baseSize,
                    speedX: Math.cos(angle) * 2, speedY: Math.sin(angle) * 2,
                    opacity: baseOpacity, baseOpacity,
                    pulseSpeed: Math.random() * 0.02 + 0.01,
                    pulsePhase: Math.random() * Math.PI * 2,
                    hue: RAINBOW_HUES[Math.floor(Math.random() * RAINBOW_HUES.length)],
                });
            }
            if (particlesRef.current.length > 300) {
                particlesRef.current = particlesRef.current.slice(-250);
            }
        };
        const handleResize = () => { updateCanvasSize(); initParticles(); };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("click", handleClick);
        window.addEventListener("resize", handleResize);

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("click", handleClick);
            window.removeEventListener("resize", handleResize);
        };
    }, [isDark]); // Re-run when theme changes

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-50"
            style={{ zIndex: 0 }}
        />
    );
}
