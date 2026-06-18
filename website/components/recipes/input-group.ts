import { defineSlotRecipe } from "@pandacss/dev";

export const inputGroup = defineSlotRecipe({
    className: "inputGroup",
    description: "Dreamy UI Input.Group component",
    slots: ["root", "prefix", "suffix", "startAddon", "endAddon"],
    jsx: ["Input.Group", "Input.Prefix", "Input.Suffix", "Input.StartAddon", "Input.EndAddon"],
    base: {
        root: {
            display: "flex",
            alignItems: "stretch",
            width: "fit-content",
            position: "relative",
            isolation: "isolate",
            "& > input, & > textarea": {
                flex: 1
            },
            "&[data-prefix] > input, &[data-prefix] > textarea": {
                borderStartRadius: "none"
            },
            "&[data-suffix] > input, &[data-suffix] > textarea": {
                borderEndRadius: "none"
            }
        },
        prefix: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            px: 4,
            bg: "alpha.50",
            border: "1px solid",
            borderColor: "border",
            borderEnd: "none",
            borderStartRadius: "l2"
        },
        suffix: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            px: 4,
            bg: "alpha.50",
            border: "1px solid",
            borderColor: "border",
            borderStart: "none",
            borderEndRadius: "l2"
        },
        startAddon: {
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            flex: "0 0 auto",
            width: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "nowrap"
        },
        endAddon: {
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            flex: "0 0 auto",
            width: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "nowrap"
        }
    }
});
