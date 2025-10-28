import { defineSlotRecipe } from "@pandacss/dev";

export const actionBar = defineSlotRecipe({
    className: "action-bar",
    description: "Dreamy UI Action Bar component",
    slots: ["root", "content", "selectionTrigger", "separator", "closeTrigger"],
    jsx: [
        "ActionBar.Root",
        "ActionBar.Content",
        "ActionBar.SelectionTrigger",
        "ActionBar.Separator",
        "ActionBar.CloseTrigger"
    ],
    base: {
        root: {
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: "modal",
            display: "flex",
            justifyContent: "center",
            paddingX: 4,
            paddingBottom: 4
        },
        content: {
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: "bg",
            border: "1px solid",
            borderColor: "border",
            borderRadius: "l3",
            boxShadow: "2xl",
            paddingX: 4,
            paddingY: 3,
            maxWidth: "2xl",
            width: "100%",
            "& > button": {
                flexShrink: 0
            }
        },
        selectionTrigger: {
            fontSize: "sm",
            fontWeight: "medium",
            color: "fg.medium",
            display: "flex",
            alignItems: "center"
        },
        separator: {
            width: "1px",
            height: 6,
            backgroundColor: "border",
            marginX: 1
        },
        closeTrigger: {
            marginLeft: "auto",
            flexShrink: 0
        }
    },
    variants: {
        size: {
            sm: {
                content: {
                    paddingX: 3,
                    paddingY: 2,
                    gap: 1.5
                },
                selectionTrigger: {
                    fontSize: "xs"
                }
            },
            md: {
                content: {
                    paddingX: 4,
                    paddingY: 3,
                    gap: 2
                },
                selectionTrigger: {
                    fontSize: "sm"
                }
            },
            lg: {
                content: {
                    paddingX: 5,
                    paddingY: 4,
                    gap: 3
                },
                selectionTrigger: {
                    fontSize: "md"
                }
            }
        }
    },
    defaultVariants: {
        size: "md"
    }
});
