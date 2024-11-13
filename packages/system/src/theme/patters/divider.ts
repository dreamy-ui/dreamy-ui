import { definePattern } from "@pandacss/dev";

export const divider = definePattern({
    jsx: ["Divider"],
    description: "divider pattern",
    properties: {
        orientation: {
            type: "enum",
            value: ["horizontal", "vertical"]
        },
        thickness: {
            type: "string",
            value: "1px"
        }
    },
    defaultValues: {
        orientation: "horizontal",
        thickness: "1px",
        color: "alpha.300"
    },
    transform(props, { map }) {
        const { orientation, thickness, color, backgroundColor, background, bg, ...rest } = props;
        return {
            "--thickness": thickness,
            width: map(orientation, (v) => (v === "vertical" ? undefined : "100%")),
            height: map(orientation, (v) => (v === "horizontal" ? undefined : "100%")),
            borderTop: "none",
            borderBlockEndWidth: map(orientation, (v) =>
                v === "horizontal" ? "var(--thickness)" : undefined
            ),
            borderInlineStartWidth: map(orientation, (v) =>
                v === "vertical" ? "var(--thickness)" : undefined
            ),
            borderColor: color ?? backgroundColor ?? background ?? bg,
            ...rest
        };
    }
});
