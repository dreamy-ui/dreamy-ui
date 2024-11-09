"use client";

import { useSafeLayoutEffect } from "@/components/descendant/utils";
import { useColorModeScript } from "@/provider/color-mode-script";
import { nextTick } from "@/utils/ticks";
import {
    type FeatureBundle,
    type LazyFeatureBundle,
    LazyMotion,
    MotionConfig,
    type Transition
} from "framer-motion";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { type DefaultVariants, defaultDefaultTransition, defaultMotionVariants } from "./motion";

export type ColorMode = "light" | "dark";

interface DreamContext {
    motionVariants: DefaultVariants;
    defaultTransition: Transition;
    colorMode: ColorMode;
    initialColorMode: ColorMode | undefined; // only for use to color mode script
    defaultColorMode: ColorMode;
    useUserPreferenceColorMode: boolean;
    disableRipple: boolean;
    setColorMode: (colorModeCb: ColorMode | ((prevColorMode: ColorMode) => ColorMode)) => void;
    toggleColorMode: () => void;
    hasHydrated: boolean;
    reduceMotion: boolean | "system";
}

const DreamContext = createContext<DreamContext | null>(null);

interface DreamProviderProps
    extends Partial<Omit<DreamContext, "hasHydrated" | "initialColorMode">> {
    motionFeatures: FeatureBundle | LazyFeatureBundle;
    framerMotionStrict?: boolean;
    children: React.ReactNode;
}

export const DreamColorModeCookieKey = "dream-ui-color-mode";

export function DreamProvider({
    children,
    motionVariants = defaultMotionVariants,
    defaultTransition = defaultDefaultTransition,
    disableRipple = false,
    colorMode: InitialColorMode,
    useUserPreferenceColorMode = true,
    defaultColorMode = "light",
    reduceMotion: InitialReduceMotion = false,
    motionFeatures,
    framerMotionStrict = false
}: DreamProviderProps) {
    const [reduceMotion, setReduceMotion] = useState(InitialReduceMotion);
    const [colorMode, setResolvedColorMode] = useState<ColorMode>(
        InitialColorMode ?? defaultColorMode
    );

    const setColorMode = useCallback(
        (colorModeCb: ColorMode | ((prevColorMode: ColorMode) => ColorMode)) => {
            const newColorMode =
                typeof colorModeCb === "function" ? colorModeCb(colorMode) : colorModeCb;

            const css = document.createElement("style");
            css.appendChild(
                document.createTextNode(
                    "*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
                )
            );
            document.head.appendChild(css);
            document.documentElement.style.colorScheme = newColorMode;
            document.documentElement.dataset.theme = newColorMode;
            document.cookie = `${DreamColorModeCookieKey}=${newColorMode}; path=/`;

            setResolvedColorMode(newColorMode);

            (() => window.getComputedStyle(document.body))();

            // wait for next tick
            nextTick(() => {
                document.head.removeChild(css);
            });
        },
        [colorMode]
    );

    const toggleColorMode = useCallback(() => {
        setColorMode((prevColorMode) => (prevColorMode === "light" ? "dark" : "light"));
    }, [setColorMode]);

    const [hasHydrated, setHasHydrated] = useState(false);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (!hasHydrated) {
            nextTick(() => {
                setHasHydrated(true);
            });
        }
    }, []);

    const context = useMemo(
        () => ({
            motionVariants,
            colorMode,
            setColorMode,
            toggleColorMode,
            defaultTransition,
            disableRipple,
            defaultColorMode,
            useUserPreferenceColorMode,
            hasHydrated,
            reduceMotion,
            initialColorMode: InitialColorMode
        }),
        [
            motionVariants,
            colorMode,
            setColorMode,
            toggleColorMode,
            defaultTransition,
            disableRipple,
            defaultColorMode,
            useUserPreferenceColorMode,
            hasHydrated,
            reduceMotion,
            InitialColorMode
        ]
    );

    useSafeLayoutEffect(() => {
        if (InitialReduceMotion === "system") {
            const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
            function listener(e: MediaQueryListEvent) {
                setReduceMotion(e.matches);
            }
            mediaQuery.addEventListener("change", listener);
            return () => mediaQuery.removeEventListener("change", listener);
        }
    }, []);

    useColorModeScript({
        setColorMode,
        defaultColorMode,
        useUserPreferenceColorMode,
        initialColorMode: InitialColorMode
    });

    return (
        <DreamContext.Provider value={context}>
            <MotionConfig
                reducedMotion={reduceMotion ? "always" : "never"}
                transition={defaultTransition}
            >
                <LazyMotion
                    features={motionFeatures}
                    strict={framerMotionStrict}
                >
                    {children}
                </LazyMotion>
            </MotionConfig>
        </DreamContext.Provider>
    );
}

export function useDream() {
    const context = useContext(DreamContext);
    if (!context) {
        throw new Error("useDream must be used within a DreamProvider");
    }
    return context;
}

export function useMotionVariants() {
    const { motionVariants } = useDream();

    return motionVariants;
}

export function useDefaultTransition() {
    const { defaultTransition } = useDream();

    return defaultTransition;
}

export function useColorMode() {
    const { colorMode, setColorMode, toggleColorMode } = useDream();

    return { colorMode, setColorMode, toggleColorMode };
}

export function useDisableRipple() {
    const { disableRipple } = useDream();

    return disableRipple;
}

export function useCanUseDOM() {
    const { hasHydrated } = useDream();

    return hasHydrated;
}

/**
 * Returns a boolean indicating whether the global reduce motion setting is enabled.
 * @default "system", it will resolve a boolean to the system preference.
 */
export function useReducedMotion() {
    const { reduceMotion } = useDream();

    return typeof reduceMotion === "string" ? false : reduceMotion;
}
