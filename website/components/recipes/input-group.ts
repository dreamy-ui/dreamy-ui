import { defineSlotRecipe } from "@pandacss/dev";

export const inputGroup = defineSlotRecipe({
    className: "inputGroup",
    description:
        "An input group that attaches prefix/suffix blocks or inline addons to a text input. Prefix and suffix use a soft tinted background and border merged with the input's border radius — no variant options.",
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
