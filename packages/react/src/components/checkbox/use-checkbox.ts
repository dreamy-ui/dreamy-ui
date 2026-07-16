import { useCallbackRef } from "@/hooks";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { createContext, useReducedMotion } from "@/provider";
import { type PropGetter, callAllHandlers, cx, omitDreamyProps } from "@/utils";
import { ariaAttr, dataAttr } from "@/utils/attr";
import { useFocusRing } from "@react-aria/focus";
import type { SVGMotionProps } from "motion/react";
import {
	type PointerEvent,
	type ReactNode,
	type Ref,
	useCallback,
	useId,
	useMemo,
	useRef,
	useState
} from "react";
import { useSafeLayoutEffect } from "../descendant/utils";
import { type UserFeedbackProps, useFieldProps } from "../field/use-field";
import { useCheckboxGroupContext } from "./use-checkbox-group";

export interface IconCustomProps {
	/**
	 * Animation time in milliseconds.
	 * @default 200
	 */
	animationTime?: number;
	/**
	 * Props to pass to the animated path
	 */
	pathProps?: SVGMotionProps<SVGPathElement>;
}

export interface CheckboxIconProps {
	"data-checked"?: string;
	isSelected?: boolean;
	isIndeterminate?: boolean;
	reduceMotion?: boolean;
}

interface Props extends IconCustomProps {
	/**
	 * Ref to the DOM node.
	 */
	ref?: Ref<HTMLInputElement>;
	/**
	 * The label of the checkbox.
	 */
	children?: ReactNode;
	/**
	 * Whether the checkbox is disabled.
	 * @default false
	 */
	isDisabled?: boolean;
	/**
	 * The icon to be displayed when the checkbox is checked.
	 */
	icon?: ReactNode | ((props: CheckboxIconProps) => ReactNode);
	/**
	 * The callback function with value, instead of event, when the checkbox is changed.
	 */
	onChangeValue?: (value: boolean) => void;
}

export interface UseCheckboxProps extends Props, UserFeedbackProps, Record<string, any> {
	isCard?: boolean;
	reduceMotion?: boolean;
	isIndeterminate?: boolean;
	isChecked?: boolean;
	defaultChecked?: boolean;
}

