"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ZapIcon, SparklesIcon } from "lucide-react";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
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
        for (let i = 0; i < 30; i++) {
            particles. push({
                x: Math. random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math. random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }

        function animate() {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas. height) particle.y = 0;

                ctx.beginPath();
                ctx.arc(particle. x, particle.y, particle. size, 0, Math.PI * 2);
                ctx. fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
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
        <div className="relative min-h-screen w-full flex overflow-hidden">
            {/* Animated Canvas Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none opacity-30"
            />

            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 mesh-gradient bg-grid" />

            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-8 xl:p-12">
                <div className="max-w-md w-full space-y-8 animate-slide-in-left">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 xl:w-16 xl:h-16 rounded-2xl gradient-bg-primary flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-glow-pulse">
                            <Image src="/logos/logo.svg" alt="AutoMatrix" fill />
                        </div>
                        <div>
                            <h1 className="text-3xl xl:text-4xl font-bold gradient-text">Automatrix</h1>
                            <p className="text-sm xl:text-base text-muted-foreground">Workflow Automation</p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-5 xl:space-y-6 mt-12">
                        <FeatureItem
                            icon="⚡"
                            title="Lightning Fast"
                            description="Build workflows in minutes, not hours"
                        />
                        <FeatureItem
                            icon="🔒"
                            title="Secure & Reliable"
                            description="Enterprise-grade security for your automations"
                        />
                        <FeatureItem
                            icon="🚀"
                            title="Scale Effortlessly"
                            description="From startup to enterprise, we grow with you"
                        />
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-blob-bounce" />
                    <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-blob-bounce" style={{ animationDelay: "2s" }} />
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <div className="w-full max-w-md space-y-6 my-auto animate-scale-in">
                    {/* Mobile Logo */}
                    <Link
                        href="/"
                        className="flex lg:hidden items-center justify-center gap-3 mb-6 group"
                    >
                        <div className="relative w-12 h-12 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all group-hover:scale-110">
                            <Image src="/logos/logo.svg" alt="AutoMatrix" fill />
                        </div>
                        <div>
                            <span className="text-2xl font-bold gradient-text">Automatrix</span>
                        </div>
                    </Link>

                    {children}
                </div>
            </div>
        </div>
    );
};

// Feature Item Component
function FeatureItem({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3 xl:gap-4 group hover-lift">
            <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl glass-effect flex items-center justify-center text-xl xl:text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-base xl:text-lg">{title}</h3>
                <p className="text-xs xl:text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}