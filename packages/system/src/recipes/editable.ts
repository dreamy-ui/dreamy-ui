import { defineSlotRecipe } from "@pandacss/dev";

export const editable = defineSlotRecipe({
	className: "dreamy-editable",
	description: "Dreamy UI Editable component",
	slots: [
		"root",
		"preview",
		"input",
		"editButton",
		"submitButton",
		"cancelButton"
	],
	jsx: [
		"Editable",
		"EditablePreview",
		"EditableInput",
		"EditableEditButton",
		"EditableSubmitButton",
		"EditableCancelButton"
	],
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			gap: 1
		},
		preview: {
			cursor: "pointer"
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
