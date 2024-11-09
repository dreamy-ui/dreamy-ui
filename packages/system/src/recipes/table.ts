import { defineSlotRecipe } from "@pandacss/dev";
import { getColorSchemes } from "./color-scheme";

export const table = defineSlotRecipe({
    className: "dream-table",
    slots: ["wrapper", "root", "body", "header", "row", "cell", "columnHeader", "caption"],
    jsx: [
        "Wrapper",
        "Table",
        "TableHeader",
        "TableBody",
        "TableRow",
        "TableCell",
        "TableColumnHeader",
        "TableCaption"
    ],
    base: {
        wrapper: {
            overflowX: "auto",
            width: "auto",
            maxWidth: "full"
        },
        root: {
            fontVariantNumeric: "lining-nums tabular-nums",
            borderCollapse: "collapse",
            width: "full",
            textAlign: "start",
            verticalAlign: "top"
        },
        row: {
            _selected: {
                bg: "colorPalette.subtle"
            }
        },
        cell: {
            textAlign: "start",
            alignItems: "center"
        },
        columnHeader: {
            fontWeight: "semibold",
            textAlign: "start",
            color: "fg.medium",
            textTransform: "uppercase"
        },
        caption: {
            fontWeight: "medium",
            textStyle: "xs"
        }
    },
    variants: {
        interactive: {
            true: {
                row: {
                    _hover: {
                        bg: "alpha.50"
                    }
                }
            }
        },
        striped: {
            true: {
                row: {
                    "&:nth-of-type(even) td": {
                        bg: "alpha.50"
                    }
                }
            }
        },
        showColumnBorder: {
            true: {
                columnHeader: {
                    "&:not(:last-of-type)": {
                        borderInlineEndWidth: "1px",
                        borderColor: "border.muted"
                    }
                },
                cell: {
                    "&:not(:last-of-type)": {
                        borderInlineEndWidth: "1px",
                        borderColor: "border.muted"
                    }
                }
            }
        },
        withBackground: {
            true: {
                wrapper: {
                    bg: "alpha.50"
                }
            }
        },
        variant: {
            simple: {
                columnHeader: {
                    bg: "alpha.50",
                    _first: {
                        borderStartStartRadius: "l2",
                        borderEndStartRadius: "l2"
                    },
                    _last: {
                        borderEndEndRadius: "l2",
                        borderStartEndRadius: "l2"
                    }
                }
            },
            line: {
                columnHeader: {
                    borderBottomWidth: "1px",
                    borderColor: "border.muted"
                },
                cell: {
                    borderBottomWidth: "1px",
                    borderColor: "border.muted"
                }
            }
        },
        size: {
            sm: {
                wrapper: {
                    rounded: "l1"
                },
                root: {
                    textStyle: "sm"
                },
                columnHeader: {
                    px: "1.5",
                    py: "1",
                    textStyle: "xs"
                },
                cell: {
                    px: "1.5",
                    py: "1",
                    textStyle: "xs"
                },
                caption: {
                    marginBlock: "1.5"
                }
            },
            md: {
                wrapper: {
                    rounded: "l2"
                },
                root: {
                    textStyle: "sm"
                },
                columnHeader: {
                    px: "2.5",
                    py: "2",
                    textStyle: "sm"
                },
                cell: {
                    px: "2.5",
                    py: "2",
                    textStyle: "sm"
                },
                caption: {
                    marginBlock: "2"
                }
            },
            lg: {
                wrapper: {
                    rounded: "l3"
                },
                root: {
                    textStyle: "md"
                },
                columnHeader: {
                    px: "4",
                    py: "3",
                    textStyle: "md"
                },
                cell: {
                    px: "4",
                    py: "3",
                    textStyle: "md"
                },
                caption: {
                    marginBlock: "2.5"
                }
            }
        },
        scheme: getColorSchemes("--table-bg", undefined, "root")
    },
    defaultVariants: {
        variant: "simple",
        size: "md"
    },
    compoundVariants: [
        {
            withBackground: true,
            size: "sm",
            css: {
                wrapper: {
                    p: 2
                }
            }
        },
        {
            withBackground: true,
            size: "md",
            css: {
                wrapper: { p: 3 }
            }
        },
        {
            withBackground: true,
            size: "lg",
            css: {
                wrapper: { p: 4 }
            }
        },
        {
            variant: "simple",
            striped: true,
            css: {
                cell: {
                    _first: {
                        borderStartStartRadius: "l2",
                        borderEndStartRadius: "l2"
                    },
                    _last: {
                        borderEndEndRadius: "l2",
                        borderStartEndRadius: "l2"
                    }
                }
            }
        }
    ]
});
