import { defineSlotRecipe } from "@pandacss/dev";

export const modal = defineSlotRecipe({
    className: "dreamy-modal",
    description: "Dreamy UI Modal component",
    slots: ["overlay", "container", "content", "body", "header", "footer", "close"],
    jsx: [
        "Modal",
        "ModalOverlay",
        "ModalContent",
        "ModalBody",
        "ModalHeader",
        "ModalFooter",
        "ModalCloseButton"
    ],
    base: {
        overlay: {
            zIndex: "overlay",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0, 0, 0, 0.4)"
        },
        container: {
            zIndex: "modal",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100dvw",
            display: "flex",
            justifyContent: "center"
        },
        content: {
            display: "flex",
            flexDirection: "column",
            position: "relative",
            width: "100%",
            borderRadius: "p-4",
            backgroundColor: "bg.panel",
            backdropFilter: "blur({blurs.base})",
            boxShadow: "md",
            marginTop: 16,
            marginBottom: 16,
            height: "fit-content"
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
            // it dissapers the scrollbar
            // "&::-webkit-scrollbar": {
            //     backgroundColor: "bg.panel",
            //     color: "fg"
            // }
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
                    container: {
                        marginTop: 24
                    }
                }
            },
            center: {
                container: {
                    alignItems: "center"
                }
            }
        }
    },
    defaultVariants: {
        size: "md",
        placement: "center"
    }
});
