"use client";

import { DreamyProvider as BaseDreamyProvider } from "@dreamy-ui/react";
import type { ColorMode } from "@dreamy-ui/react";

const domMax = () => import("motion/react").then((mod) => mod.domMax);

interface DreamyProviderProps {
    children: React.ReactNode;
    colorMode?: ColorMode;
}

export function DreamyProvider({ children, colorMode }: DreamyProviderProps) {
    return (
        <BaseDreamyProvider 
            motionFeatures={domMax} 
            motionStrict
            colorMode={colorMode}
            useUserPreferenceColorMode
        >
            {children}
        </BaseDreamyProvider>
    );
}
