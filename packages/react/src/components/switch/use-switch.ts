import { useCallbackRef } from "@/hooks";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { useReducedMotion } from "@/provider";
import { type PropGetter, TRANSITION_EASINGS, callAllHandlers, cx } from "@/utils";
import { ariaAttr, dataAttr } from "@/utils/attr";
import { objectToDeps } from "@/utils/object";
import { useFocusRing } from "@react-aria/focus";
import type { Transition } from "motion";
import React, {
	type ReactNode,
	type Ref,
	useCallback,
	useId,
	useMemo,
	useRef,
	useState
} from "react";
import { useSafeLayoutEffect } from "../descendant/utils";
import { type UserFeedbackProps, useField } from "../field/use-field";

export type SwitchIconProps = {
	"data-checked": string;
	isSelected: boolean;
	isIndeterminate: boolean;
	reduceMotion: boolean;
};

interface Props extends Record<string, any> {
	/**
	 * Ref to the DOM node.
	 */
	ref?: Ref<HTMLInputElement>;
	/**
	 * The label of the Switch.
	 */
	children?: ReactNode;
	/**
	 * Whether the Switch is disabled.
	 * @default false
	 */
	isDisabled?: boolean;
	/**
	 * The icon to be displayed when the Switch is checked.
	 */
	icon?: ReactNode | React.ReactElement;
	/**
	 * The callback function with value, instead of event, when the Switch is changed.
	 */
	onChangeValue?: (value: boolean) => void;
}

export interface UseSwitchProps extends Props, UserFeedbackProps {
	reduceMotion?: boolean;
	isIndeterminate?: boolean;
	isChecked?: boolean;
	defaultChecked?: boolean;
}

