import { defineSlotRecipe } from "@pandacss/dev";

export const editable = defineSlotRecipe({
    className: "editable",
    description: "Dreamy UI Editable component",
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
                boxShadow: "0 0 0 1px {colors.primary}"
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
    }
});
