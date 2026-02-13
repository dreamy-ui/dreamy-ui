import { defineSlotRecipe } from "@pandacss/dev";

export const datePicker = defineSlotRecipe({
    className: "date-picker",
    description: "Dreamy UI Date Picker component",
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
        "footer",
        "footerButton"
    ],
    jsx: [
        "DatePicker.Root",
        "DatePicker.Trigger",
        "DatePicker.Popover",
        "DatePicker.Calendar",
        "DatePicker.CalendarHeader",
        "DatePicker.CalendarTitle",
        "DatePicker.CalendarNav",
        "DatePicker.CalendarNavButton",
        "DatePicker.CalendarGrid",
        "DatePicker.CalendarGridHeader",
        "DatePicker.CalendarGridHeaderCell",
        "DatePicker.CalendarGridBody",
        "DatePicker.CalendarCell",
        "DatePicker.CalendarCellButton",
        "DatePicker.Footer",
        "DatePicker.FooterButton"
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
            width: "fit!"
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
            gap: 2
        },
        calendarNavButton: {
            color: "fg.medium"
        },
        calendarGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0
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
            width: "fit",
            color: "fg.medium",
            py: 2
        },
        calendarGridBody: {
            display: "contents"
        },
        calendarCell: {
            position: "relative",
            width: "full",
            paddingBottom: "100%"
        },
        calendarCellButton: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "full",
            height: "full",
            borderRadius: "l2",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "transparent",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: "sm",
            padding: 0,
            minWidth: 0,
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
            "&[data-today]": {
                borderColor: "primary",
                fontWeight: "semibold"
            },
            "&[data-outside-month]": {
                opacity: 0.4
            }
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
