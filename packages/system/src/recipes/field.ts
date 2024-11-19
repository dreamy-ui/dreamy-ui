import { defineSlotRecipe } from "@pandacss/dev";

export const field = defineSlotRecipe({
    className: "dream-field",
    description: "Dreamy UI Field component",
    slots: ["root", "label", "error", "helpText", "requiredIndicator", "errorIcon"],
    jsx: ["Field", "FieldLabel", "FieldError", "FieldHelpText", "FieldErrorIcon"],
    base: {
        root: {
            width: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1.5
        },
        label: {
            fontSize: "md",
            fontWeight: "medium",
            opacity: 1,
            width: "100%",
            _disabled: {
                opacity: 0.4
            }
        },
        error: {
            fontSize: "sm",
            color: "{colors.error}",
            display: "flex",
            alignItems: "center",
            fontWeight: "medium",
            gap: 1
        },
        errorIcon: {
            color: "{colors.error}",
            width: "4",
            height: "4",
            flexShrink: 0
        },
        helpText: {
            fontSize: "sm",
            color: "{colors.fg.muted}"
        },
        requiredIndicator: {
            color: "{colors.error}",
            marginStart: 0.5
        }
    }
});
