"use client";

import { useCallback, useState } from "react";
import { SplashScreen } from "@/features/auth/components/splash-screen";

export function SplashWrapper({ children }: { children: React.ReactNode }) {
    const [done, setDone] = useState(false);
    const handleFinish = useCallback(() => setDone(true), []);

    return (
        <>
            {!done && <SplashScreen onFinish={handleFinish} />}
            {children}
        </>
    );
}
