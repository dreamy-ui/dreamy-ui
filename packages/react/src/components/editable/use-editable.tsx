import { useCallbackRef, useSafeLayoutEffect, useUpdateEffect } from "@/hooks";
import { useControllableState } from "@/hooks/use-controllable-state";
import { useFocusOnPointerDown } from "@/hooks/use-focus-on-pointer-down";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { createContext } from "@/provider/create-context";
import { type PropGetter, callAllHandlers } from "@/utils";
import { ariaAttr } from "@/utils/attr";
import {
	type RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";

export type EditableContext = Omit<UseEditableReturn, "htmlProps">;

export const [EditableProvider, useEditableContext] =
	createContext<EditableContext>({
		name: "EditableContext",
		errorMessage:
			"useEditableContext: context is undefined. Seems you forgot to wrap the editable components in `<Editable />`"
	});

interface FocusableElement {
	focus(options?: FocusOptions): void;
}

export interface UseEditableProps {
	/**
	 * The value of the Editable in both edit & preview mode
	 */
	value?: string;
	/**
	 * The initial value of the Editable in both edit & preview mode
	 */
	defaultValue?: string;
	/**
	 * If `true`, the Editable will be disabled.
	 */
	isDisabled?: boolean;
	/**
	 * If `true`, the Editable will use double click to enter edit mode.
	 * @default false
	 */
	useDoubleClick?: boolean;
	/**
	 * If `true`, the Editable will start with edit mode by default.
	 */
	startWithEditView?: boolean;
	/**
	 * If `true`, the read only view, has a `tabIndex` set to `0`
	 * so it can receive focus via the keyboard or click.
	 * @default true
	 */
	isPreviewFocusable?: boolean;
	/**
	 * If `true`, it'll update the value onBlur and turn off the edit mode.
	 * @default true
	 */
	submitOnBlur?: boolean;
	/**
	 * Callback invoked when user changes input.
	 */
	onChange?: (nextValue: string) => void;
	/**
	 * Callback invoked when user cancels input with the `Esc` key.
	 * It provides the last confirmed value as argument.
	 */
	onCancel?: (previousValue: string) => void;
	/**
	 * Callback invoked when user confirms value with `enter` key or by blurring input.
	 */
	onSubmit?: (nextValue: string) => void;
	/**
	 * Callback invoked once the user enters edit mode.
	 */
	onEdit?: () => void;
	/**
	 * Callback invoked when the user either submits or cancels.
	 * It provides the last confirmed value as argument.
	 */
	onBlur?: (nextValue: string) => void;
	/**
	 * If `true`, the input's text will be highlighted on focus.
	 * @default true
	 */
	selectAllOnFocus?: boolean;
	/**
	 * The placeholder text when the value is empty.
	 */
	placeholder?: string;
	/**
	 * The `ref` of element to receive focus when the modal closes.
	 */
	finalFocusRef?: RefObject<FocusableElement | null>;
}

function contains(parent: HTMLElement | null, child: HTMLElement) {
	if (!parent) return false;
	return parent === child || parent.contains(child);
}

export function useEditable(props: UseEditableProps = {}) {
	const {
		onChange: onChangeProp,
		onCancel: onCancelProp,
		onSubmit: onSubmitProp,
		onBlur: onBlurProp,
		value: valueProp,
		isDisabled,
		defaultValue,
		useDoubleClick,
		startWithEditView,
		isPreviewFocusable = true,
		submitOnBlur = true,
		selectAllOnFocus = true,
		placeholder,
		onEdit: onEditCallback,
		finalFocusRef,
		...htmlProps
	} = props;

	const onEditProp = useCallbackRef(onEditCallback);

	const defaultIsEditing = useMemo(
		() => Boolean(startWithEditView && !isDisabled),
		[startWithEditView, isDisabled]
	);

	const [isEditing, setIsEditing] = useState(defaultIsEditing);

	const [value, setValue] = useControllableState({
		defaultValue: defaultValue || "",
		value: valueProp,
		onChange: onChangeProp
	});

	/**
	 * Keep track of the previous value, so if users
	 * presses `cancel`, we can revert to it.
	 */
	const [prevValue, setPrevValue] = useState(value);

	/**
	 * Ref to help focus the input in edit mode
	 */
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
	const previewRef = useRef<any>(null);

	const editButtonRef = useRef<HTMLButtonElement>(null);
	const cancelButtonRef = useRef<HTMLElement>(null);
	const submitButtonRef = useRef<HTMLElement>(null);

	useFocusOnPointerDown({
		ref: inputRef,
		enabled: isEditing,
		elements: [cancelButtonRef, submitButtonRef]
	});

	const isInteractive = useMemo(
		() => !isEditing && !isDisabled,
		[isEditing, isDisabled]
	);

	useSafeLayoutEffect(() => {
		if (isEditing) {
			inputRef.current?.focus();
			if (selectAllOnFocus) inputRef.current?.select();
		}
	}, []);

	useUpdateEffect(() => {
		if (!isEditing) {
			if (finalFocusRef) {
				finalFocusRef.current?.focus();
			} else {
				editButtonRef.current?.focus();
			}
			return;
		}

		inputRef.current?.focus();

		if (selectAllOnFocus) {
			inputRef.current?.select();
		}

		onEditProp?.();
	}, [isEditing, onEditProp, selectAllOnFocus]);

	const onEdit = useCallback(() => {
		if (isInteractive) {
			setIsEditing(true);
		}
	}, [isInteractive]);

	const onUpdatePrevValue = useCallback(() => {
		setPrevValue(value);
	}, [value]);

	const onCancel = useCallback(() => {
		setIsEditing(false);
		setValue(prevValue);
		onCancelProp?.(prevValue);
		onBlurProp?.(prevValue);
	}, [onCancelProp, onBlurProp, setValue, prevValue]);

	const onSubmit = useCallback(() => {
		setIsEditing(false);
		setPrevValue(value);
		onSubmitProp?.(value);
		onBlurProp?.(prevValue);
	}, [value, onSubmitProp, onBlurProp, prevValue]);

	useEffect(() => {
		if (isEditing) return;
		// https://bugzilla.mozilla.org/show_bug.cgi?id=559561
		const inputEl = inputRef.current;
		if (inputEl?.ownerDocument.activeElement === inputEl) {
			inputEl?.blur();
		}
	}, [isEditing]);

	const onChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setValue(event.currentTarget.value);
		},
		[setValue]
	);

	const onKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			const eventKey = event.key;

			const keyMap: Record<string, React.KeyboardEventHandler> = {
				Escape: onCancel,
				Enter: (event) => {
					if (!event.shiftKey && !event.metaKey) {
						onSubmit();
					}
				}
			};

			const action = keyMap[eventKey];

			if (action) {
				event.preventDefault();
				action(event);
			}
		},
		[onCancel, onSubmit]
	);

	const onKeyDownWithoutSubmit = useCallback(
		(event: React.KeyboardEvent) => {
			const eventKey = event.key;

			const keyMap: Record<string, React.KeyboardEventHandler> = {
				Escape: onCancel
			};

			const action = keyMap[eventKey];

			if (action) {
				event.preventDefault();
				action(event);
			}
		},
		[onCancel]
	);

	const isValueEmpty = useMemo(() => value.length === 0, [value]);

	const onBlur = useCallback(
		(event: React.FocusEvent) => {
			if (!isEditing) return;
			const doc = event.currentTarget.ownerDocument;
			const relatedTarget = (event.relatedTarget ??
				doc.activeElement) as HTMLElement;
			const targetIsCancel = contains(
				cancelButtonRef.current,
				relatedTarget
			);
			const targetIsSubmit = contains(
				submitButtonRef.current,
				relatedTarget
			);
			const isValidBlur = !targetIsCancel && !targetIsSubmit;

			if (isValidBlur) {
				if (submitOnBlur) {
					onSubmit();
				} else {
					onCancel();
				}
			}
		},
		[submitOnBlur, onSubmit, onCancel, isEditing]
	);

	const getRootProps: PropGetter = useCallback(
		(props = {}, ref = null) => {
			return {
				...props,
				...htmlProps,
				"data-editable-state": isEditing ? "editing" : "view",
				ref
			};
		},
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		[htmlProps, isEditing]
	);

	const getPreviewProps: PropGetter = useCallback(
		(props = {}, ref = null) => {
			const tabIndex =
				isInteractive && isPreviewFocusable ? 0 : undefined;
			return {
				...props,
				ref: mergeRefs(ref, previewRef),
				children: isValueEmpty ? placeholder : value,
				hidden: isEditing,
				"aria-disabled": ariaAttr(isDisabled),
				tabIndex,
				onFocus: callAllHandlers(
					props.onFocus,
					useDoubleClick ? undefined : onEdit,
					useDoubleClick ? undefined : onUpdatePrevValue
				),
				onDoubleClick: callAllHandlers(
					props.onDoubleClick,
					useDoubleClick ? onEdit : undefined,
					useDoubleClick ? onUpdatePrevValue : undefined
				)
			};
		},
		[
			isDisabled,
			isEditing,
			isInteractive,
			isPreviewFocusable,
			isValueEmpty,
			onEdit,
			useDoubleClick,
			onUpdatePrevValue,
			placeholder,
			value
		]
	);

	const getInputProps: PropGetter = useCallback(
		(props = {}, ref = null) => ({
			...props,
			hidden: !isEditing,
			placeholder,
			ref: mergeRefs(ref, inputRef),
			disabled: isDisabled,
			"aria-disabled": ariaAttr(isDisabled),
			value,
			onBlur: callAllHandlers(props.onBlur, onBlur),
			onChange: callAllHandlers(props.onChange, onChange),
			onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown),
			onFocus: callAllHandlers(props.onFocus, onUpdatePrevValue)
		}),
		[
			isDisabled,
			isEditing,
			onBlur,
			onChange,
			onKeyDown,
			onUpdatePrevValue,
			placeholder,
			value
		]
	);

	const getTextareaProps: PropGetter = useCallback(
		(props = {}, ref = null) => ({
			...props,
			hidden: !isEditing,
			placeholder,
			ref: mergeRefs(ref, inputRef),
			disabled: isDisabled,
			"aria-disabled": ariaAttr(isDisabled),
			value,
			onBlur: callAllHandlers(props.onBlur, onBlur),
			onChange: callAllHandlers(props.onChange, onChange),
			onKeyDown: callAllHandlers(props.onKeyDown, onKeyDownWithoutSubmit),
			onFocus: callAllHandlers(props.onFocus, onUpdatePrevValue)
		}),
		[
			isDisabled,
			isEditing,
			onBlur,
			onChange,
			onKeyDownWithoutSubmit,
			onUpdatePrevValue,
			placeholder,
			value
		]
	);

	const getEditButtonProps: PropGetter = useCallback(
		(props = {}, ref = null) => ({
			"aria-label": "Edit",
			...props,
			children: props.children || "Edit",
			type: "button",
			onClick: callAllHandlers(props.onClick, onEdit),
			ref: mergeRefs(ref, editButtonRef),
			disabled: isDisabled
		}),
		[onEdit, isDisabled]
	);

	const getSubmitButtonProps: PropGetter = useCallback(
		(props = {}, ref = null) => ({
			...props,
			children: props.children || "Submit",
			"aria-label": "Submit",
			ref: mergeRefs(submitButtonRef, ref),
			type: "button",
			onClick: callAllHandlers(props.onClick, onSubmit),
			disabled: isDisabled
		}),
		[onSubmit, isDisabled]
	);

	const getCancelButtonProps: PropGetter = useCallback(
		(props = {}, ref = null) => ({
			"aria-label": "Cancel",
			id: "cancel",
			...props,
			children: props.children || "Cancel",
			ref: mergeRefs(cancelButtonRef, ref),
			type: "button",
			onClick: callAllHandlers(props.onClick, onCancel),
			disabled: isDisabled
		}),
		[onCancel, isDisabled]
	);

	return {
		isEditing,
		isDisabled,
		isValueEmpty,
		value,
		onEdit,
		onCancel,
		onSubmit,
		getPreviewProps,
		getInputProps,
		getTextareaProps,
		getEditButtonProps,
		getSubmitButtonProps,
		getCancelButtonProps,
		getRootProps
	};
}

export type UseEditableReturn = ReturnType<typeof useEditable>;
