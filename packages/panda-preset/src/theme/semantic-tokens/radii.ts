import type { BorderRadius } from "@/types";
import { defineSemanticTokens } from "@pandacss/dev";

export default function createRadiiTokens(borderRadius: BorderRadius) {
    return defineSemanticTokens.radii(
        (() => {
            switch (borderRadius) {
                case "none":
                    return {
                        l05: { value: "{radii.none}" },
                        l1: { value: "{radii.none}" },
                        l2: { value: "{radii.none}" },
                        l3: { value: "{radii.none}" },
                        "p-2": { value: "{radii.none}" },
                        "p-3": { value: "{radii.none}" },
                        "p-4": { value: "{radii.none}" },
                        "p-5": { value: "{radii.none}" },
                        "p-6": { value: "{radii.none}" }
                    } as const;
                case "xs":
                    return {
                        l05: { value: "{radii.none}" },
                        l1: { value: "{radii.2xs}" },
                        l2: { value: "{radii.xs}" },
                        l3: { value: "{radii.sm}" },
                        "p-2": { value: "0.375rem" },
                        "p-3": { value: "0.525rem" },
                        "p-4": { value: "0.625rem" },
                        "p-5": { value: "0.775rem" },
                        "p-6": { value: "0.875rem" }
                    } as const;
                case "sm":
                    return {
                        l05: { value: "{radii.2xs}" },
                        l1: { value: "{radii.xs}" },
                        l2: { value: "{radii.sm}" },
                        l3: { value: "{radii.md}" },
                        "p-2": { value: "0.5rem" },
                        "p-3": { value: "0.65rem" },
                        "p-4": { value: "0.75rem" },
                        "p-5": { value: "0.9rem" },
                        "p-6": { value: "1rem" }
                    } as const;
                case "md":
                    return {
                        l05: { value: "{radii.xs}" },
                        l1: { value: "{radii.sm}" },
                        l2: { value: "{radii.md}" },
                        l3: { value: "{radii.lg}" },
                        "p-2": { value: "0.625rem" },
                        "p-3": { value: "0.775rem" },
                        "p-4": { value: "0.875rem" },
                        "p-5": { value: "1.025rem" },
                        "p-6": { value: "1.125rem" }
                    } as const;
                case "lg":
                    return {
                        l05: { value: "{radii.sm}" },
                        l1: { value: "{radii.md}" },
                        l2: { value: "{radii.lg}" },
                        l3: { value: "{radii.xl}" },
                        "p-2": { value: "0.75rem" },
                        "p-3": { value: "0.9rem" },
                        "p-4": { value: "1rem" },
                        "p-5": { value: "1.15rem" },
                        "p-6": { value: "1.25rem" }
                    } as const;
                case "xl":
                    return {
                        l05: { value: "{radii.md}" },
                        l1: { value: "{radii.lg}" },
                        l2: { value: "{radii.xl}" },
                        l3: { value: "{radii.2xl}" },
                        "p-2": { value: "1rem" },
                        "p-3": { value: "1.15rem" },
                        "p-4": { value: "1.25rem" },
                        "p-5": { value: "1.4rem" },
                        "p-6": { value: "1.5rem" }
                    } as const;
                case "2xl":
                    return {
                        l05: { value: "{radii.lg}" },
                        l1: { value: "{radii.xl}" },
                        l2: { value: "{radii.2xl}" },
                        l3: { value: "{radii.3xl}" },
                        "p-2": { value: "1.25rem" },
                        "p-3": { value: "1.4rem" },
                        "p-4": { value: "1.5rem" },
                        "p-5": { value: "1.65rem" },
                        "p-6": { value: "1.75rem" }
                    } as const;
            }
        })()
    );
}
