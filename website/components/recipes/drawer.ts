import { defineSlotRecipe } from "@pandacss/dev";

export const drawer = defineSlotRecipe({
    className: "drawer",
    description:
        "A slide-over panel anchored to a viewport edge with overlay, header, body, footer, and close button. variant inset floats the panel with spacing and rounding; variant simple is flush to the viewport — placement sets the edge, size sets the panel width or height.",
    slots: ["overlay", "container", "content", "body", "header", "footer", "close"],
    jsx: [
        "Drawer.Root",
        "Drawer.Overlay",
        "Drawer.Content",
        "Drawer.Body",
        "Drawer.Header",
        "Drawer.Footer",
        "Drawer.CloseButton"
    ],
    base: {
        overlay: {
            zIndex: "overlay",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur({blurs.sm})"
        },
        container: {
            zIndex: "modal",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100dvw",
            display: "flex"
        },
        content: {
            display: "flex",
            flexDirection: "column",
            position: "relative",
            backgroundColor: "bg.panel",
            backdropFilter: "blur({blurs.base})",
            boxShadow: "md",
            overflow: "hidden"
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingTop: 4,
            paddingBottom: 2,
            paddingX: 4,
            flexShrink: 0
        },
        body: {
            flex: 1,
            flexDirection: "column",
            display: "flex",
            gap: 4,
            paddingX: 4,
            paddingY: 2,
            minHeight: 0
        },
        footer: {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            gap: 2,
            paddingX: 4,
            paddingTop: 2,
            paddingBottom: 4,
            flexShrink: 0
        },
        close: {
            position: "absolute",
            top: 2,
            right: 2
        }
    },
    variants: {
        variant: {
            simple: {
                container: {
                    padding: 0
                },
                content: {
                    borderRadius: "none"
                }
            },
            inset: {
                container: {
                    padding: 4
                },
                content: {
                    borderRadius: "p-4"
                }
            }
        },
        placement: {
            right: {
                container: {
                    justifyContent: "flex-end",
                    alignItems: "stretch"
                },
                content: {
                    width: "100%"
                }
            },
            left: {
                container: {
                    justifyContent: "flex-start",
                    alignItems: "stretch"
                },
                content: {
                    width: "100%"
                }
            },
            top: {
                container: {
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                    flexDirection: "column"
                },
                content: {
                    width: "100%",
                    maxWidth: "100%"
                }
            },
            bottom: {
                container: {
                    justifyContent: "flex-end",
                    alignItems: "stretch",
                    flexDirection: "column"
                },
                content: {
                    width: "100%",
                    maxWidth: "100%"
                }
            }
        },
        size: {
            xs: {
                content: {
                    maxWidth: "xs"
                }
            },
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
        }
    },
    compoundVariants: [
        {
            placement: "top",
            size: "xs",
            css: { content: { maxWidth: "100%", maxHeight: "xs" } }
        },
        {
            placement: "top",
            size: "sm",
            css: { content: { maxWidth: "100%", maxHeight: "sm" } }
        },
        {
            placement: "top",
            size: "md",
            css: { content: { maxWidth: "100%", maxHeight: "md" } }
        },
        {
            placement: "top",
            size: "lg",
            css: { content: { maxWidth: "100%", maxHeight: "lg" } }
        },
        {
            placement: "top",
            size: "xl",
            css: { content: { maxWidth: "100%", maxHeight: "xl" } }
        },
        {
            placement: "top",
            size: "2xl",
            css: { content: { maxWidth: "100%", maxHeight: "2xl" } }
        },
        {
            placement: "top",
            size: "3xl",
            css: { content: { maxWidth: "100%", maxHeight: "3xl" } }
        },
        {
            placement: "top",
            size: "4xl",
            css: { content: { maxWidth: "100%", maxHeight: "4xl" } }
        },
        {
            placement: "top",
            size: "5xl",
            css: { content: { maxWidth: "100%", maxHeight: "5xl" } }
        },
        {
            placement: "top",
            size: "6xl",
            css: { content: { maxWidth: "100%", maxHeight: "6xl" } }
        },
        {
            placement: "top",
            size: "7xl",
            css: { content: { maxWidth: "100%", maxHeight: "7xl" } }
        },
        {
            placement: "top",
            size: "8xl",
            css: { content: { maxWidth: "100%", maxHeight: "8xl" } }
        },
        {
            placement: "top",
            size: "full",
            css: { content: { maxWidth: "100%", maxHeight: "100%" } }
        },
        {
            placement: "bottom",
            size: "xs",
            css: { content: { maxWidth: "100%", maxHeight: "xs" } }
        },
        {
            placement: "bottom",
            size: "sm",
            css: { content: { maxWidth: "100%", maxHeight: "sm" } }
        },
        {
            placement: "bottom",
            size: "md",
            css: { content: { maxWidth: "100%", maxHeight: "md" } }
        },
        {
            placement: "bottom",
            size: "lg",
            css: { content: { maxWidth: "100%", maxHeight: "lg" } }
        },
        {
            placement: "bottom",
            size: "xl",
            css: { content: { maxWidth: "100%", maxHeight: "xl" } }
        },
        {
            placement: "bottom",
            size: "2xl",
            css: { content: { maxWidth: "100%", maxHeight: "2xl" } }
        },
        {
            placement: "bottom",
            size: "3xl",
            css: { content: { maxWidth: "100%", maxHeight: "3xl" } }
        },
        {
            placement: "bottom",
            size: "4xl",
            css: { content: { maxWidth: "100%", maxHeight: "4xl" } }
        },
        {
            placement: "bottom",
            size: "5xl",
            css: { content: { maxWidth: "100%", maxHeight: "5xl" } }
        },
        {
            placement: "bottom",
            size: "6xl",
            css: { content: { maxWidth: "100%", maxHeight: "6xl" } }
        },
        {
            placement: "bottom",
            size: "7xl",
            css: { content: { maxWidth: "100%", maxHeight: "7xl" } }
        },
        {
            placement: "bottom",
            size: "8xl",
            css: { content: { maxWidth: "100%", maxHeight: "8xl" } }
        },
        {
            placement: "bottom",
            size: "full",
            css: { content: { maxWidth: "100%", maxHeight: "100%" } }
        }
    ],
    defaultVariants: {
        variant: "inset",
        placement: "right",
        size: "md"
    }
});
