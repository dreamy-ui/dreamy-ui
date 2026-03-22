import { defineSlotRecipe } from "@pandacss/dev";

export const tabs = defineSlotRecipe({
    className: "tabs",
    description: "Dreamy UI Tabs component",
    jsx: ["Tabs.Root", "Tabs.List", "Tabs.Tab", "Tabs.Panels", "Tabs.Panel"],
    slots: ["root", "tabList", "tab", "tabPanels", "tabPanel", "tabIndicator"],
    base: {
        root: {
            display: "flex"
        },
        tabList: {
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            height: "fit",
            gap: 2,
            alignItems: "center",
            flexWrap: "nowrap",
            _scrollbar: {
                display: "none"
            },
            overflowX: "clip",
            overflowClipMargin: "10px",
            overflowY: "visible",
            position: "relative"
        },
        tab: {
            zIndex: 0,
            minWidth: 20,
            borderRadius: "none",
            WebkitTapHighlightColor: "transparent",
            "&[data-unselected=true]": {
                opacity: 1
            }
        },
        tabPanels: {},
        tabPanel: {},
        tabIndicator: {
            position: "absolute",
            left: 0,
            right: 0
        }
    },
    variants: {
        variant: {
            filled: {
                tabList: {
                    width: "fit-content",
                    padding: 1,
                    borderRadius: "l3",
                    backgroundColor: "{colors.alpha.100}"
                },
                tab: {
                    borderRadius: "l2",
                    _hover: {
                        backgroundColor: "alpha.50!"
                    }
                },
                tabIndicator: {
                    backgroundColor: { _dark: "alpha.100", _light: "bg" },
                    top: 0,
                    bottom: 0,
                    zIndex: -1
                }
            },
            underline: {
                tabList: {
                    width: "100%",
                    borderBottomWidth: 1,
                    borderStyle: "solid",
                    borderColor: "{colors.border}"
                },
                tabIndicator: {
                    backgroundColor: "{colors.primary}",
                    height: "2px",
                    bottom: "-1px",
                    zIndex: 1
                },
                tab: {
                    overflow: "visible",
                    color: "{colors.fg.medium}",
                    _hover: {
                        background: "transparent !important",
                        color: "{colors.fg.max}"
                    },
                    _selected: {
                        color: "{colors.fg}"
                    }
                }
            },
            "filled-simple": {
                tab: {
                    borderRadius: "l2"
                },
                tabList: {
                    width: "fit-content"
                },
                tabIndicator: {
                    backgroundColor: "{colors.alpha.100}",
                    top: 0,
                    bottom: 0
                }
            }
        },
        fitted: {
            true: {
                tabList: {
                    width: "100%"
                },
                tab: {
                    flex: 1
                }
            }
        },
        size: {
            sm: {
                tab: {
                    paddingInline: 3,
                    paddingBlock: 0.5,
                    fontSize: "sm"
                },
                tabPanel: {
                    paddingTop: 2
                }
            },
            md: {
                tab: {
                    paddingInline: 4,
                    paddingBlock: 1,
                    fontSize: "md"
                },
                tabPanel: {
                    paddingTop: 3
                }
            },
            lg: {
                tab: {
                    paddingInline: 5,
                    paddingBlock: 1.5,
                    fontSize: "lg"
                },
                tabPanel: {
                    paddingTop: 4
                }
            }
        },
        orientation: {
            vertical: {
                root: {
                    width: "fit-content",
                    flexDirection: "row"
                },
                tabList: {
                    flexDirection: "column"
                }
            },
            horizontal: {
                root: {
                    width: "100%",
                    flexDirection: "column"
                },
                tabList: {
                    flexDirection: "row"
                }
            }
        }
    },
    defaultVariants: {
        variant: "filled",
        orientation: "horizontal",
        size: "md"
    },
    compoundVariants: [
        {
            orientation: "vertical",
            variant: "underline",
            css: {
                tabList: {
                    width: "fit-content",
                    overflow: "visible",
                    borderBottomWidth: 0,
                    borderRightWidth: "1px"
                },
                tab: {
                    width: "100%",
                    justifyContent: "flex-start"
                },
                tabIndicator: {
                    left: "auto",
                    height: "100%",
                    right: "-1px",
                    top: 0,
                    width: "2px"
                }
            }
        }
    ]
});
