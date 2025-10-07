import { defineSlotRecipe } from "@pandacss/dev";

export const breadcrumb = defineSlotRecipe({
    className: "breadcrumb",
    description: "Dreamy UI Breadcrumb component",
    slots: ["root", "list", "item", "link", "currentLink", "separator", "ellipsis"],
    jsx: [
        "Breadcrumb.Root",
        "Breadcrumb.List",
        "Breadcrumb.Item",
        "Breadcrumb.Link",
        "Breadcrumb.CurrentLink",
        "Breadcrumb.Separator",
        "Breadcrumb.Ellipsis"
    ],
    base: {
        root: {
            display: "flex",
            alignItems: "center",
            width: "100%",
            "aria-label": "Breadcrumb"
        },
        list: {
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            listStyle: "none",
            padding: "0",
            margin: "0",
            gap: "var(--breadcrumb-separator-gap)",
            role: "list"
        },
        item: {
            display: "flex",
            alignItems: "center",
            role: "listitem"
        },
        link: {
            textDecoration: "none",
            color: "fg.medium",
            fontWeight: "medium",
            fontSize: "var(--breadcrumb-font-size)",
            transition: "color 0.2s {easings.default}",
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--breadcrumb-separator-gap)",
            _hover: {
                color: "fg",
                textDecoration: "underline"
            },
            _focusVisible: {
                color: "fg",
                textDecoration: "underline",
                outline: "2px solid {colors.ring}",
                outlineOffset: "2px"
            }
        },
        currentLink: {
            color: "fg",
            fontWeight: "semibold",
            fontSize: "var(--breadcrumb-font-size)",
            cursor: "default"
        },
        separator: {
            color: "fg.disabled",
            fontSize: "var(--breadcrumb-font-size)",
            userSelect: "none",
            "& > svg": {
                width: "1em",
                height: "1em"
            }
        },
        ellipsis: {
            color: "fg.disabled",
            fontSize: "var(--breadcrumb-font-size)",
            userSelect: "none",
            cursor: "default",
            _hover: {
                color: "fg.medium"
            }
        }
    },
    variants: {
        size: {
            sm: {
                root: {
                    "--breadcrumb-font-size": "{fontSizes.sm}",
                    "--breadcrumb-separator-gap": "{spacing.1}"
                }
            },
            md: {
                root: {
                    "--breadcrumb-font-size": "{fontSizes.md}",
                    "--breadcrumb-separator-gap": "{spacing.2}"
                }
            },
            lg: {
                root: {
                    "--breadcrumb-font-size": "{fontSizes.lg}",
                    "--breadcrumb-separator-gap": "{spacing.2.5}"
                }
            }
        },
        variant: {
            plain: {
                link: {
                    _hover: {
                        textDecoration: "none"
                    },
                    _focusVisible: {
                        textDecoration: "none"
                    }
                }
            },
            underline: {
                link: {
                    _hover: {
                        textDecoration: "underline"
                    },
                    _focusVisible: {
                        textDecoration: "underline"
                    }
                }
            }
        }
    },
    defaultVariants: {
        size: "md",
        variant: "underline"
    }
});
