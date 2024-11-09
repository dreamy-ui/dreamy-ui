import type { ColorMode } from "@/provider/dream-provider";
import { useEffect, useRef } from "react";

interface ColorModeScriptProps {
    setColorMode: (colorMode: ColorMode) => void;
    defaultColorMode: ColorMode;
    useUserPreferenceColorMode: boolean;
    initialColorMode: ColorMode | undefined;
}

export function useColorModeScript({
    setColorMode,
    defaultColorMode,
    useUserPreferenceColorMode,
    initialColorMode: ssrColorMode
}: ColorModeScriptProps) {
    const initial = useRef(true);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (ssrColorMode) return;
        if (!initial.current) {
            initial.current = false;
            return;
        }

        const userPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        const initialColorMode = useUserPreferenceColorMode ? userPreference : defaultColorMode;

        if (initialColorMode) setColorMode(initialColorMode);
    }, []);
}