export function useCheckbox(props: UseCheckboxProps = {}) {
	const reduceMotionGlobal = useReducedMotion();
	const groupContext = useCheckboxGroupContext();

	const {
		isDisabled: isDisabledField = groupContext?.isDisabled ?? false,
		isReadOnly: isReadOnlyField = groupContext?.isReadOnly ?? false,
		isRequired: isRequiredField = groupContext?.isRequired ?? false,
		isInvalid: isInvalidField = groupContext?.isInvalid ?? false,
		id,
		onBlur,
		onFocus,
		"aria-describedby": ariaDescribedByField
	} = useFieldProps(props);

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
		reduceMotion = groupContext?.reduceMotion ?? reduceMotionGlobal ?? false,
		isIndeterminate = false,
		isDisabled = isDisabledField,
		isReadOnly = isReadOnlyField,
		isInvalid = isInvalidField,
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
		animationTime,
		pathProps,
		isCard = false,
		...otherProps
	} = props;

	const [checkedState, setCheckedState] = useState(!!defaultChecked);

	const isControlled = isCheckedProp !== undefined;
	const isChecked = groupContext
		? (groupContext.value?.includes(value as any) ?? false)
		: isControlled
			? isCheckedProp
			: checkedState;

	const domRef = useRef<HTMLLabelElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const reactId = useId();
	const labelId = useMemo(() => id || reactId, [id, reactId]);

	const isInteractionDisabled = useMemo(() => isDisabled || isReadOnly, [isDisabled, isReadOnly]);

	const [isActive, setActive] = useState(false);
	const active = isActive && !isInteractionDisabled;
	const [suppressFocusVisible, setSuppressFocusVisible] = useState(false);

	const { isFocusVisible, focusProps } = useFocusRing({
		autoFocus
	});

	const onChangeProp = useCallbackRef(callAllHandlers(onChange, groupContext?.onChange as any));

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

	const getRootProps: PropGetter = useCallback(() => {
		const groupProps = groupContext ? groupContext.variants : {};

		return {
			ref: domRef,
			"data-disabled": dataAttr(isDisabled),
			"data-checked": dataAttr(isChecked || isIndeterminate),
			"data-invalid": dataAttr(isInvalid),
			"data-readonly": dataAttr(isReadOnly),
			"data-indeterminate": dataAttr(isIndeterminate),
			"data-focus-visible": isCard
				? dataAttr(isFocusVisible && !suppressFocusVisible)
				: undefined,
			onPointerDown: callAllHandlers(otherProps.onPointerDown, (event: PointerEvent) => {
				setActive(true);
				if (isCard && event.pointerType) {
					setSuppressFocusVisible(true);
				}
			}),
			onPointerUp: callAllHandlers(otherProps.onPointerUp, () => setActive(false)),
			onPointerLeave: callAllHandlers(otherProps.onPointerLeave, () => setActive(false)),
			onClick: callAllHandlers(props.onClick, () => {
				const input = inputRef.current;
				if (!input) {
					return;
				}

				input.click();

				if (isCard) {
					input.focus({ preventScroll: true });
					return;
				}

				requestAnimationFrame(() => {
					input.focus({ preventScroll: true });
				});
			}),
			className: cx(className, "group"),
			...groupProps,
			...omitDreamyProps(otherProps)
		};
	}, [
		isDisabled,
		isChecked,
		isIndeterminate,
		isInvalid,
		isReadOnly,
		className,
		props.onClick,
		isCard,
		isFocusVisible,
		suppressFocusVisible,
		groupContext,
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		otherProps
	]);

	const getWrapperProps: PropGetter = useCallback(
		(props = {}) => {
			return {
				...props,
				"data-part": "control",
				"data-focus-visible": isCard ? undefined : dataAttr(isFocusVisible),
				"aria-hidden": true
			};
		},
		[isFocusVisible, isCard]
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
			onBlur: callAllHandlers(props.onBlur, onBlurProp, () => {
				if (isCard) {
					setSuppressFocusVisible(false);
				}
			}),
			onFocus: callAllHandlers(props.onFocus, onFocusProp),
			onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown, () => {
				if (isCard) {
					setSuppressFocusVisible(false);
				}
			}),
			onKeyUp: callAllHandlers(props.onKeyUp, onKeyUp),
			required: isRequired,
			checked: isChecked,
			disabled: isInteractionDisabled,
			readOnly: isReadOnly,
			id: id ?? labelId,
			"aria-label": ariaLabel,
			"aria-labelledby": ariaLabelledBy,
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
		focusProps,
		isCard
	]);

	const getLabelProps: PropGetter = useCallback(
		(props = {}) => ({
			...props,
			htmlFor: labelId,
			"data-part": "label"
		}),
		[labelId]
	);

	const getIconProps = useCallback(
		(props: Record<string, any> = {}) => ({
			...props,
			isChecked,
			active,
			isIndeterminate,
			reduceMotion,
			animationTime,
			pathProps,
			"data-part": "icon"
		}),
		[isChecked, isIndeterminate, reduceMotion, active, animationTime, pathProps]
	);

	useSafeLayoutEffect(() => {
		const el = inputRef.current;
		if (!el) return;
		el.indeterminate = Boolean(isIndeterminate);
	}, [isIndeterminate, isChecked]);

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
		icon,
		children,
		isChecked,
		isDisabled,
		isInvalid,
		getRootProps,
		getWrapperProps,
		getInputProps,
		getLabelProps,
		getIconProps
	};
}

export type UseCheckboxReturn = ReturnType<typeof useCheckbox>;

export const [CheckboxCardProvider, useCheckboxCardContext] = createContext<UseCheckboxReturn>({
	name: "CheckboxCardContext",
	strict: false
});
