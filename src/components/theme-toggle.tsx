"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className={`w-10 h-10 rounded-xl bg-muted animate-pulse ${className}`} />
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className={`relative w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 group
                ${isDark
                    ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                    : "bg-amber-50 border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-100"
                } ${className}`}
        >
            {isDark ? (
                <SunIcon className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-12" />
            ) : (
                <MoonIcon className="w-5 h-5 text-amber-600 transition-transform duration-300 group-hover:-rotate-12" />
            )}
            {/* Rainbow glow ring in dark mode */}
            {isDark && (
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: "linear-gradient(135deg, #f43f5e, #f97316, #eab308, #22c55e, #3b82f6, #a855f7)",
                        filter: "blur(8px)",
                        zIndex: -1,
                    }}
                />
            )}
        </button>
    );
}
