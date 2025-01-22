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
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react";
import {
	type DefaultVariants,
	defaultDefaultTransition,
	defaultMotionVariants
} from "./motion";

export type ColorMode = "light" | "dark";

interface DreamContext {
	motionVariants: DefaultVariants;
	defaultTransition: Transition;
	colorMode: ColorMode;
	initialColorMode: ColorMode | undefined; // only for use to color mode script
	defaultColorMode: ColorMode;
	useUserPreferenceColorMode: boolean;
	disableRipple: boolean;
	setColorMode: (
		colorModeCb: ColorMode | ((prevColorMode: ColorMode) => ColorMode)
	) => void;
	toggleColorMode: () => void;
	hasHydrated: boolean;
	reduceMotion: boolean | "system";
	/**
	 * The default props for the new toasts.
	 */
	defaultToastProps: Omit<Partial<Toast>, "id">;
}

const DreamContext = createContext<DreamContext | null>(null);

interface DreamyProviderProps
	extends Partial<
		Omit<
			DreamContext,
			| "hasHydrated"
			| "initialColorMode"
			| "toggleColorMode"
			| "setColorMode"
			| "hasHydrated"
		>
	> {
	motionFeatures: FeatureBundle | LazyFeatureBundle;
	motionStrict?: boolean;
	children: React.ReactNode;
}

export const DreamColorModeCookieKey = "dreamy-ui-color-mode";

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
	defaultToastProps = {},
	motionStrict = false
}: DreamyProviderProps) {
	const [reduceMotion, setReduceMotion] = useState(InitialReduceMotion);
	const [colorMode, setResolvedColorMode] = useState<ColorMode>(
		InitialColorMode ?? defaultColorMode
	);

	const setColorMode = useCallback(
		(
			colorModeCb: ColorMode | ((prevColorMode: ColorMode) => ColorMode)
		) => {
			const newColorMode =
				typeof colorModeCb === "function"
					? colorModeCb(colorMode)
					: colorModeCb;

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
		setColorMode((prevColorMode) =>
			prevColorMode === "light" ? "dark" : "light"
		);
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
			defaultToastProps,
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
			defaultToastProps,
			InitialColorMode
		]
	);

	useSafeLayoutEffect(() => {
		if (InitialReduceMotion === "system") {
			const mediaQuery = window.matchMedia(
				"(prefers-reduced-motion: reduce)"
			);
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
				<LazyMotion features={motionFeatures} strict={motionStrict}>
					<ToastProvider>
						<ToastManager />
						{children}
					</ToastProvider>
				</LazyMotion>
			</MotionConfig>
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
	const { colorMode, setColorMode, toggleColorMode } = useDreamy();

	return { colorMode, setColorMode, toggleColorMode };
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
