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
						l4: { value: "{radii.none}" },
						l5: { value: "{radii.none}" },
						l6: { value: "{radii.none}" }
					} as const;
				case "xs":
					return {
						l05: { value: "{radii.none}" },
						l1: { value: "{radii.2xs}" },
						l2: { value: "{radii.xs}" },
						l3: { value: "{radii.sm}" },
						l4: { value: "{radii.md}" },
						l5: { value: "{radii.lg}" },
						l6: { value: "{radii.xl}" }
					} as const;
				case "sm":
					return {
						l05: { value: "{radii.2xs}" },
						l1: { value: "{radii.xs}" },
						l2: { value: "{radii.sm}" },
						l3: { value: "{radii.md}" },
						l4: { value: "{radii.lg}" },
						l5: { value: "{radii.xl}" },
						l6: { value: "{radii.2xl}" }
					} as const;
				case "md":
					return {
						l05: { value: "{radii.xs}" },
						l1: { value: "{radii.sm}" },
						l2: { value: "{radii.md}" },
						l3: { value: "{radii.lg}" },
						l4: { value: "{radii.xl}" },
						l5: { value: "{radii.2xl}" },
						l6: { value: "{radii.3xl}" }
					} as const;
				case "lg":
					return {
						l05: { value: "{radii.sm}" },
						l1: { value: "{radii.md}" },
						l2: { value: "{radii.lg}" },
						l3: { value: "{radii.xl}" },
						l4: { value: "{radii.2xl}" },
						l5: { value: "{radii.3xl}" },
						l6: { value: "{radii.4xl}" }
					} as const;
				case "xl":
					return {
						l05: { value: "{radii.md}" },
						l1: { value: "{radii.lg}" },
						l2: { value: "{radii.xl}" },
						l3: { value: "{radii.2xl}" },
						l4: { value: "{radii.3xl}" },
						l5: { value: "{radii.4xl}" },
						l6: { value: "{radii.5xl}" }
					} as const;
				case "2xl":
					return {
						l05: { value: "{radii.lg}" },
						l1: { value: "{radii.xl}" },
						l2: { value: "{radii.2xl}" },
						l3: { value: "{radii.3xl}" },
						l4: { value: "{radii.4xl}" },
						l5: { value: "{radii.5xl}" },
						l6: { value: "{radii.full}" }
					} as const;
			}
		})()
	);
}
