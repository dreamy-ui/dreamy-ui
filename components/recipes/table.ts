import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineSlotRecipe } from "@pandacss/dev";

export const table = defineSlotRecipe({
    className: "table",
    slots: ["root", "table", "body", "header", "row", "cell", "columnHeader", "caption"],
    jsx: [
        "Table.Root",
        "Table.Table",
        "Table.Header",
        "Table.Body",
        "Table.Row",
        "Table.Cell",
        "Table.ColumnHeader",
        "Table.Caption"
    ],
    base: {
        root: {
            overflowX: "auto",
            width: "auto",
            maxWidth: "full"
        },
        table: {
            fontVariantNumeric: "lining-nums tabular-nums",
            borderCollapse: "collapse",
            width: "full",
            textAlign: "start",
            verticalAlign: "top"
        },
        row: {
            _selected: {
                bg: "alpha.50"
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
                        borderColor: "border"
                    }
                },
                cell: {
                    "&:not(:last-of-type)": {
                        borderInlineEndWidth: "1px",
                        borderColor: "border"
                    }
                }
            }
        },
        withBackground: {
            true: {
                root: {
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
                    borderColor: "border"
                },
                cell: {
                    borderBottomWidth: "1px",
                    borderColor: "border"
                }
            }
        },
        size: {
            sm: {
                root: {
                    rounded: "l1"
                },
                table: {
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
                root: {
                    rounded: "l2"
                },
                table: {
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
                root: {
                    rounded: "l3"
                },
                table: {
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
                root: {
                    p: 2
                }
            }
        },
        {
            withBackground: true,
            size: "md",
            css: {
                root: { p: 3 }
            }
        },
        {
            withBackground: true,
            size: "lg",
            css: {
                root: { p: 4 }
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
