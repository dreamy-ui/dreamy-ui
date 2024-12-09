import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
    root: { selector: "&" },
    wrapper: { selector: '& [data-part="wrapper"]' },
    circle1: { selector: '& [data-part="circle1"]' },
    circle2: { selector: '& [data-part="circle2"]' },
    label: { selector: '& [data-part="label"]' }
});

export const spinner = defineRecipe({
    className: "dream-spinner",
    jsx: ["Spinner", "Button"],
    base: parts({
        root: {
            display: "inline-flex",
            alignItems: "center",
            flexDir: "column",
            gap: "2",
            justifyContent: "center",
            position: "relative"
        },
        wrapper: {
            display: "inline-flex",
            alignItems: "center",
            flexDir: "column",
            gap: "2",
            justifyContent: "center",
            position: "relative"
        },
        circle1: {
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "full",
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "currentColor",
            borderTopColor: "transparent",
            borderRightColor: "transparent",
            borderLeftColor: "transparent",
            animation: "spinner-spin var(--spinner-speed, 0.8s) ease infinite"
        },
        circle2: {
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "full",
            borderWidth: "2px",
            borderStyle: "dotted",
            borderColor: "currentColor",
            borderTopColor: "transparent",
            borderRightColor: "transparent",
            borderLeftColor: "transparent",
            animation: "spinner-spin var(--spinner-speed, 0.8s) linear infinite"
        },
        label: { fontSize: "sm", color: "currentColor", fontWeight: "semibold" }
    }),
    defaultVariants: {
        size: "md"
    },
    variants: {
        size: {
            sm: parts({
                wrapper: { width: "5", height: "5" },
                circle1: { borderWidth: "2" },
                circle2: { borderWidth: "2" },
                label: { fontSize: "xs" }
            }),
            md: parts({
                wrapper: { width: "8", height: "8" },
                circle1: { borderWidth: "3" },
                circle2: { borderWidth: "3" },
                label: { fontSize: "sm" }
            }),
            lg: parts({
                wrapper: { width: "10", height: "10" },
                circle1: { borderWidth: "3" },
                circle2: { borderWidth: "3" },
                label: { fontSize: "md" }
            })
        }
    }
});
