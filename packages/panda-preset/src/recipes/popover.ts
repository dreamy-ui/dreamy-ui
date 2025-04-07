import { defineSlotRecipe } from "@pandacss/dev";

export const popover = defineSlotRecipe({
    className: "dreamy-popover",
    description: "Dreamy UI Popover component",
    slots: ["content", "body", "header", "footer", "close"],
    jsx: [
        "Popover",
        "PopoverContent",
        "PopoverBody",
        "PopoverHeader",
        "PopoverFooter",
        "PopoverCloseButton",
        // menu
        "Menu",
        "MenuTrigger",
        "MenuContent",
        "MenuItem"
    ],
    base: {
        content: {
            "--popper-z-index": "{zIndex.popover}",
            maxW: "100vw",
            "--popper-arrow-bg": "{colors.bg.panel}",
            "& [data-popper-arrow-inner]": {
                backdropFilter: "blur({blurs.base})"
            },
            display: "flex",
            flexDirection: "column",
            position: "relative",
            backgroundColor: "bg.panel",
            backdropFilter: "blur({blurs.base})",
            boxShadow: "sm",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "{colors.border}",
            gap: 2
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            p: "var(--popover-padding)"
        },
        body: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            px: "var(--popover-padding)"
        },
        footer: {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            gap: 2,
            p: "var(--popover-padding)"
        },
        close: {
            position: "absolute",
            top: 1,
            insetInlineEnd: 2
        }
    },
    variants: {
        size: {
            sm: {
                content: {
                    "--popover-padding": "spacing.3",
                    width: "sm",
                    borderRadius: "p-3"
                }
            },
            md: {
                content: {
                    "--popover-padding": "spacing.4",
                    width: "md",
                    borderRadius: "p-4"
                }
            },
            lg: {
                content: {
                    "--popover-padding": "spacing.5",
                    width: "lg",
                    borderRadius: "p-5"
                }
            },
            xl: {
                content: {
                    "--popover-padding": "spacing.6",
                    width: "xl",
                    borderRadius: "p-6"
                }
            },
            "2xl": {
                content: {
                    "--popover-padding": "spacing.7",
                    width: "2xl",
                    borderRadius: "p-6"
                }
            },
            "3xl": {
                content: {
                    "--popover-padding": "spacing.8",
                    width: "3xl",
                    borderRadius: "p-6"
                }
            },
            "4xl": {
                content: {
                    "--popover-padding": "spacing.9",
                    width: "4xl",
                    borderRadius: "p-6"
                }
            },
            "5xl": {
                content: {
                    "--popover-padding": "spacing.10",
                    width: "5xl",
                    borderRadius: "p-6"
                }
            },
            "6xl": {
                content: {
                    "--popover-padding": "spacing.10",
                    width: "6xl",
                    borderRadius: "p-6"
                }
            },
            "7xl": {
                content: {
                    "--popover-padding": "spacing.10",
                    width: "7xl",
                    borderRadius: "p-6"
                }
            },
            "8xl": {
                content: {
                    "--popover-padding": "spacing.10",
                    width: "8xl",
                    borderRadius: "p-6"
                }
            }
        }
    },
    defaultVariants: {
        size: "md"
    }
});
