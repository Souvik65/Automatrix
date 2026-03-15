"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { ZapIcon, ShieldCheckIcon, TrendingUpIcon } from "lucide-react";
import { SplashScreen } from "./splash-screen";

const FEATURES = [
    {
        icon: ZapIcon,
        title: "Lightning Fast",
        description: "Build workflows in minutes, not hours",
        gradient: "from-orange-50 to-yellow-50",
        iconColor: "text-orange-500",
        border: "border-orange-200",
    },
    {
        icon: ShieldCheckIcon,
        title: "Secure & Reliable",
        description: "Enterprise-grade security for your automations",
        gradient: "from-green-50 to-emerald-50",
        iconColor: "text-green-600",
        border: "border-green-200",
    },
    {
        icon: TrendingUpIcon,
        title: "Scale Effortlessly",
        description: "From startup to enterprise, we grow with you",
        gradient: "from-purple-50 to-pink-50",
        iconColor: "text-purple-600",
        border: "border-purple-200",
    },
];

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);
    const [showSplash, setShowSplash] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const seen = sessionStorage.getItem("splash_done");
        if (seen) setShowSplash(true);
    }, []);

    const handleSplashFinish = useCallback(() => {
        setShowSplash(true);
        sessionStorage.setItem("splash_done", "1");
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();

        type Particle = { x: number; y: number; vx: number; vy: number; r: number; opacity: number };
        const particles: Particle[] = Array.from({ length: 50 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.15 + 0.05,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x = (p.x + p.vx + canvas.width) % canvas.width;
                p.y = (p.y + p.vy + canvas.height) % canvas.height;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139,92,246,${p.opacity})`;
                ctx.fill();
            });
            animFrameRef.current = requestAnimationFrame(draw);
        };
        draw();

        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    return (
        <>
            {mounted && showSplash && <SplashScreen onFinish={handleSplashFinish} />}

            <div className="relative min-h-screen w-full flex overflow-hidden">
                {/* Soft light gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/60 to-blue-50/80" />

                {/* Soft glow blobs */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] -translate-x-1/3 -translate-y-1/3 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] translate-x-1/4 translate-y-1/4 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

                {/* Particle canvas */}
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />

                {/* ── LEFT PANEL ── */}
                <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-center p-16 xl:p-20 border-r border-purple-100">
                    <div className="space-y-10 z-10 max-w-lg">
                        {/* Logo & Brand */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-xl shadow-purple-300/40">
                                    <Image src="/logos/logo.svg" alt="Automatrix Logo" width={42} height={42} />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                                        Automatrix
                                    </h1>
                                    <p className="text-gray-500 text-sm tracking-widest uppercase font-medium mt-0.5">
                                        Workflow Automation
                                    </p>
                                </div>
                            </div>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Build powerful automations with a drag-and-drop canvas.
                                Connect any tool, schedule any task, and scale without limits.
                            </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="space-y-4">
                            {FEATURES.map((feat) => (
                                <div
                                    key={feat.title}
                                    className={`flex items-start gap-4 p-4 rounded-2xl border ${feat.border}
                                        bg-gradient-to-r ${feat.gradient}
                                        transition-all duration-300 hover:shadow-md cursor-default`}
                                >
                                    <div className="p-2 rounded-xl bg-white shadow-sm">
                                        <feat.icon className={`w-5 h-5 ${feat.iconColor}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-sm">{feat.title}</h3>
                                        <p className="text-gray-500 text-xs mt-0.5">{feat.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-8 pt-2">
                            {[["10K+", "Workflows Built"], ["99.9%", "Uptime"], ["50+", "Integrations"]].map(([stat, label]) => (
                                <div key={label} className="text-center">
                                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{stat}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                            <Image src="/logos/logo.svg" alt="Automatrix" width={28} height={28} />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">Automatrix</span>
                    </div>

                    <div className="w-full max-w-[440px]">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthLayout;