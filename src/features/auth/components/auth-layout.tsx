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

        const ctx = canvas. getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas. height = window.innerHeight;

        const particles:  Array<{
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY:  number;
            opacity: number;
        }> = [];

        // Create particles
        for (let i = 0; i < 30; i++) {
            particles. push({
                x: Math. random() * canvas.width, //  It generates a random x-coordinate within the width of the canvas.
                y: Math.random() * canvas.height, // It generates a random y-coordinate within the height of the canvas.
                size: Math.random() * 4 + 2, // It assigns a random size between 3 and 9 to the particle.
                speedX: Math.random() * 0.5 - 0.25, // It assigns a random horizontal speed between -0.15 and 0.15.
                speedY: Math. random() * 0.5 - 0.25, // It assigns a random vertical speed between -0.15 and 0.15.
                opacity: Math.random() * 0.5 + 0.2, // It assigns a random opacity between 0.2 and 0.7.
            });
        }

        function animate() {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                particle.x += particle.speedX; // It updates the x-coordinate of the particle based on its horizontal speed.
                particle.y += particle.speedY; // It updates the y-coordinate of the particle based on its vertical speed.

                // Wrap particles around the edges

                if (particle.x < 0) particle.x = canvas.width; // If the particle moves off the left edge, it reappears on the right edge.
                if (particle.x > canvas.width) particle.x = 0;     // If the particle moves off the right edge, it reappears on the left edge.
                if (particle. y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2); // It draws a circle at the particle's current position with its specified size.
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
        <div className="relative min-h-screen flex overflow-hidden">
            {/* Animated Canvas Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none opacity-30"
            />

            {/* Mesh Gradient Background
            <div className="absolute inset-0 mesh-gradient bg-grid" /> */}

            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
                <div className="max-w-md space-y-8 animate-slide-in-left">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl gradient-bg-primary flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-glow-pulse">
                            <Image src="/logos/logo.svg" alt="AutoMatrix" width={50} height={50} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold gradient-text">Automatrix</h1>
                            <p className="text-muted-foreground">Workflow Automation</p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-6 mt-12">
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
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md space-y-8 animate-scale-in">
                    {/* Mobile Logo */}
                    <Link
                        href="/"
                        className="flex lg:hidden items-center justify-center gap-3 mb-8 group"
                    >
                        <div className="relative w-12 h-12 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all group-hover:scale-110">
                            <Image src="/logos/logo.svg" alt="AutoMatrix" fill />
                        </div>
                        <div>
                            <span className="text-2xl font-bold gradient-text object-contain">Automatrix</span>
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
        <div className="flex items-start gap-4 group hover-lift">
            <div className="w-12 h-12 rounded-xl glass-effect flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}