import { useSafeLayoutEffect } from "@/hooks";
import type { ColorMode } from "@/provider/dreamy-provider";
import { useRef } from "react";

interface ColorModeScriptProps {
    setColorMode: (colorMode: ColorMode) => void;
    setColorModeCookie: (colorMode: ColorMode) => void;
    defaultColorMode: ColorMode;
    useUserPreferenceColorMode: boolean;
    initialColorMode: ColorMode | undefined;
}

export function useColorModeScript({
    setColorMode,
    setColorModeCookie,
    defaultColorMode,
    useUserPreferenceColorMode,
    initialColorMode: ssrColorMode
}: ColorModeScriptProps) {
    const initial = useRef(true);

    useSafeLayoutEffect(() => {
        if (ssrColorMode) return;
        if (!initial.current) {
            initial.current = false;
            return;
        }

        const userPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        const initialColorMode = useUserPreferenceColorMode ? userPreference : defaultColorMode;

        if (initialColorMode) {
            // Use SSR-data attribute to determine current mode
            const current = ssrColorMode ?? defaultColorMode;
            if (current === initialColorMode) {
                setColorModeCookie(initialColorMode);
            } else {
                setColorMode(initialColorMode);
            }
        }
    }, []);
}
