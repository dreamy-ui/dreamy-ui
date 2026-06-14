import { mapJsx } from "@dreamy-ui/panda-preset";
import { defineSlotRecipe } from "@pandacss/dev";

export const datePicker = defineSlotRecipe({
    className: "date-picker",
    description: "Dreamy UI Date Picker component",
    slots: [
        "root",
        "trigger",
        "control",
        "nav",
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
    jsx: mapJsx("DatePicker", [
        "Root",
        "Trigger",
        "Control",
        "Nav",
        "Popover",
        "Calendar",
        "CalendarHeader",
        "CalendarTitle",
        "CalendarNav",
        "CalendarNavButton",
        "CalendarGrid",
        "CalendarGridHeader",
        "CalendarGridHeaderCell",
        "CalendarGridBody",
        "CalendarCell",
        "CalendarCellButton",
        "Footer",
        "FooterButton"
    ]),
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: 2
        },
        trigger: {
            width: "full"
        },
        control: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            width: "full",
            "& > input": {
                width: "full"
            }
        },
        nav: {
            display: "flex",
            flexDirection: "row",
            gap: 1,
            w: "full"
        },
        calendar: {
            display: "flex",
            flexDirection: "column",
            gap: 4
        },
        calendarHeader: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            w: "full",
            gap: 2
        },
        calendarTitle: {
            fontSize: "sm",
            fontWeight: "medium",
            color: "fg.medium"
        },
        calendarNav: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            w: "full",
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
            textAlign: "center",
            fontSize: "xs",
            fontWeight: "medium",
            width: "full",
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
            borderRadius: "full",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "transparent",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: "sm",
            padding: 0,
            minWidth: 0,
            transition: "all",
            isolation: "isolate",
            transitionDuration: "fast",
            _hover: {
                backgroundColor: "alpha.100"
            },
            _disabled: {
                opacity: 0.4,
                cursor: "not-allowed"
            },
            "&[data-selected]": {
                // backgroundColor: "primary!",
                color: "primary.fg!",
                // borderColor: "primary!",
                // scale: "0.95",
                // transition: "scale {durations.fast} {easings.ease-in-out}",
                _hover: {
                    backgroundColor: "primary.hover!",
                    borderColor: "primary.hover!"
                }
            },
            "&[data-today]": {
                borderColor: "alpha.100",
                backgroundColor: "alpha.100",
                color: "fg"
                // fontWeight: "semibold"
            },
            "&[data-outside-month]": {
                opacity: 0.4
            },
            "& [data-part='indicator']": {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "primary",
                borderRadius: "full",
                zIndex: -1
            }
        },
        footer: {
            w: "full",
            display: "flex",
            alignItems: "center",
            justifyContent: "stretch",
            gap: 2,
            borderTopWidth: "1px",
            borderTopStyle: "solid",
            borderTopColor: "border"
        },
        footerButton: {
            w: "full"
        }
    },
    variants: {
        size: {
            sm: {
                popover: {
                    width: "2xs!"
                },
                calendarHeader: {
                    pt: 3,
                    px: 3
                },
                nav: {
                    px: 3
                },
                calendar: {
                    px: 3,
                    "&[data-no-footer]": {
                        pb: 3
                    }
                },
                calendarTitle: {
                    fontSize: "sm"
                },
                calendarCellButton: {
                    fontSize: "xs"
                },
                footer: {
                    p: 3
                },
                control: {
                    px: 3
                }
            },
            md: {
                popover: {
                    width: "xs!"
                },
                calendarHeader: {
                    pt: 4,
                    px: 4
                },
                nav: {
                    px: 4
                },
                calendar: {
                    px: 4,
                    "&[data-no-footer]": {
                        pb: 4
                    }
                },
                calendarTitle: {
                    fontSize: "md"
                },
                calendarCellButton: {
                    fontSize: "sm"
                },
                footer: {
                    p: 4
                },
                control: {
                    px: 4
                }
            },
            lg: {
                popover: {
                    width: "sm!"
                },
                calendarHeader: {
                    pt: 5,
                    px: 5
                },
                nav: {
                    px: 5
                },
                calendar: {
                    px: 5,
                    "&[data-no-footer]": {
                        pb: 5
                    }
                },
                calendarTitle: {
                    fontSize: "lg"
                },
                calendarCellButton: {
                    fontSize: "md"
                },
                footer: {
                    p: 5
                },
                control: {
                    px: 5
                }
            }
        }
    },
    defaultVariants: {
        size: "md"
    }
});
