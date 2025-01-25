import { Box } from "@/components/box/box";
import { useFieldContext } from "@/components/field/field-root";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface FieldHelpTextProps extends HTMLDreamProps<"div"> {}

/**
 * FieldHelperText
 *
 * Assistive component that conveys additional guidance
 * about the field, such as how it will be used and what
 * types in values should be provided.
 */
export const FieldHelpTextBase = forwardRef<HTMLDivElement, FieldHelpTextProps>(
	function FieldHelpText(props, ref) {
		const field = useFieldContext();

		if (field?.isInvalid) return null;

		return <Box {...field?.getHelpTextProps(props, ref)} />;
	}
);

FieldHelpTextBase.displayName = "FieldHelpText";
