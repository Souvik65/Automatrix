"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// ─── Particle System Types ────────────────────────────────────────────────────

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
    colorIdx: number;
    baseX: number;
    baseY: number;
    phaseOffset: number; // oscillation offset per-particle
}

const PARTICLE_COUNT = 90;
const CONNECTION_DISTANCE = 140;
const NODE_COLORS = [
    "#a855f7", // purple-500
    "#8b5cf6", // violet-500
    "#6366f1", // indigo-500
    "#3b82f6", // blue-500
    "#c084fc", // purple-400
    "#818cf8", // indigo-400
];

function buildParticles(w: number, h: number): Particle[] {
    return Array.from({ length: PARTICLE_COUNT }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
            x,
            y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 1.8 + 0.7,
            opacity: Math.random() * 0.55 + 0.3,
            colorIdx: Math.floor(Math.random() * NODE_COLORS.length),
            baseX: x,
            baseY: y,
            phaseOffset: Math.random() * Math.PI * 2,
        };
    });
}

// ─── Canvas Particle Component ────────────────────────────────────────────────

function ParticleCanvas({
    progressRef,
}: {
    progressRef: React.RefObject<number>;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d")!;
        let rafId = 0;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener("resize", resize);
        particles = buildParticles(canvas.width, canvas.height);

        const startTime = Date.now();

        const draw = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = progressRef.current;
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;

            ctx.clearRect(0, 0, w, h);

            // ── Convergence factor: kicks in at progress 60, completes at 98 ──
            const rawConv = progress > 60 ? (progress - 60) / 38 : 0;
            const conv = Math.min(rawConv, 1);
            // Smoothstep easing
            const convEased = conv * conv * (3 - 2 * conv);

            // ── Emergence: particles fade in during first 25% of progress ──
            const emerge = Math.min(progress / 25, 1);

            particles.forEach((p) => {
                // Organic float oscillation
                const floatX = Math.sin(elapsed * 0.28 + p.phaseOffset) * 18;
                const floatY = Math.cos(elapsed * 0.35 + p.phaseOffset * 1.4) * 14;

                if (convEased > 0) {
                    // Converge toward screen center
                    const tx = cx + (p.baseX - cx) * (1 - convEased);
                    const ty = cy + (p.baseY - cy) * (1 - convEased);
                    p.x = tx + floatX * (1 - convEased * 0.85);
                    p.y = ty + floatY * (1 - convEased * 0.85);
                } else {
                    // Gentle drift
                    p.baseX += p.vx * 0.25;
                    p.baseY += p.vy * 0.25;
                    // Wrap seamlessly
                    if (p.baseX < -60) p.baseX = w + 60;
                    if (p.baseX > w + 60) p.baseX = -60;
                    if (p.baseY < -60) p.baseY = h + 60;
                    if (p.baseY > h + 60) p.baseY = -60;
                    p.x = p.baseX + floatX;
                    p.y = p.baseY + floatY;
                }

                const alpha = emerge * p.opacity * (1 - convEased * 0.65);
                if (alpha <= 0.01) return;

                const color = NODE_COLORS[p.colorIdx];
                const pulse = 1 + Math.sin(elapsed * 1.6 + p.phaseOffset) * 0.3;
                const glowR = p.radius * 4 * pulse;

                // Outer glow
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
                grad.addColorStop(0, color + "55");
                grad.addColorStop(1, color + "00");
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();

                // Core dot
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            });

            // ── Connections: fade in at progress 28, fade out during convergence ──
            if (progress > 28) {
                const lineAppear = Math.min((progress - 28) / 22, 1);
                const lineAlpha = lineAppear * (1 - convEased * 0.9) * emerge;

                if (lineAlpha > 0.01) {
                    for (let i = 0; i < particles.length; i++) {
                        for (let j = i + 1; j < particles.length; j++) {
                            const a = particles[i];
                            const b = particles[j];
                            const dx = a.x - b.x;
                            const dy = a.y - b.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < CONNECTION_DISTANCE) {
                                const strength = (1 - dist / CONNECTION_DISTANCE) * 0.4 * lineAlpha;
                                ctx.globalAlpha = 1;
                                ctx.beginPath();
                                ctx.moveTo(a.x, a.y);
                                ctx.lineTo(b.x, b.y);
                                ctx.strokeStyle = `rgba(139, 92, 246, ${strength})`;
                                ctx.lineWidth = 0.6;
                                ctx.stroke();
                            }
                        }
                    }
                }
            }

            ctx.globalAlpha = 1;
            rafId = requestAnimationFrame(draw);
        };

        rafId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", resize);
        };
    }, [progressRef]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ willChange: "transform" }}
        />
    );
}

