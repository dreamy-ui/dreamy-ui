import { defineSlotRecipe } from "@pandacss/dev";

export const hoverCard = defineSlotRecipe({
    className: "hover-card",
    description:
        "A hover-triggered preview panel for rich contextual content like user profiles or link previews. Panel uses bg.panel, blur, border, and shadow with optional header, body, and footer — only size changes dimensions and padding.",
    slots: ["content", "header", "body", "footer", "arrow"],
    jsx: [
        "HoverCard.Root",
        "HoverCard.Content",
        "HoverCard.Header",
        "HoverCard.Body",
        "HoverCard.Footer",
        "HoverCard.Trigger",
        "HoverCard.Arrow"
    ],
    base: {
        content: {
            "--popper-z-index": "{zIndex.popover}",
            "--arrow-size": "8px",
            "--arrow-background": "{colors.bg.panel}",
            maxW: "100vw",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "visible",
            backgroundColor: "bg.panel",
            backdropFilter: "blur({blurs.base})",
            boxShadow: "sm",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "{colors.border}",
            gap: 0,
            transformOrigin: "var(--transform-origin, center)"
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            p: "var(--hover-card-padding)"
        },
        body: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: "var(--hover-card-padding)"
        },
        footer: {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            gap: 2,
            p: "var(--hover-card-padding)"
        },
        arrow: {
            "--arrow-size": "8px",
            "--arrow-background": "{colors.bg.panel}",
            width: "var(--arrow-size)",
            height: "var(--arrow-size)",
            background: "var(--arrow-background)",
            borderStyle: "solid",
            borderColor: "border",
            borderWidth: "0",
            boxSizing: "border-box",
            rotate: "45deg",
            pointerEvents: "none",
            "&[data-side='bottom']": {
                top: "calc(var(--arrow-size) / -2)",
                borderTopWidth: "1px",
                borderLeftWidth: "1px"
            },
            "&[data-side='top']": {
                bottom: "calc(var(--arrow-size) / -2)",
                borderBottomWidth: "1px",
                borderRightWidth: "1px"
            },
            "&[data-side='left']": {
                right: "calc(var(--arrow-size) / -2)",
                borderTopWidth: "1px",
                borderRightWidth: "1px"
            },
            "&[data-side='right']": {
                left: "calc(var(--arrow-size) / -2)",
                borderBottomWidth: "1px",
                borderLeftWidth: "1px"
            }
        }
    },
    variants: {
        size: {
            sm: {
                content: {
                    "--hover-card-padding": "spacing.3",
                    width: "xs",
                    borderRadius: "p-3"
                }
            },
            md: {
                content: {
                    "--hover-card-padding": "spacing.4",
                    width: "sm",
                    borderRadius: "p-4"
                }
            },
            lg: {
                content: {
                    "--hover-card-padding": "spacing.5",
                    width: "md",
                    borderRadius: "p-5"
                }
            }
        }
    },
    defaultVariants: {
        size: "md"
    }
});
