"use client";

import { useSafeLayoutEffect } from "@/components/descendant/utils";
import { ToastManager } from "@/components/toast/toast-manager";
import { type Toast, ToastProvider } from "@/components/toast/toast-provider";
import { useColorModeScript } from "@/provider/color-mode-script";
import { nextTick } from "@/utils/ticks";
import {
    type FeatureBundle,
    type LazyFeatureBundle,
    LazyMotion,
    MotionConfig,
    type Transition
} from "motion/react";
import type React from "react";
import {
    createContext,
    startTransition,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import { type DefaultVariants, defaultDefaultTransition, defaultMotionVariants } from "./motion";

export type ColorMode = "light" | "dark";

interface IDreamContext {
    motionVariants: DefaultVariants;
    defaultTransition: Transition;
    defaultColorMode: ColorMode;
    useUserPreferenceColorMode: boolean;
    disableRipple: boolean;
    hasHydrated: boolean;
    reduceMotion: boolean | "system";
    /**
     * The default props for the new toasts.
     */
    defaultToastProps: Omit<Partial<Toast>, "id">;
}

interface IThemeContext {
    colorMode: ColorMode;
    setColorMode: (colorModeCb: ColorMode | ((prevColorMode: ColorMode) => ColorMode)) => void;
    toggleColorMode: () => void;
}

const DreamContext = createContext<IDreamContext | null>(null);
const ThemeContext = createContext<IThemeContext | null>(null);

interface DreamyProviderProps
    extends Partial<
        Omit<
            IDreamContext,
            "hasHydrated" | "initialColorMode" | "toggleColorMode" | "setColorMode" | "hasHydrated"
        >
    > {
    colorMode: ColorMode | undefined;
    motionFeatures: FeatureBundle | LazyFeatureBundle;
    motionStrict?: boolean;
    children: React.ReactNode;
}

export const DreamColorModeCookieKey = "dreamy-ui-color-mode";

const emptyObject = {};

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
    defaultToastProps = emptyObject,
    motionStrict = false
}: DreamyProviderProps) {
    const [reduceMotion, setReduceMotion] = useState(InitialReduceMotion);
    const [colorMode, setResolvedColorMode] = useState<ColorMode>(
        InitialColorMode ?? defaultColorMode
    );

    const setColorMode = useCallback(
        (colorModeCb: ColorMode | ((prevColorMode: ColorMode) => ColorMode)) => {
            startTransition(() => {
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

    const context = useMemo<IDreamContext>(
        () => ({
            motionVariants,
            defaultTransition,
            disableRipple,
            defaultColorMode,
            useUserPreferenceColorMode,
            hasHydrated,
            reduceMotion,
            defaultToastProps
        }),
        [
            motionVariants,
            defaultTransition,
            disableRipple,
            defaultColorMode,
            useUserPreferenceColorMode,
            hasHydrated,
            reduceMotion,
            defaultToastProps
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
                        <ToastProvider>
                            <ToastManager />
                            {children}
                        </ToastProvider>
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

export function useDefaultToastProps() {
    const { defaultToastProps } = useDreamy();

    return defaultToastProps;
}

/**
 * Returns a boolean indicating whether the global reduce motion setting is enabled.
 * @default "system", it will resolve a boolean to the system preference.
 */
export function useReducedMotion() {
    const { reduceMotion } = useDreamy();

    return typeof reduceMotion === "string" ? false : reduceMotion;
}
