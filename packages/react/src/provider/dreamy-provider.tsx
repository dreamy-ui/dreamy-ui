"use client";

import { useSafeLayoutEffect } from "@/components/descendant/utils";
import { useColorModeScript } from "@/provider/color-mode-script";
import { objectToDeps } from "@/utils";
import { nextTick } from "@/utils/ticks";
import {
    type FeatureBundle,
    type LazyFeatureBundle,
    LazyMotion,
    MotionConfig,
    type Transition
} from "motion/react";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { type DefaultVariants, defaultDefaultTransition, defaultMotionVariants } from "./motion";
import { DREAMY_COLOR_MODE_COOKIE_KEY } from "./ssr-color-mode";

export type ColorMode = "light" | "dark";

interface IDreamContext {
    /**
     * The default variants for the motion components.
     */
    motionVariants: DefaultVariants;
    /**
     * The default transition for the motion components.
     */
    defaultTransition: Transition;
    /**
     * The default color mode, if the user doesn't have it set yet (`colorMode` prop is not provided)
     */
    defaultColorMode: ColorMode;
    /**
     * Whether to use the user preference color mode.
     */
    useUserPreferenceColorMode: boolean;
    /**
     * Whether to disable the ripple effect.
     */
    disableRipple: boolean;
    hasHydrated: boolean;
    reduceMotion: boolean | "system";
}

interface IThemeContext {
    colorMode: ColorMode;
    setColorMode: (colorModeCb: ColorMode | ((prevColorMode: ColorMode) => ColorMode)) => void;
    toggleColorMode: () => void;
}

const DreamContext = createContext<IDreamContext | null>(null);
const ThemeContext = createContext<IThemeContext | null>(null);

interface DreamyProviderProps extends Partial<Omit<IDreamContext, "hasHydrated">> {
    /**
     * The initial color mode for the app. Control color mode with the `useColorMode` hook.
     */
    colorMode: ColorMode | undefined;
    /**
     * The features required for motion components.
     */
    motionFeatures: FeatureBundle | LazyFeatureBundle;
    /**
     * Whether to use the strict mode for motion.
     */
    motionStrict?: boolean;
    /**
     * The options to add to the color mode cookie.
     * @default { path: "/", expires: Date.now() + 31536000000 (1 year) }
     */
    colorModeCookieOptions?: Partial<CookieInit>;
    /**
     * Rest of the app.
     */
    children: React.ReactNode;
}

export function DreamyProvider({
    children,
    motionVariants = defaultMotionVariants,
    defaultTransition = defaultDefaultTransition,
    disableRipple = false,
    colorMode: InitialColorMode,
    useUserPreferenceColorMode = true,
    defaultColorMode = "light",
    reduceMotion: InitialReduceMotion = false,
    motionFeatures,
    motionStrict = false,
    colorModeCookieOptions = {}
}: DreamyProviderProps) {
    const [reduceMotion, setReduceMotion] = useState(InitialReduceMotion);
    const [colorMode, setResolvedColorMode] = useState<ColorMode>(
        InitialColorMode ?? defaultColorMode
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const setColorModeCookie = useCallback((newColorMode: ColorMode) => {
        cookieStore.set({
            name: DREAMY_COLOR_MODE_COOKIE_KEY,
            value: newColorMode,
            path: "/",
            sameSite: "none",
            expires: Date.now() + 31536000000,
            ...colorModeCookieOptions
        });
    }, objectToDeps(colorModeCookieOptions));

    const setColorMode = useCallback(
        (colorModeCb: ColorMode | ((prevColorMode: ColorMode) => ColorMode)) => {
            const css = document.createElement("style");
            css.appendChild(
                document.createTextNode(
                    "*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
                )
            );
            document.head.appendChild(css);

            setResolvedColorMode((prev) => {
                const newColorMode =
                    typeof colorModeCb === "function" ? colorModeCb(prev) : colorModeCb;

                document.documentElement.style.colorScheme = newColorMode;
                document.documentElement.dataset.theme = newColorMode;

                setColorModeCookie(newColorMode);

                return newColorMode;
            });

            (() => window.getComputedStyle(document.body))();

            nextTick(() => {
                document.head.removeChild(css);
            });
        },
        [setColorModeCookie]
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

    const context = useMemo<IDreamContext>(
        () => ({
            motionVariants,
            defaultTransition,
            disableRipple,
            defaultColorMode,
            useUserPreferenceColorMode,
            hasHydrated,
            reduceMotion
        }),
        [
            motionVariants,
            defaultTransition,
            disableRipple,
            defaultColorMode,
            useUserPreferenceColorMode,
            hasHydrated,
            reduceMotion
        ]
    );

    const themeContext = useMemo<IThemeContext>(
        () => ({
            colorMode,
            setColorMode,
            toggleColorMode
        }),
        [colorMode, setColorMode, toggleColorMode]
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
        setColorModeCookie,
        defaultColorMode,
        useUserPreferenceColorMode,
        initialColorMode: InitialColorMode
    });

    return (
        <DreamContext.Provider value={context}>
            <ThemeContext.Provider value={themeContext}>
                <MotionConfig
                    reducedMotion={reduceMotion && reduceMotion !== "system" ? "always" : "never"}
                    transition={defaultTransition}
                >
                    <LazyMotion
                        features={motionFeatures}
                        strict={motionStrict}
                    >
                        {children}
                    </LazyMotion>
                </MotionConfig>
            </ThemeContext.Provider>
        </DreamContext.Provider>
    );
}

export function useDreamy() {
    const context = useContext(DreamContext);
    if (!context) {
        throw new Error("useDreamy must be used within a DreamyProvider");
    }
    return context;
}

export function useMotionVariants() {
    const { motionVariants } = useDreamy();

    return motionVariants;
}

export function useDefaultTransition() {
    const { defaultTransition } = useDreamy();

    return defaultTransition;
}

export function useColorMode() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useColorMode must be used within a DreamyProvider");
    }

    return context;
}

export function useDisableRipple() {
    const { disableRipple } = useDreamy();

    return disableRipple;
}

export function useCanUseDOM() {
    const { hasHydrated } = useDreamy();

    return hasHydrated;
}

// export function useDefaultToastProps() {
// 	const { defaultToastProps } = useDreamy();

// 	return defaultToastProps;
// }

/**
 * Returns a boolean indicating whether the global reduce motion setting is enabled.
 * @default "system", it will resolve a boolean to the system preference.
 */
export function useReducedMotion() {
    const { reduceMotion } = useDreamy();

    return typeof reduceMotion === "string" ? false : reduceMotion;
}
