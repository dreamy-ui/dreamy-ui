import { defineSlotRecipe } from "@pandacss/dev";

export const alert = defineSlotRecipe({
    className: "Dream-alert",
    description: "Dreamy UI Alert component",
    slots: ["root", "icon", "title", "description"],
    jsx: ["Alert", "AlertIcon", "AlertTitle", "AlertDescription"],
    base: {
        root: {
            display: "flex",
            alignItems: "center",
            paddingX: 4,
            paddingY: 3,
            borderRadius: "l2",
            fontSize: "md",
            width: "100%",
            gap: 2
        },
        title: {
            fontWeight: "semibold",
            fontSize: "md",
            textWrap: "wrap"
        },
        description: {},
        icon: {
            width: "5",
            height: "5",
            flexShrink: 0,
            "[data-status=success] &": {
                color: "{colors.success}",
                fill: "{colors.success}",
                stroke: "{colors.success}"
            },
            "[data-status=warning] &": {
                color: "{colors.warning}",
                fill: "{colors.warning}"
            },
            "[data-status=error] &": {
                color: "{colors.error}",
                fill: "{colors.error}"
            },
            "[data-status=info] &": {
                color: "{colors.info}",
                fill: "{colors.info}",
                stroke: "{colors.info}"
            }
        }
    },
    variants: {
        variant: {
            subtle: {
                root: {
                    "&[data-status=success]": {
                        bg: "{colors.success}/10"
                    },
                    "&[data-status=warning]": {
                        bg: "{colors.warning}/10"
                    },
                    "&[data-status=error]": {
                        bg: "{colors.error}/10"
                    },
                    "&[data-status=info]": {
                        bg: "{colors.info}/10"
                    }
                }
            },
            outline: {
                root: {
                    borderWidth: 1,
                    borderStyle: "solid",
                    "&[data-status=success]": {
                        borderColor: "{colors.success}"
                    },
                    "&[data-status=warning]": {
                        borderColor: "{colors.warning}"
                    },
                    "&[data-status=error]": {
                        borderColor: "{colors.error}"
                    },
                    "&[data-status=info]": {
                        borderColor: "{colors.info}"
                    }
                }
            }
        }
    },
    defaultVariants: {
        variant: "subtle"
    }
});
