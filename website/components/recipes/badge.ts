import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineRecipe } from "@pandacss/dev";

export const badge = defineRecipe({
    className: "badge",
    description:
        "A compact uppercase label for statuses, counts, or tags beside other content. outline shows scheme-colored text with a matching border and no fill; subtle adds a 10% tinted background; plain is text-only with no border or background.",
    jsx: ["Badge"],
    base: {
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        verticalAlign: "middle",
        px: 1,
        textTransform: "uppercase",
        fontSize: "xs",
        borderRadius: "sm",
        fontWeight: "bold",
        width: "fit-content"
    },
    defaultVariants: {
        variant: "subtle",
        scheme: "primary"
    },
    variants: {
        variant: {
            outline: {
                border: "1px solid",
                borderColor: "var(--badge-color)",
                color: "var(--badge-color)",
                bg: "transparent"
            },
            subtle: {
                color: "var(--badge-color)",
                bg: "var(--badge-color)/10"
            },
            plain: {
                color: "var(--badge-color)",
                bg: "transparent"
            }
        },
        scheme: getColorSchemes("--badge-color")
    }
});