// ─── Spinning conic border ring ───────────────────────────────────────────────

function SpinRing() {
    return (
        <motion.div
            className="absolute -inset-3.5 rounded-[22px] pointer-events-none"
            style={{
                background:
                    "conic-gradient(from 0deg, transparent 220deg, rgba(168,85,247,0.55) 280deg, rgba(99,102,241,0.7) 320deg, transparent 360deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
    );
}

// ─── Main SplashScreen ────────────────────────────────────────────────────────

export const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
    const [phase, setPhase] = useState<"loading" | "complete" | "exit">("loading");
    const [progress, setProgress] = useState(0);
    const [dots, setDots] = useState(0);

    // Stable ref so the canvas RAF loop always reads the latest progress
    const progressRef = useRef<number>(0);

    // Keep ref in sync with state
    useEffect(() => {
        progressRef.current = progress;
    }, [progress]);

    // Stable ref for onFinish — prevents parent re-renders from resetting timers
    const onFinishRef = useRef(onFinish);
    onFinishRef.current = onFinish;

    // ── Lifecycle — runs exactly once on mount ─────────────────────────────────
    useEffect(() => {
        // Accelerating-then-decelerating progress curve (~3.3 s total)
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                const inc =
                    prev < 15 ? 1.3
                    : prev < 55 ? 3.2
                    : prev < 82 ? 2.0
                    : prev < 94 ? 0.9
                    : 0.35;
                return Math.min(prev + inc, 100);
            });
        }, 50);

        // Dots
        const dotsInterval = setInterval(() => {
            setDots((d) => (d + 1) % 4);
        }, 400);

        // Phase transitions
        const completeTimer = setTimeout(() => setPhase("complete"), 3400);
        const exitTimer = setTimeout(() => setPhase("exit"), 4600);
        const finishTimer = setTimeout(() => onFinishRef.current(), 5600);

        return () => {
            clearInterval(progressInterval);
            clearInterval(dotsInterval);
            clearTimeout(completeTimer);
            clearTimeout(exitTimer);
            clearTimeout(finishTimer);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden"
            animate={phase === "exit" ? { opacity: 0, scale: 1.07 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            style={{
                background:
                    "radial-gradient(ellipse 80% 60% at 30% 20%, #1a0630 0%, #0d0420 35%, #030712 65%, #020611 100%)",
                pointerEvents: phase === "exit" ? "none" : "auto",
            }}
        >
            {/* ── Particle canvas ───────────────────────────────────────────── */}
            <ParticleCanvas progressRef={progressRef} />

            {/* ── Ambient orbs ─────────────────────────────────────────────── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-[20%] left-[28%] w-140 h-140 rounded-full blur-[130px]"
                    style={{ background: "rgba(147,51,234,0.10)" }}
                />
                <div
                    className="absolute bottom-[25%] right-[22%] w-105 h-105 rounded-full blur-[110px]"
                    style={{
                        background: "rgba(59,130,246,0.09)",
                        animationDelay: "1.8s",
                    }}
                />
                <div
                    className="absolute top-[58%] left-[18%] w-80 h-80 rounded-full blur-[90px]"
                    style={{ background: "rgba(99,102,241,0.07)" }}
                />

                {/* Subtle dot grid */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ opacity: 0.025 }}
                >
                    <defs>
                        <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="1" cy="1" r="0.8" fill="white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
            </div>

            {/* ── Center content ────────────────────────────────────────────── */}
            <div className="relative z-10 flex flex-col items-center gap-10">

                {/* Logo container */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, scale: 0.55, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                        duration: 0.9,
                        delay: 0.25,
                        ease: [0.34, 1.56, 0.64, 1],
                    }}
                >
                    {/* Spinning border ring (loading only) */}
                    <AnimatePresence>
                        {phase === "loading" && <SpinRing />}
                    </AnimatePresence>

                    {/* Pulse rings (complete only) */}
                    <AnimatePresence>
                        {phase === "complete" && (
                            <>
                                <motion.div
                                    className="absolute -inset-5 rounded-3xl border border-purple-400/45 pointer-events-none"
                                    initial={{ scale: 0.85, opacity: 0 }}
                                    animate={{ scale: [1, 1.18, 1], opacity: [0, 0.65, 0.25] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                                <motion.div
                                    className="absolute -inset-10 rounded-3xl border border-purple-500/20 pointer-events-none"
                                    initial={{ scale: 0.85, opacity: 0 }}
                                    animate={{ scale: [1, 1.12, 1], opacity: [0, 0.4, 0.1] }}
                                    transition={{
                                        duration: 2.6,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 0.55,
                                    }}
                                />
                            </>
                        )}
                    </AnimatePresence>

                    {/* Logo box */}
                    <motion.div
                        className="relative w-28 h-28 rounded-2xl flex items-center justify-center"
                        animate={
                            phase === "complete"
                                ? { scale: [1, 1.04, 1] }
                                : { scale: 1 }
                        }
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            background:
                                "linear-gradient(135deg, #9333ea 0%, #4f46e5 55%, #2563eb 100%)",
                            boxShadow:
                                phase === "complete"
                                    ? "0 0 70px rgba(168,85,247,0.65), 0 0 130px rgba(99,102,241,0.3), 0 30px 60px rgba(0,0,0,0.6)"
                                    : "0 0 44px rgba(168,85,247,0.35), 0 0 90px rgba(99,102,241,0.16), 0 25px 50px rgba(0,0,0,0.55)",
                        }}
                    >
                        <Image
                            src="/logos/logo.svg"
                            alt="Automatrix"
                            width={64}
                            height={64}
                            priority
                            className="object-contain drop-shadow-lg"
                        />

                        {/* Success checkmark */}
                        <AnimatePresence>
                            {phase === "complete" && (
                                <motion.div
                                    className="absolute -bottom-3 -right-3 w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center"
                                    style={{
                                        boxShadow:
                                            "0 0 18px rgba(16,185,129,0.7), 0 6px 20px rgba(0,0,0,0.4)",
                                    }}
                                    initial={{ scale: 0, opacity: 0, rotate: -30 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 420,
                                        damping: 14,
                                        delay: 0.08,
                                    }}
                                >
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.8}
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

                {/* Brand text */}
                <motion.div
                    className="text-center select-none"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.55 }}
                >
                    <h1
                        className="text-5xl font-bold tracking-tight"
                        style={{
                            background:
                                "linear-gradient(135deg, #e9d5ff 0%, #93c5fd 50%, #a5b4fc 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            textShadow: "none",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Automatrix
                    </h1>
                    <p
                        className="text-xs mt-2.5 font-medium tracking-[0.22em] uppercase"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                        Workflow Automation Platform
                    </p>
                </motion.div>

                {/* Progress bar + status */}
                <motion.div
                    className="w-72 space-y-3"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.85 }}
                >
                    {/* Bar track */}
                    <div
                        className="h-0.5 w-full rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.07)" }}
                    >
                        <div
                            className="h-full rounded-full transition-all duration-100 ease-out"
                            style={{
                                width: `${progress}%`,
                                background:
                                    "linear-gradient(90deg, #9333ea, #4f46e5, #2563eb)",
                                boxShadow: "0 0 10px rgba(139,92,246,0.8)",
                            }}
                        />
                    </div>

                    {/* Status row */}
                    <div
                        className="flex items-center justify-between text-[11px] font-mono tracking-widest"
                        style={{ color: "rgba(255,255,255,0.28)" }}
                    >
                        <motion.span
                            key={phase === "complete" ? "ready" : "loading"}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                        >
                            {phase === "complete"
                                ? "✓ Ready"
                                : `Initializing${".".repeat(dots)}`}
                        </motion.span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <motion.div
                className="absolute bottom-8 text-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 1.1 }}
            >
                <p
                    className="text-[10px] tracking-[0.32em] uppercase"
                    style={{ color: "rgba(255,255,255,0.13)" }}
                >
                    Powered by Souvik 
                </p>
            </motion.div>
        </motion.div>
    );
};
