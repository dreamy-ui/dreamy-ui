import { defineSlotRecipe } from "@pandacss/dev";

export const card = defineSlotRecipe({
    className: "card",
    description: "Dreamy UI Card component",
    slots: ["root", "header", "body", "footer", "title", "description"],
    jsx: ["Card.Root", "Card.Header", "Card.Body", "Card.Footer", "Card.Title", "Card.Description"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            position: "relative",
            minWidth: "0",
            wordWrap: "break-word",
            borderRadius: "l3",
            color: "fg",
            textAlign: "start"
        },
        title: {
            fontWeight: "semibold"
        },
        description: {
            color: "fg.medium",
            fontSize: "sm"
        },
        header: {
            paddingInline: "var(--card-padding)",
            paddingTop: "var(--card-padding)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5"
        },
        body: {
            padding: "var(--card-padding)",
            flex: "1",
            display: "flex",
            gap: 2,
            flexDirection: "column"
        },
        footer: {
            display: "flex",
            alignItems: "center",
            gap: "2",
            paddingInline: "var(--card-padding)",
            paddingBottom: "var(--card-padding)"
        }
    },
    variants: {
        size: {
            sm: {
                root: {
                    "--card-padding": "spacing.4"
                },
                title: {
                    textStyle: "md"
                }
            },
            md: {
                root: {
                    "--card-padding": "spacing.6"
                },
                title: {
                    textStyle: "lg"
                }
            },
            lg: {
                root: {
                    "--card-padding": "spacing.7"
                },
                title: {
                    textStyle: "xl"
                }
            }
        },

        variant: {
            elevated: {
                root: {
                    bg: "bg.panel",
                    boxShadow: "md"
                }
            },
            outline: {
                root: {
                    bg: "bg.panel",
                    borderWidth: "1px",
                    borderColor: "border"
                }
            }
        }
    },
    defaultVariants: {
        variant: "outline",
        size: "md"
    }
});
