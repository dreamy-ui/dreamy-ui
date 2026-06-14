import { defineSlotRecipe } from "@pandacss/dev";

export const fieldset = defineSlotRecipe({
    className: "fieldset",
    description: "Dreamy UI Fieldset component",
    slots: ["root", "legend", "helperText", "errorText", "header", "content", "footer"],
    jsx: [
        "Fieldset.Root",
        "Fieldset.Legend",
        "Fieldset.HelperText",
        "Fieldset.ErrorText",
        "Fieldset.Header",
        "Fieldset.Content",
        "Fieldset.Footer"
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            width: "full",
            borderWidth: "0"
        },
        header: {
            display: "flex",
            flexDirection: "column",
            width: "full",
            _notFirst: {
                marginTop: 4
            }
        },
        content: {
            display: "flex",
            flexDirection: "column",
            width: "full",
            _notFirst: {
                marginTop: 4
            }
        },
        footer: {
            display: "flex",
            flexDirection: "column",
            width: "full",
            _notFirst: {
                marginTop: 4
            }
        },
        legend: {
            color: "fg",
            fontWeight: "medium",
            _disabled: {
                opacity: 0.5
            }
        },
        helperText: {
            color: "fg.medium",
            textStyle: "sm"
        },
        errorText: {
            display: "inline-flex",
            alignItems: "center",
            color: "{colors.error}",
            gap: 2,
            fontWeight: "medium",
            textStyle: "sm"
        }
    },
    variants: {
        size: {
            sm: {
                header: {
                    _notFirst: {
                        marginTop: 2
                    }
                },
                content: {
                    gap: 3,
                    _notFirst: {
                        marginTop: 2
                    }
                },
                footer: {
                    gap: 1.5,
                    _notFirst: {
                        marginTop: 2
                    }
                },
                legend: {
                    textStyle: "sm"
                }
            },
            md: {
                header: {
                    _notFirst: {
                        marginTop: 4
                    }
                },
                content: {
                    gap: 4,
                    _notFirst: {
                        marginTop: 4
                    }
                },
                footer: {
                    gap: 2,
                    _notFirst: {
                        marginTop: 4
                    }
                },
                legend: {
                    textStyle: "sm"
                }
            },
            lg: {
                header: {
                    _notFirst: {
                        marginTop: 6
                    }
                },
                content: {
                    gap: 5,
                    _notFirst: {
                        marginTop: 6
                    }
                },
                footer: {
                    gap: 4,
                    _notFirst: {
                        marginTop: 6
                    }
                },
                legend: {
                    textStyle: "md"
                }
            }
        }
    },
    defaultVariants: {
        size: "md"
    }
});
