import { defineSlotRecipe } from "@pandacss/dev";

export const dateRangePicker = defineSlotRecipe({
    className: "date-range-picker",
    description: "Dreamy UI Date Range Picker component",
    slots: [
        "root",
        "trigger",
        "popover",
        "calendar",
        "calendarHeader",
        "calendarTitle",
        "calendarNav",
        "calendarNavButton",
        "calendarGrid",
        "calendarGridHeader",
        "calendarGridHeaderCell",
        "calendarGridBody",
        "calendarCell",
        "calendarCellButton",
        "rangePreset",
        "rangePresetButton",
        "footer",
        "footerButton"
    ],
    jsx: [
        "DateRangePicker.Root",
        "DateRangePicker.Trigger",
        "DateRangePicker.Popover",
        "DateRangePicker.Calendar",
        "DateRangePicker.CalendarHeader",
        "DateRangePicker.CalendarTitle",
        "DateRangePicker.CalendarNav",
        "DateRangePicker.CalendarNavButton",
        "DateRangePicker.CalendarGrid",
        "DateRangePicker.CalendarGridHeader",
        "DateRangePicker.CalendarGridHeaderCell",
        "DateRangePicker.CalendarGridBody",
        "DateRangePicker.CalendarCell",
        "DateRangePicker.CalendarCellButton",
        "DateRangePicker.RangePreset",
        "DateRangePicker.RangePresetButton",
        "DateRangePicker.Footer",
        "DateRangePicker.FooterButton"
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: 2
        },
        trigger: {
            width: "full"
        },
        popover: {
            width: "fit-content"
        },
        calendar: {
            display: "flex",
            flexDirection: "column",
            gap: 4,
            p: 4
        },
        calendarHeader: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2
        },
        calendarTitle: {
            fontWeight: "semibold",
            fontSize: "md"
        },
        calendarNav: {
            display: "flex",
            alignItems: "center",
            gap: 1
        },
        calendarNavButton: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "l2",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "transparent",
            backgroundColor: "transparent",
            cursor: "pointer",
            transition: "all",
            transitionDuration: "normal",
            _hover: {
                backgroundColor: "alpha.100"
            },
            _disabled: {
                opacity: 0.4,
                cursor: "not-allowed"
            }
        },
        calendarGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1
        },
        calendarGridHeader: {
            display: "contents"
        },
        calendarGridHeaderCell: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "xs",
            fontWeight: "medium",
            color: "fg.muted",
            py: 2
        },
        calendarGridBody: {
            display: "contents"
        },
        calendarCell: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        calendarCellButton: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "full",
            aspectRatio: "1/1",
            borderRadius: "l2",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "transparent",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: "sm",
            transition: "all",
            transitionDuration: "normal",
            _hover: {
                backgroundColor: "alpha.100"
            },
            _disabled: {
                opacity: 0.4,
                cursor: "not-allowed"
            },
            "&[data-selected]": {
                backgroundColor: "primary",
                color: "primary.fg",
                borderColor: "primary",
                _hover: {
                    backgroundColor: "primary.hover",
                    borderColor: "primary.hover"
                }
            },
            "&[data-in-range]": {
                backgroundColor: "primary.subtle",
                color: "primary.fg"
            },
            "&[data-range-start]": {
                borderStartRadius: "l2",
                borderEndRadius: "none"
            },
            "&[data-range-end]": {
                borderStartRadius: "none",
                borderEndRadius: "l2"
            },
            "&[data-today]": {
                borderColor: "primary",
                fontWeight: "semibold"
            },
            "&[data-outside-month]": {
                opacity: 0.4
            }
        },
        rangePreset: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 4,
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
            borderBottomColor: "border"
        },
        rangePresetButton: {
            width: "full",
            justifyContent: "flex-start",
            textAlign: "left"
        },
        footer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 2,
            p: 4,
            borderTopWidth: "1px",
            borderTopStyle: "solid",
            borderTopColor: "border"
        },
        footerButton: {}
    },
    variants: {
        size: {
            sm: {
                calendar: {
                    p: 3
                },
                calendarTitle: {
                    fontSize: "sm"
                },
                calendarNavButton: {
                    width: 7,
                    height: 7
                },
                calendarCellButton: {
                    fontSize: "xs"
                },
                rangePreset: {
                    p: 3
                },
                footer: {
                    p: 3
                }
            },
            md: {
                calendar: {
                    p: 4
                },
                calendarTitle: {
                    fontSize: "md"
                },
                calendarNavButton: {
                    width: 8,
                    height: 8
                },
                calendarCellButton: {
                    fontSize: "sm"
                },
                rangePreset: {
                    p: 4
                },
                footer: {
                    p: 4
                }
            },
            lg: {
                calendar: {
                    p: 5
                },
                calendarTitle: {
                    fontSize: "lg"
                },
                calendarNavButton: {
                    width: 9,
                    height: 9
                },
                calendarCellButton: {
                    fontSize: "md"
                },
                rangePreset: {
                    p: 5
                },
                footer: {
                    p: 5
                }
            }
        }
    },
    defaultVariants: {
        size: "md"
    }
});
