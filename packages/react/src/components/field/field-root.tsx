import type { UserFeedbackProps } from "@/components/input";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { createContext } from "@/provider/create-context";
import type { PropGetter } from "@/utils";
import { dataAttr } from "@/utils/attr";
import { objectToDeps } from "@/utils/object";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef, useCallback, useId, useState } from "react";
import { type FieldVariantProps, field } from "styled-system/recipes";
import { dreamy } from "../factory";
import { FieldErrorBase } from "./field-error";
import { FieldHelpTextBase } from "./field-help-text";
import { FieldLabelBase } from "./field-label";

interface FieldContext extends UserFeedbackProps {
	/**
	 * The label text used to inform users as to what information is
	 * requested for a text field.
	 */
	label?: string;
	/**
	 * The custom `id` to use for the form control. This is passed directly to the form element (e.g, Input).
	 * - The form element (e.g. Input) gets the `id`
	 * - The form label id: `form-label-${id}`
	 * - The form error text id: `form-error-text-${id}`
	 * - The form helper text id: `form-helper-text-${id}`
	 */
	id?: string;
}

export type FieldProviderContext = Omit<
	ReturnType<typeof useFieldProvider>,
	"getRootProps" | "htmlProps"
>;

export const [FieldProvider, useFieldContext] =
	createContext<FieldProviderContext>({
		strict: false,
		name: "FieldContext"
	});

export function useFieldProvider(props: FieldContext) {
	const {
		id: idProp,
		isRequired,
		isInvalid,
		isDisabled,
		isReadOnly,
		...htmlProps
	} = props;

	// Generate all the required ids
	const uuid = useId();
	const id = idProp || `field-${uuid}`;

	const labelId = `${id}-label`;
	const feedbackId = `${id}-feedback`;
	const helpTextId = `${id}-helptext`;

	/**
	 * Track whether the `FormErrorMessage` has been rendered.
	 * We use this to append its id the `aria-describedby` of the `input`.
	 */
	const [hasFeedbackText, setHasFeedbackText] = useState(false);

	/**
	 * Track whether the `FormHelperText` has been rendered.
	 * We use this to append its id the `aria-describedby` of the `input`.
	 */
	const [hasHelpText, setHasHelpText] = useState(false);

	// Track whether the form element (e.g, `input`) has focus.
	const [isFocused, setFocus] = useState(false);

	const getHelpTextProps = useCallback<PropGetter>(
		(props = {}, forwardedRef = null) => ({
			id: helpTextId,
			...props,
			/**
			 * Notify the field context when the help text is rendered on screen,
			 * so we can apply the correct `aria-describedby` to the field (e.g. input, textarea).
			 */
			ref: mergeRefs(forwardedRef, (node) => {
				if (!node) return;
				setHasHelpText(true);
			})
		}),
		[helpTextId]
	);

	const getLabelProps = useCallback<PropGetter>(
		(props = {}, forwardedRef = null) => ({
			...props,
			ref: forwardedRef,
			"data-focus": dataAttr(isFocused),
			"data-disabled": dataAttr(isDisabled),
			"data-invalid": dataAttr(isInvalid),
			"data-readonly": dataAttr(isReadOnly),
			id: props.id !== undefined ? props.id : labelId,
			htmlFor: props.htmlFor !== undefined ? props.htmlFor : id
		}),
		[id, isDisabled, isFocused, isInvalid, isReadOnly, labelId]
	);

	const getErrorMessageProps = useCallback<PropGetter>(
		(props = {}, forwardedRef = null) => ({
			id: feedbackId,
			...props,
			/**
			 * Notify the field context when the error message is rendered on screen,
			 * so we can apply the correct `aria-describedby` to the field (e.g. input, textarea).
			 */
			ref: mergeRefs(forwardedRef, (node) => {
				if (!node) return;
				setHasFeedbackText(true);
			}),
			"aria-live": "polite" as const
		}),
		[feedbackId]
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const getRootProps = useCallback<PropGetter>(
		(props = {}, forwardedRef = null) => ({
			...props,
			...htmlProps,
			ref: forwardedRef,
			role: "group",
			"data-focus": dataAttr(isFocused),
			"data-disabled": dataAttr(isDisabled),
			"data-invalid": dataAttr(isInvalid),
			"data-readonly": dataAttr(isReadOnly)
		}),
		[
			isDisabled,
			isFocused,
			isInvalid,
			isReadOnly,
			...objectToDeps(htmlProps)
		]
	);

	const getRequiredIndicatorProps = useCallback<PropGetter>(
		(props = {}, forwardedRef = null) => ({
			...props,
			ref: forwardedRef,
			role: "presentation",
			"aria-hidden": true,
			children: props.children || "*"
		}),
		[]
	);

	return {
		isRequired: !!isRequired,
		isInvalid: !!isInvalid,
		isReadOnly: !!isReadOnly,
		isDisabled: !!isDisabled,
		isFocused: !!isFocused,
		onFocus: () => setFocus(true),
		onBlur: () => setFocus(false),
		hasFeedbackText,
		setHasFeedbackText,
		hasHelpText,
		setHasHelpText,
		id,
		labelId,
		feedbackId,
		helpTextId,
		htmlProps,
		getHelpTextProps,
		getErrorMessageProps,
		getRootProps,
		getLabelProps,
		getRequiredIndicatorProps
	};
}

export interface FieldProps
	extends HTMLDreamProps<"div">,
		FieldContext,
		FieldVariantProps {
	helpText?: string;
	error?: string;
}

const StyledField = dreamy("div", field);

export const FieldRoot = forwardRef<HTMLDivElement, FieldProps>(function Field(
	{ children, label, helpText, error, ...props },
	ref
) {
	const { getRootProps, htmlProps: _, ...context } = useFieldProvider(props);

	return (
		<FieldProvider value={context}>
			<StyledField {...getRootProps({}, ref)}>
				<>
					{label ? <FieldLabelBase>{label}</FieldLabelBase> : null}
					{children}
				</>
				{helpText && <FieldHelpTextBase>{helpText}</FieldHelpTextBase>}
				{error && <FieldErrorBase>{error}</FieldErrorBase>}
			</StyledField>
		</FieldProvider>
	);
});
