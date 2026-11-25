import { defineSlotRecipe } from "@pandacss/dev";

export const modal = defineSlotRecipe({
    className: "modal",
    description:
        "A modal dialog with overlay scrim, header, body, footer, and close button for focused interactions. placement top positions content near the top of the viewport; placement center vertically centers the dialog — size sets maxWidth.",
    slots: ["overlay", "container", "content", "body", "header", "footer", "close"],
    jsx: [
        "Modal.Root",
        "Modal.Overlay",
        "Modal.Content",
        "Modal.Body",
        "Modal.Header",
        "Modal.Footer",
        "Modal.CloseButton"
    ],
    base: {
        overlay: {
            zIndex: "overlay",
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur({blurs.sm})"
        },
        container: {
            zIndex: "modal",
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center"
        },
        content: {
            zIndex: "modal",
            position: "fixed",
            inset: 0,
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            width: "calc(100% - 2rem)",
            borderRadius: "p-4",
            backgroundColor: "bg.panel",
            backdropFilter: "blur({blurs.base})",
            boxShadow: "md",
            height: "fit-content",
            maxHeight: "calc(100dvh - 2rem)",
            outline: "none",
            "&[data-scroll-behavior='outside']": {
                overflowY: "auto"
            }
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingTop: 4,
            paddingBottom: 2,
            paddingX: 4
        },
        body: {
            flex: 1,
            flexDirection: "column",
            display: "flex",
            gap: 4,
            paddingX: 4,
            paddingY: 2
        },
        footer: {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            gap: 2,
            paddingX: 4,
            paddingTop: 2,
            paddingBottom: 4
        },
        close: {
            position: "absolute",
            top: 2,
            right: 2
        }
    },
    variants: {
        size: {
            sm: {
                content: {
                    maxWidth: "sm"
                }
            },
            md: {
                content: {
                    maxWidth: "md"
                }
            },
            lg: {
                content: {
                    maxWidth: "lg"
                }
            },
            xl: {
                content: {
                    maxWidth: "xl"
                }
            },
            "2xl": {
                content: {
                    maxWidth: "2xl"
                }
            },
            "3xl": {
                content: {
                    maxWidth: "3xl"
                }
            },
            "4xl": {
                content: {
                    maxWidth: "4xl"
                }
            },
            "5xl": {
                content: {
                    maxWidth: "5xl"
                }
            },
            "6xl": {
                content: {
                    maxWidth: "6xl"
                }
            },
            "7xl": {
                content: {
                    maxWidth: "7xl"
                }
            },
            "8xl": {
                content: {
                    maxWidth: "8xl"
                }
            },
            full: {
                content: {
                    maxWidth: "100%"
                }
            }
        },
        placement: {
            top: {
                content: {
                    marginTop: 16,
                    marginBottom: "auto"
                }
            },
            center: {
                content: {
                    margin: "auto"
                }
            }
        }
    },
    defaultVariants: {
        size: "md",
        placement: "center"
    }
});
