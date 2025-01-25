import { Box } from "@/components/box/box";
import { RequiredIndicator } from "@/components/field/field";
import { useFieldContext } from "@/components/field/field-root";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface FieldLabelProps extends HTMLDreamProps<"label"> {
	/**
	 * @type React.ReactNode
	 */
	requiredIndicator?: React.ReactNode;
	/**
	 * @type React.ReactNode
	 */
	optionalIndicator?: React.ReactNode;
}

/**
 * Used to enhance the usability of form controls.
 *
 * It is used to inform users as to what information
 * is requested for a form field.
 *
 * ♿️ Accessibility: Every form field should have a form label.
 */
export const FieldLabelBase = forwardRef<HTMLLabelElement, FieldLabelProps>(
	function FieldLabel(props, ref) {
		const {
			children,
			requiredIndicator = <RequiredIndicator />,
			optionalIndicator = null,
			...rest
		} = props;

		const field = useFieldContext();
		const ownProps = field?.getLabelProps(rest, ref) ?? { ref, ...rest };

		return (
			<Box as={"label"} {...ownProps}>
				{children}
				{field?.isRequired ? requiredIndicator : optionalIndicator}
			</Box>
		);
	}
);

FieldLabelBase.displayName = "FieldLabel";

export interface RequiredIndicatorProps extends HTMLDreamProps<"span"> {}

/**
 * Used to show a "required" text or an asterisks (*) to indicate that
 * a field is required.
 */
export const RequiredIndicatorBase = forwardRef<
	HTMLSpanElement,
	RequiredIndicatorProps
>(function RequiredIndicator(props, ref) {
	const field = useFieldContext();

	if (!field?.isRequired) return null;

	return (
		<Box as={"span"} {...field?.getRequiredIndicatorProps(props, ref)} />
	);
});

RequiredIndicatorBase.displayName = "RequiredIndicator";
