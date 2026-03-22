import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineSlotRecipe } from "@pandacss/dev";

export const stepper = defineSlotRecipe({
    className: "stepper",
    description: "Dreamy UI Stepper component",
    slots: [
        "root",
        "list",
        "item",
        "trigger",
        "indicator",
        "title",
        "description",
        "separator",
        "content",
        "completedContent",
        "nextTrigger",
        "prevTrigger"
    ],
    jsx: [
        "Stepper.Root",
        "Stepper.List",
        "Stepper.Item",
        "Stepper.Trigger",
        "Stepper.Indicator",
        "Stepper.Title",
        "Stepper.Description",
        "Stepper.Separator",
        "Stepper.Content",
        "Stepper.CompletedContent",
        "Stepper.NextTrigger",
        "Stepper.PrevTrigger"
    ],
    base: {
        root: {
            display: "flex",
            width: "full",
            "--stepper-gutter": "{spacing.3}",
            "--stepper-thickness": "2px",
            "&[data-orientation=horizontal]": {
                flexDirection: "column",
                width: "100%"
            },
            "&[data-orientation=vertical]": {
                flexDirection: "row",
                height: "100%"
            }
        },
        list: {
            display: "flex",
            justifyContent: "space-between",
            "&[data-orientation=horizontal]": {
                flexDirection: "row",
                alignItems: "center"
            },
            "&[data-orientation=vertical]": {
                flexDirection: "column",
                alignItems: "flex-start"
            }
        },
        item: {
            position: "relative",
            display: "flex",
            gap: "3",
            flex: "1 0 0",
            "&:last-of-type": {
                flex: "initial",
                "& [data-part=separator]": {
                    display: "none"
                }
            },
            "&[data-orientation=horizontal]": {
                alignItems: "center"
            },
            "&[data-orientation=vertical]": {
                alignItems: "flex-start"
            }
        },
        trigger: {
            display: "flex",
            alignItems: "center",
            gap: "3",
            textAlign: "start"
        },
        indicator: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: "0",
            borderRadius: "full",
            fontWeight: "semibold",
            width: "var(--stepper-size)",
            height: "var(--stepper-size)",
            fontSize: "var(--stepper-font-size)",
            "& svg": {
                flexShrink: "0",
                width: "var(--stepper-icon-size)",
                height: "var(--stepper-icon-size)"
            }
        },
        title: {
            fontWeight: "semibold",
            color: "fg",
            fontSize: "var(--stepper-title-size)"
        },
        description: {
            color: "fg.medium",
            fontSize: "sm"
        },
        separator: {
            bg: "{colors.border}",
            flex: "1",
            transition: "background-color 0.2s {easings.default}",
            "&[data-complete]": {
                bg: "var(--stepper-color)"
            },
            "&[data-orientation=horizontal]": {
                width: "100%",
                height: "var(--stepper-thickness)",
                marginX: "var(--stepper-gutter)"
            },
            "&[data-orientation=vertical]": {
                position: "absolute",
                width: "var(--stepper-thickness)",
                height: "100%",
                maxHeight: "calc(100% - var(--stepper-size) - var(--stepper-gutter) * 2)",
                top: "calc(var(--stepper-size) + var(--stepper-gutter))",
                insetStart: "calc(var(--stepper-size) / 2 - 1px)"
            }
        },
        content: {
            _hidden: {
                display: "none"
            }
        },
        completedContent: {},
        nextTrigger: {},
        prevTrigger: {}
    },
    variants: {
        variant: {
            solid: {
                indicator: {
                    "&[data-incomplete]": {
                        borderWidth: "var(--stepper-thickness)",
                        borderStyle: "solid",
                        borderColor: "{colors.border}",
                        color: "fg.medium"
                    },
                    "&[data-current]": {
                        borderWidth: "var(--stepper-thickness)",
                        borderStyle: "solid",
                        borderColor: "var(--stepper-color)",
                        bg: "var(--stepper-color)/10",
                        color: "var(--stepper-color)"
                    },
                    "&[data-complete]": {
                        bg: "var(--stepper-color)",
                        color: "var(--stepper-color-fg)"
                    }
                }
            },
            subtle: {
                indicator: {
                    "&[data-incomplete]": {
                        bg: "{colors.alpha.100}",
                        color: "fg.medium"
                    },
                    "&[data-current]": {
                        bg: "var(--stepper-color)/15",
                        color: "var(--stepper-color)"
                    },
                    "&[data-complete]": {
                        bg: "var(--stepper-color)",
                        color: "var(--stepper-color-fg)"
                    }
                }
            }
        },
        scheme: getColorSchemes("--stepper-color", undefined, "root", true),
        size: {
            sm: {
                root: {
                    gap: "2.5",
                    "--stepper-size": "{sizes.7}",
                    "--stepper-icon-size": "{sizes.3.5}",
                    "--stepper-font-size": "{fontSizes.xs}",
                    "--stepper-title-size": "{fontSizes.sm}"
                },
                list: {
                    fontSize: "xs"
                }
            },
            md: {
                root: {
                    gap: "4",
                    "--stepper-size": "{sizes.9}",
                    "--stepper-icon-size": "{sizes.4}",
                    "--stepper-font-size": "{fontSizes.sm}",
                    "--stepper-title-size": "{fontSizes.sm}"
                },
                list: {
                    fontSize: "sm"
                }
            },
            lg: {
                root: {
                    gap: "6",
                    "--stepper-size": "{sizes.11}",
                    "--stepper-icon-size": "{sizes.5}",
                    "--stepper-font-size": "{fontSizes.md}",
                    "--stepper-title-size": "{fontSizes.md}"
                },
                list: {
                    fontSize: "md"
                }
            }
        }
    },
    defaultVariants: {
        size: "md",
        variant: "solid",
        scheme: "primary"
    }
});
