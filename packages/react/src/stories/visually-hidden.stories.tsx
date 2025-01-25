import { VisuallyHidden, VisuallyHiddenInput } from "@/rsc";
import type { Meta } from "@storybook/react";

export default {
	title: "Visually Hidden"
} satisfies Meta;

export function Base() {
	return <VisuallyHidden>Text</VisuallyHidden>;
}

export function Input() {
	return <VisuallyHiddenInput />;
}
