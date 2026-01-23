"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ZapIcon, ShieldCheckIcon, TrendingUpIcon, SparklesIcon, WorkflowIcon, BotIcon } from "lucide-react";

export const AuthLayout = ({ children }: { children: React. ReactNode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas. height = window.innerHeight;

        const particles:  Array<{
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;
        }> = [];

        // Create particles
        for (let i = 0; i < 50; i++) {
            particles. push({
                x: Math. random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.3 + 0.1,
            });
        }

        /**
         * Advance and render one frame of the particle animation on the canvas, then schedule the next frame.
         *
         * Updates each particle's position using its velocity, wraps particles to the opposite edge when they leave
         * the canvas bounds, draws each particle as a filled circle using its size and opacity, and requests the
         * next animation frame.
         */
        function animate() {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle. y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                ctx.beginPath();
                ctx. arc(particle.x, particle. y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="relative min-h-screen w-full flex overflow-hidden bg-gray-50 dark:bg-gray-950">
            {/* Animated Canvas Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none opacity-20"
            />

            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900" />

            {/* Left Side - Branding & Features */}
            <div className="hidden lg:flex lg:w-1/2 relative mt-15 justify-center p-12 xl:p-16">
                <div className="max-w-xl w-full space-y-12 z-10">
                    {/* Logo & Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/50">
                                <Image src="/logos/logo.svg" alt="Automatrix Logo" width={60} height={40} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Automatrix
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">
                                    Workflow Automation
                                </p>
                            </div>
                        </div>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            Your personal automation assistant. Create powerful workflows, 
                            automate repetitive tasks, and boost productivity. 
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-6">
                        {/* Feature 1 */}
                        <div className="flex items-start gap-4 group">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 group-hover:border-orange-500/40 transition-all">
                                <ZapIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                                    Lightning Fast
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Build workflows in minutes, not hours
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex items-start gap-4 group">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 group-hover:border-green-500/40 transition-all">
                                <ShieldCheckIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                                    Secure & Reliable
                                </h3>
                                <p className="text-gray-600 dark: text-gray-400">
                                    Enterprise-grade security for your automations
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex items-start gap-4 group">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 group-hover:border-purple-500/40 transition-all">
                                <TrendingUpIcon className="w-6 h-6 text-purple-600 dark: text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                                    Scale Effortlessly
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    From startup to enterprise, we grow with you
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial or Stats */}
                    
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;