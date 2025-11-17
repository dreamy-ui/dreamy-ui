"use client";

import { DreamyProvider as BaseDreamyProvider } from "@dreamy-ui/react";
import { getColorModeHTMLProps, getSSRColorMode } from "@dreamy-ui/react/rsc";
import type { Route } from "./+types/root";

const domMax = () => import("motion/react").then((mod) => mod.domMax);

interface DreamyProviderProps {
    children: React.ReactNode;
    colorMode?: Route.ComponentProps["loaderData"]["colorMode"];
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
