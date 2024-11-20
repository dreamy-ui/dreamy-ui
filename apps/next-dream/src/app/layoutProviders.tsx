"use client";

import { type ColorMode, DreamProvider } from "@dreamy-ui/react";
import { domMax } from "framer-motion";
import type { PropsWithChildren } from "react";

interface ProvidersProps extends PropsWithChildren {
    colorMode?: ColorMode;
}

export function Providers({ children, colorMode }: ProvidersProps) {
    return (
        <DreamProvider
            motionFeatures={domMax}
            colorMode={colorMode}
            framerMotionStrict
            useUserPreferenceColorMode
        >
            {children}
        </DreamProvider>
    );
}