export function useSwitch(props: UseSwitchProps = {}) {
	const reduceMotionGlobal = useReducedMotion();

	const {
		disabled: isDisabledField = false,
		readOnly: isReadOnlyField = false,
		required: isRequiredField = false,
		id,
		onBlur,
		onFocus,
		"aria-describedby": ariaDescribedByField
	} = useField(props);

	const onBlurProp = useCallbackRef(onBlur);
	const onFocusProp = useCallbackRef(onFocus);

	const {
		ref,
		value = "",
		children,
		icon,
		name,
		autoFocus = false,
		isChecked: isCheckedProp,
		reduceMotion = reduceMotionGlobal ?? false,
		isIndeterminate = false,
		isDisabled = isDisabledField,
		isReadOnly = isReadOnlyField,
		isInvalid = false,
		className,
		isRequired = isRequiredField,
		defaultChecked,
		onChange,
		onChangeValue,
		tabIndex,
		"aria-label": ariaLabel,
		"aria-labelledby": ariaLabelledBy,
		"aria-invalid": ariaInvalid,
		"aria-describedby": ariaDescribedBy = ariaDescribedByField,
		...otherProps
	} = props;

	const [checkedState, setCheckedState] = useState(!!defaultChecked);

	const isControlled = isCheckedProp !== undefined;
	const isChecked = isControlled ? isCheckedProp : checkedState;

	const domRef = useRef<HTMLLabelElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const reactId = useId();
	const labelId = useMemo(() => id || reactId, [id, reactId]);

	const isInteractionDisabled = useMemo(() => isDisabled || isReadOnly, [isDisabled, isReadOnly]);

	const [isActive, setActive] = useState(false);
	const active = isActive && !isInteractionDisabled;

	const { isFocusVisible, focusProps } = useFocusRing({
		autoFocus
	});

	const onChangeProp = useCallbackRef(onChange);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (isReadOnly || isDisabled) {
				event.preventDefault();
				return;
			}

			if (!isControlled) {
				if (isChecked) {
					setCheckedState(event.target.checked);
				} else {
					setCheckedState(isIndeterminate ? true : event.target.checked);
				}
			}

			setActive(false);

			onChangeProp?.(event);
			onChangeValue?.(event.target.checked);
		},
		[
			isReadOnly,
			isDisabled,
			isChecked,
			isControlled,
			isIndeterminate,
			onChangeProp,
			onChangeValue
		]
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const getRootProps: PropGetter = useCallback(() => {
		return {
			ref: domRef,
			"data-disabled": dataAttr(isDisabled),
			"data-checked": dataAttr(isChecked || isIndeterminate),
			"aria-checked": ariaAttr(isChecked || isIndeterminate),
			"data-invalid": dataAttr(isInvalid),
			"data-readonly": dataAttr(isReadOnly),
			"data-indeterminate": dataAttr(isIndeterminate),
			"data-active": dataAttr(active),
			"aria-active": ariaAttr(active),
			onPointerDown: callAllHandlers(otherProps.onPointerDown, () => setActive(true)),
			onPointerUp: callAllHandlers(otherProps.onPointerUp, () => setActive(false)),
			onPointerLeave: callAllHandlers(otherProps.onPointerLeave, () => setActive(false)),
			onClick: callAllHandlers(props.onClick, () => {
				inputRef.current?.click();
				requestAnimationFrame(() => {
					inputRef.current?.focus({ preventScroll: true });
				});
			}),
			className: cx(className, "group"),
			...otherProps
		};
	}, [
		isDisabled,
		isChecked,
		isIndeterminate,
		isInvalid,
		isReadOnly,
		className,
		active,
		props.onClick,
		isFocusVisible,
		...objectToDeps(otherProps)
	]);

	const getWrapperProps: PropGetter = useCallback(
		(props = {}) => {
			return {
				...props,
				"data-part": "control",
				"data-focus-visible": dataAttr(isFocusVisible),
				"aria-hidden": true
			};
		},
		[isFocusVisible]
	);

	const onKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === " ") {
				setActive(true);
			} else if (event.key === "Enter") {
				/**
				 * Mark the checked state as the opposite of the current state
				 */
				(event.target as any).checked = !isChecked;
				handleChange(event as any);
			}
		},
		[handleChange, isChecked]
	);

	const onKeyUp = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === " ") {
				event.preventDefault();
				setActive(false);
				(event.target as any).checked = !isChecked;
				handleChange(event as any);
			}
		},
		[handleChange, isChecked]
	);

	const getInputProps: PropGetter = useCallback(() => {
		return {
			ref: mergeRefs(inputRef, ref),
			type: "checkbox",
			name,
			value,
			tabIndex,
			onChange: handleChange,
			onBlur: callAllHandlers(props.onBlur, onBlurProp),
			onFocus: callAllHandlers(props.onFocus, onFocusProp),
			onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown),
			onKeyUp: callAllHandlers(props.onKeyUp, onKeyUp),
			required: isRequired,
			checked: isChecked,
			disabled: isInteractionDisabled,
			readOnly: isReadOnly,
			id: id ?? labelId,
			"aria-label": ariaLabel,
			"aria-labelledby": ariaLabelledBy ?? labelId,
			"aria-invalid": ariaAttr(ariaInvalid ? Boolean(ariaInvalid) : isInvalid),
			"aria-describedby": ariaDescribedBy,
			"aria-disabled": ariaAttr(isDisabled),
			className: "peer",
			...(focusProps as any)
		};
	}, [
		handleChange,
		ref,
		isDisabled,
		isReadOnly,
		isInvalid,
		isInteractionDisabled,
		labelId,
		name,
		props.onBlur,
		props.onFocus,
		props.onKeyDown,
		props.onKeyUp,
		isChecked,
		id,
		isRequired,
		ariaLabel,
		ariaLabelledBy,
		ariaInvalid,
		ariaDescribedBy,
		onBlurProp,
		onFocusProp,
		tabIndex,
		value,
		onKeyDown,
		onKeyUp,
		focusProps
	]);

	const getLabelProps: PropGetter = useCallback(
		() => ({
			htmlFor: labelId,
			"data-part": "label"
		}),
		[labelId]
	);

	const getThumbProps = useCallback(() => {
		return {
			"data-part": "thumb",
			layout: "position",
			layoutId: `switch-thumb-${id ?? labelId}`,
			transition: {
				duration: 0.2,
				ease: TRANSITION_EASINGS.easeInOut
			} satisfies Transition
		} as const;
	}, [id, labelId]);

	useSafeLayoutEffect(() => {
		const el = inputRef.current;
		if (!el?.form) return;
		const formResetListener = () => {
			setCheckedState(!!defaultChecked);
		};
		el.form.addEventListener("reset", formResetListener);
		return () => el.form?.removeEventListener("reset", formResetListener);
	}, []);

	return {
		id: id ?? labelId,
		icon,
		children,
		isChecked,
		isDisabled,
		isInvalid,
		getRootProps,
		getWrapperProps,
		getInputProps,
		getLabelProps,
		getThumbProps
	};
}

export type UseSwitchReturn = ReturnType<typeof useSwitch>;
