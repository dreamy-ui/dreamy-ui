import { defineSlotRecipe } from "@pandacss/dev";

export const editable = defineSlotRecipe({
    className: "editable",
    description:
        "An inline editable field that toggles between read-only preview and edit mode with submit/cancel actions. plain is text-only with no hover affordance; soft uses a rounded l1 preview that shows an alpha background on hover/focus to signal editability.",
    slots: ["root", "preview", "input", "editButton", "submitButton", "cancelButton"],
    jsx: [
        "Editable.Root",
        "Editable.Preview",
        "Editable.Input",
        "Editable.EditButton",
        "Editable.SubmitButton",
        "Editable.CancelButton"
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1
        },
        preview: {
            cursor: "text",
            display: "inline-block"
        },
        input: {
            outline: 0,
            rounded: "l05",
            _focusVisible: {
                boxShadow: "0 0 0 2px {colors.primary}"
            }
        },
        cancelButton: {
            color: "fg.medium",
            fontWeight: "medium",
            cursor: "pointer",
            display: "none",
            transition: "color {durations.normal} {easings.ease-in-out}",
            "[data-editable-state=editing] &": {
                display: "block"
            },
            _hover: {
                color: "fg"
            }
        },
        submitButton: {
            color: "fg.medium",
            fontWeight: "medium",
            cursor: "pointer",
            display: "none",
            transition: "color {durations.normal} {easings.ease-in-out}",
            "[data-editable-state=editing] &": {
                display: "block"
            },
            _hover: {
                color: "fg"
            }
        },
        editButton: {
            color: "fg.medium",
            fontWeight: "medium",
            cursor: "pointer",
            display: "none",
            transition: "color {durations.normal} {easings.ease-in-out}",
            "[data-editable-state=view] &": {
                display: "block"
            },
            _hover: {
                color: "fg"
            }
        }
    },
    variants: {
        variant: {
            plain: {},
            soft: {
                preview: {
                    rounded: "l1",
                    px: 1,
                    py: 0.5,
                    transition: "background-color {durations.normal} {easings.ease-in-out}",
                    _hover: {
                        bg: "alpha.50"
                    },
                    _focusVisible: {
                        bg: "alpha.50",
                        outline: "none"
                    },
                    "&[aria-disabled=true]": {
                        cursor: "not-allowed",
                        _hover: {
                            bg: "transparent"
                        }
                    }
                },
                input: {
                    rounded: "l1",
                    px: 1,
                    py: 0.5
                }
            }
        }
    },
    defaultVariants: {
        variant: "plain"
    }
});
