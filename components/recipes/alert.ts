import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
    root: { selector: "&" },
    icon: { selector: "& [data-part='icon']" },
    title: { selector: "& [data-part='title']" },
    description: { selector: "& [data-part='description']" }
});

export const alert = defineRecipe({
    className: "alert",
    description: "Dreamy UI Alert component",
    jsx: ["Alert"],
    base: parts({
        root: {
            display: "flex",
            flexDirection: "column",
            paddingX: 4,
            paddingY: 3,
            borderRadius: "l2",
            fontSize: "md",
            width: "100%",
            borderWidth: "1px",
            borderStyle: "solid",
            gap: 0.5,
            "--original-color": "80%",
            "--description-color": "60%",
            "&[data-status=success]": {
                "--alert-bg": "color-mix(in srgb, {colors.success} 10%, transparent)",
                "--alert-border-color": "color-mix(in srgb, {colors.success} 40%, transparent)",
                "--alert-color":
                    "color-mix(in srgb, {colors.success} var(--original-color), {colors.inverted})",
                "--alert-description-color":
                    "color-mix(in srgb, {colors.success} var(--description-color), {colors.inverted})"
            },
            "&[data-status=warning]": {
                "--alert-bg": "color-mix(in srgb, {colors.warning} 10%, transparent)",
                "--alert-border-color": "color-mix(in srgb, {colors.warning} 40%, transparent)",
                "--alert-color":
                    "color-mix(in srgb, {colors.warning} var(--original-color), {colors.inverted})",
                "--alert-description-color":
                    "color-mix(in srgb, {colors.warning} var(--description-color), {colors.inverted})"
            },
            "&[data-status=error]": {
                "--alert-bg": "color-mix(in srgb, {colors.error} 10%, transparent)",
                "--alert-border-color": "color-mix(in srgb, {colors.error} 40%, transparent)",
                "--alert-color":
                    "color-mix(in srgb, {colors.error} var(--original-color), {colors.inverted})",
                "--alert-description-color":
                    "color-mix(in srgb, {colors.error} var(--description-color), {colors.inverted})"
            },
            "&[data-status=info]": {
                "--alert-bg": "color-mix(in srgb, {colors.info} 10%, transparent)",
                "--alert-border-color": "color-mix(in srgb, {colors.info} 40%, transparent)",
                "--alert-color":
                    "color-mix(in srgb, {colors.info} var(--original-color), {colors.inverted})",
                "--alert-description-color":
                    "color-mix(in srgb, {colors.info} var(--description-color), {colors.inverted})"
            }
        },
        title: {
            display: "flex",
            alignItems: "center",
            fontWeight: "semibold",
            fontSize: "md",
            textWrap: "wrap"
        },
        description: {
            ml: 7,
            color: "var(--alert-description-color)"
        },
        icon: {
            width: "5",
            height: "5",
            mr: 2,
            flexShrink: 0,
            "[data-status=success]&": {
                color: "var(--alert-color)",
                fill: "var(--alert-color)",
                stroke: "var(--alert-color)"
            },
            "[data-status=warning]&": {
                color: "var(--alert-color)",
                fill: "var(--alert-color)"
            },
            "[data-status=error]&": {
                color: "var(--alert-color)",
                fill: "var(--alert-color)"
            },
            "[data-status=info]&": {
                color: "var(--alert-color)",
                fill: "var(--alert-color)",
                stroke: "var(--alert-color)"
            }
        }
    }),
    variants: {
        variant: {
            subtle: parts({
                root: {
                    color: "var(--alert-color)",
                    bg: "var(--alert-bg)",
                    borderColor: "var(--alert-border-color)"
                }
            }),
            outline: parts({
                root: {
                    borderWidth: 1,
                    borderStyle: "solid",
                    color: "var(--alert-color)",
                    borderColor: "var(--alert-border-color)"
                }
            })
        }
    },
    defaultVariants: {
        variant: "subtle"
    }
});
