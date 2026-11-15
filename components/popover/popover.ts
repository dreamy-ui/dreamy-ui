import { mapJsx } from "@dreamy-ui/panda-preset";
import { defineSlotRecipe } from "@pandacss/dev";

export const popover = defineSlotRecipe({
    className: "popover",
    description:
        "A floating popover panel shared by Popover, Select, Menu, Autocomplete, DatePicker, and DateRangePicker with optional arrow. Uses panel background, blur, border, and shadow — only size changes width, padding, and border radius.",
    slots: ["content", "body", "header", "footer", "close", "arrow"],
    jsx: [
        ...mapJsx("Popover", [
            "Root",
            "Content",
            "Body",
            "Header",
            "Footer",
            "CloseButton",
            "Arrow"
        ]),
        ...mapJsx("Menu", ["Root", "Trigger", "TriggerItem", "Content", "Item"]),
        ...mapJsx("Select", ["Root", "Trigger", "Content", "VirtualContent"]),
        ...mapJsx("Autocomplete", ["Root", "Input", "Content", "VirtualContent", "Item"]),
        ...mapJsx("DatePicker", [
            "Root",
            "Trigger",
            "Input",
            "Control",
            "Content",
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
            "FooterButton",
            "AIO"
        ]),
        ...mapJsx("DateRangePicker", [
            "Root",
            "Trigger",
            "Input",
            "PopoverContent",
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
            "RangePreset",
            "RangePresetButton",
            "Footer",
            "FooterButton"
        ]),
        ...mapJsx("TimeInput", ["Root", "Trigger", "Content", "AIO"])
    ],
    base: {
        content: {
            "--popper-z-index": "{zIndex.popover}",
            "--arrow-size": "8px",
            "--arrow-background": "{colors.bg.panel}",
            maxW: "100vw",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "visible",
            backgroundColor: "bg.panel",
            backdropFilter: "blur({blurs.base})",
            boxShadow: "sm",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "{colors.border}",
            gap: 2,
            transformOrigin: "var(--transform-origin, center)",
            transitionProperty: "opacity, scale",
            transitionDuration: "200ms",
            transitionTimingFunction: "cubic-bezier(0.5, 0, 0.2, 1)",
            "&[data-starting-style]": {
                opacity: "0",
                scale: "0.95"
            },
            "&[data-ending-style]": {
                opacity: "0",
                scale: "0.95",
                transitionDuration: "100ms",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 1, 1)"
            },
            "&[data-reduce-motion]": {
                transition: "none"
            }
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            p: "var(--popover-padding)"
        },
        body: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            px: "var(--popover-padding)"
        },
        footer: {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            gap: 2,
            p: "var(--popover-padding)"
        },
        close: {
            position: "absolute",
            top: 2,
            insetInlineEnd: 2
        },
        arrow: {
            "--arrow-size": "8px",
            "--arrow-background": "{colors.bg.panel}",
            width: "var(--arrow-size)",
            height: "var(--arrow-size)",
            background: "var(--arrow-background)",
            borderStyle: "solid",
            borderColor: "border",
            borderWidth: "0",
            boxSizing: "border-box",
            boxShadow: "var(--popper-arrow-shadow, none)",
            rotate: "45deg",
            pointerEvents: "none",
            "&[data-side='bottom']": {
                top: "calc(var(--arrow-size) / -2)",
                borderTopWidth: "1px",
                borderLeftWidth: "1px"
            },
            "&[data-side='top']": {
                bottom: "calc(var(--arrow-size) / -2)",
                borderBottomWidth: "1px",
                borderRightWidth: "1px"
            },
            "&[data-side='left']": {
                right: "calc(var(--arrow-size) / -2)",
                borderTopWidth: "1px",
                borderRightWidth: "1px"
            },
            "&[data-side='right']": {
                left: "calc(var(--arrow-size) / -2)",
                borderBottomWidth: "1px",
                borderLeftWidth: "1px"
            }
        }
    },
    variants: {
        size: {
            sm: {
                content: {
                    "--popover-padding": "spacing.3",
                    width: "sm",
                    borderRadius: "p-3"
                }
            },
            md: {
                content: {
                    "--popover-padding": "spacing.4",
                    width: "md",
                    borderRadius: "p-4"
                }
            },
            reference: {
                content: {
                    "--popover-padding": "spacing.4",
                    borderRadius: "l2",
                    gap: "0",
                    width: "100%",
                    boxSizing: "border-box",
                    minW: "0"
                }
            },
            lg: {
                content: {
                    "--popover-padding": "spacing.5",
                    width: "lg",
                    borderRadius: "p-5"
                }
            },
            xl: {
                content: {
                    "--popover-padding": "spacing.6",
                    width: "xl",
                    borderRadius: "p-6"
                }
            },
            "2xl": {
                content: {
                    "--popover-padding": "spacing.7",
                    width: "2xl",
                    borderRadius: "p-6"
                }
            },
            "3xl": {
                content: {
                    "--popover-padding": "spacing.8",
                    width: "3xl",
                    borderRadius: "p-6"
                }
            },
            "4xl": {
                content: {
                    "--popover-padding": "spacing.9",
                    width: "4xl",
                    borderRadius: "p-6"
                }
            },
            "5xl": {
                content: {
                    "--popover-padding": "spacing.10",
                    width: "5xl",
                    borderRadius: "p-6"
                }
            },
            "6xl": {
                content: {
                    "--popover-padding": "spacing.10",
                    width: "6xl",
                    borderRadius: "p-6"
                }
            },
            "7xl": {
                content: {
                    "--popover-padding": "spacing.10",
                    width: "7xl",
                    borderRadius: "p-6"
                }
            },
            "8xl": {
                content: {
                    "--popover-padding": "spacing.10",
                    width: "8xl",
                    borderRadius: "p-6"
                }
            }
        }
    },
    defaultVariants: {
        size: "md"
    }
});
