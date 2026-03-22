import { defineSlotRecipe } from "@pandacss/dev";

export const hoverCard = defineSlotRecipe({
    className: "hover-card",
    description: "Dreamy UI HoverCard component",
    slots: ["content", "header", "body", "footer"],
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
            gap: 0
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
