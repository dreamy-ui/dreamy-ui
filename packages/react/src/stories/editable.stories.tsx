import {
	Editable,
	EditableCancelButton,
	EditableEditButton,
	EditableInput,
	EditablePreview,
	EditableSubmitButton
} from "@/components";
import { HStack } from "@/rsc";
import type { Meta } from "@storybook/react";

export default {
	title: "Editable"
} satisfies Meta;

export function Base() {
	return (
		<Editable defaultValue="Meow" placeholder="Enter an animal sound">
			<EditablePreview />
			<EditableInput />
			<HStack>
				<EditableEditButton />
				<EditableSubmitButton />
				<EditableCancelButton />
			</HStack>
		</Editable>
	);
}
