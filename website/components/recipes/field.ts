import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
    root: {
        selector: "&"
    },
    label: {
        selector: "& [data-part='label']"
    },
    error: {
        selector: "& [data-part='error']"
    },
    hint: {
        selector: "& [data-part='hint']"
    },
    requiredIndicator: {
        selector: "& [data-part='requiredIndicator']"
    },
    errorIcon: {
        selector: "& [data-part='errorIcon']"
    }
});

export { parts as fieldParts };

export const field = defineRecipe({
    className: "field",
    description: "Dreamy UI Field component",
    jsx: ["Field.Root", "Field.Label", "Field.Error", "Field.Hint", "Field.ErrorIcon"],
    base: parts({
        root: {
            width: "100%",
            position: "relative",
            display: "flex",
            gap: 1.5
        },
        label: {
            display: "flex",
            alignItems: "center",
            textAlign: "start",
            textStyle: "sm",
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
        hint: {
            fontSize: "sm",
            color: "{colors.fg.medium}"
        },
        requiredIndicator: {
            color: "{colors.error}",
            marginStart: 0.5
        }
    }),
    variants: {
        orientation: {
            vertical: parts({
                root: {
                    flexDirection: "column",
                    alignItems: "flex-start"
                }
            }),
            horizontal: parts({
                root: {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                },
                label: {
                    flex: "0 0 var(--field-label-width, 80px)"
                }
            })
        }
    },
    defaultVariants: {
        orientation: "vertical"
    }
});
