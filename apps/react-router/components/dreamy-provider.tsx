"use client";

import { DreamyProvider as BaseDreamyProvider, type ColorMode } from "@dreamy-ui/react";
import { getColorModeHTMLProps, getSSRColorMode } from "@dreamy-ui/react/rsc";

const domMax = () => import("motion/react").then((mod) => mod.domMax);

interface DreamyProviderProps {
    children: React.ReactNode;
    colorMode?: ColorMode;
}

export function DreamyProvider({ children, colorMode }: DreamyProviderProps) {
    return (
        <BaseDreamyProvider
            motionFeatures={domMax}
            colorMode={colorMode}
            motionStrict
            useUserPreferenceColorMode
        >
            {children}
        </BaseDreamyProvider>
    );
}

export { getColorModeHTMLProps, getSSRColorMode };
