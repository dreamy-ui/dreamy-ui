import { mergeRefs } from "@/hooks/use-merge-refs";
import { createContext } from "@/provider";
import { type PropGetter, ariaAttr, callAllHandlers, dataAttr, objectToDeps } from "@/utils";
import { useCallback, useId, useState } from "react";

export interface UserFeedbackProps {
	/**
	 * If `true`, the form control will be required. This has 2 side effects:
	 * - The `FormLabel` will show a required indicator
	 * - The form element (e.g, Input) will have `aria-required` set to `true`
	 *
	 * @default false
	 */
	isRequired?: boolean;
	/**
	 * If `true`, the form control will be disabled. This has 2 side effects:
	 * - The `FormLabel` will have `data-disabled` attribute
	 * - The form element (e.g, Input) will be disabled
	 *
	 * @default false
	 */
	isDisabled?: boolean;
	/**
	 * If `true`, the form control will be invalid. This has 2 side effects:
	 * - The `FormLabel` and `FormErrorIcon` will have `data-invalid` set to `true`
	 * - The form element (e.g, Input) will have `aria-invalid` set to `true`
	 *
	 * @default false
	 */
	isInvalid?: boolean;
	/**
	 * If `true`, the form control will be readonly
	 *
	 * @default false
	 */
	isReadOnly?: boolean;
}

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
	 * - The form hint id: `form-hint-${id}`
	 */
	id?: string;
}

export type FieldProviderContext = Omit<
	ReturnType<typeof useFieldProvider>,
	"getRootProps" | "htmlProps"
>;

export const [FieldProvider, useFieldContext] = createContext<FieldProviderContext>({
	strict: false,
	name: "FieldContext"
});

export function useFieldProvider(props: FieldContext) {
	const { id: idProp, isRequired, isInvalid, isDisabled, isReadOnly, ...htmlProps } = props;

	// Generate all the required ids
	const uuid = useId();
	const id = idProp || `field-${uuid}`;

	const labelId = `${id}-label`;
	const feedbackId = `${id}-feedback`;
	const hintId = `${id}-hint`;

	/**
	 * Track whether the `FormErrorMessage` has been rendered.
	 * We use this to append its id the `aria-describedby` of the `input`.
	 */
	const [hasFeedbackText, setHasFeedbackText] = useState(false);

	/**
	 * Track whether the `FormHint` has been rendered.
	 * We use this to append its id the `aria-describedby` of the `input`.
	 */
	const [hasHint, setHasHint] = useState(false);

	// Track whether the form element (e.g, `input`) has focus.
	const [isFocused, setFocus] = useState(false);

	const getHintProps = useCallback<PropGetter>(
		(props = {}, forwardedRef = null) => ({
			id: hintId,
			...props,
			/**
			 * Notify the field context when the hint is rendered on screen,
			 * so we can apply the correct `aria-describedby` to the field (e.g. input, textarea).
			 */
			ref: mergeRefs(forwardedRef, (node) => {
				if (!node) return;
				setHasHint(true);
			})
		}),
		[hintId]
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
		[isDisabled, isFocused, isInvalid, isReadOnly, ...objectToDeps(htmlProps)]
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
		hasHint,
		setHasHint,
		id,
		labelId,
		feedbackId,
		hintId,
		htmlProps,
		getHintProps,
		getErrorMessageProps,
		getRootProps,
		getLabelProps,
		getRequiredIndicatorProps
	};
}

export interface UseFieldProps<T extends HTMLElement> extends UserFeedbackProps {
	id?: string;
	onFocus?: React.FocusEventHandler<T>;
	onBlur?: React.FocusEventHandler<T>;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	"aria-describedby"?: string;
}

/**
 * React hook that provides the props that should be spread on to
 * input fields (`input`, `select`, `textarea`, etc.).
 *
 * It provides a convenient way to control a form fields, validation
 * and hint.
 *
 * @internal
 */
export function useField<T extends HTMLElement>(props: UseFieldProps<T>) {
	const { isDisabled, isInvalid, isReadOnly, isRequired, ...rest } = useFieldProps(props);

	return {
		...rest,
		disabled: isDisabled,
		readOnly: isReadOnly,
		required: isRequired,
		"aria-invalid": ariaAttr(isInvalid),
		"aria-required": ariaAttr(isRequired),
		"aria-readonly": ariaAttr(isReadOnly),
		"data-invalid": dataAttr(isInvalid),
		"data-required": dataAttr(isRequired),
		"data-readonly": dataAttr(isReadOnly)
	};
}

/**
 * @internal
 */
export function useFieldProps<T extends HTMLElement>(props: UseFieldProps<T>) {
	const field = useFieldContext();

	const {
		id,
		disabled,
		readOnly,
		required,
		isRequired,
		isInvalid,
		isReadOnly,
		isDisabled,
		onFocus,
		onBlur,
		...rest
	} = props;

	const labelIds: string[] = props["aria-describedby"] ? [props["aria-describedby"]] : [];

	// Error message must be described first in all scenarios.
	if (field?.hasFeedbackText && field?.isInvalid) {
		labelIds.push(field.feedbackId);
	}

	if (field?.hasHint) {
		labelIds.push(field.hintId);
	}

	return {
		...rest,
		"aria-describedby": labelIds.join(" ") || undefined,
		id: id ?? field?.id,
		isDisabled: disabled ?? isDisabled ?? field?.isDisabled,
		isReadOnly: readOnly ?? isReadOnly ?? field?.isReadOnly,
		isRequired: required ?? isRequired ?? field?.isRequired,
		isInvalid: isInvalid ?? field?.isInvalid,
		onFocus: callAllHandlers(field?.onFocus, onFocus),
		onBlur: callAllHandlers(field?.onBlur, onBlur)
	};
}
