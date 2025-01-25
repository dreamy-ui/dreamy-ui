import { createDescendantContext } from "@/components/descendant";
import type { PopoverProps } from "@/components/popover";
import {
	useControllable,
	type useControllableProps,
	useSafeLayoutEffect
} from "@/hooks";
import { type ReactRef, mergeRefs } from "@/hooks/use-merge-refs";
import { useReducedMotion } from "@/provider";
import { type PropGetter, callAllHandlers } from "@/utils";
import { ariaAttr, dataAttr } from "@/utils/attr";
import { useDOMRef } from "@/utils/dom";
import { nextTick } from "@/utils/ticks";
import type { HTMLDreamProps } from "@/utils/types";
import { cx } from "@dreamy-ui/system/css";
import {
	type KeyboardEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState
} from "react";
import { flushSync } from "react-dom";
import type { UserFeedbackProps } from "../input/input";
import { useSelectContext } from "./select-context";

export interface UseSelectProps<T extends boolean>
	extends UserFeedbackProps,
		useControllableProps {
	children?: ReactNode;
	/**
	 * Ref to the DOM node.
	 */
	ref?: ReactRef<HTMLSelectElement>;
	/**
	 * If `true`, the select will allow multiple selections.
	 * @default false
	 */
	isMultiple?: T;
	/**
	 * The strategy to indicate the selected state.
	 * @default "both"
	 */
	selectedStrategy?: "checkmark" | "background" | "both";
	/**
	 * The icon that represents the select open state. Usually a chevron icon.
	 */
	selectorIcon?: ReactNode;
	/**
	 * Callback fired when the select menu is closed.
	 */
	onClose?: () => void;
	/**
	 * Default value for the select.
	 */
	defaultValue?: T extends true ? string[] : string;
	/**
	 * Controlled value for the select.
	 */
	value?: T extends true ? string[] : string;
	/**
	 * Handler that is called when the selection changes.
	 */
	onChangeValue?: (value: T extends true ? string[] : string) => void;
	/**
	 * Native handler that is called when the selection changes.
	 */
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	/**
	 * The name of the select, used for html form submission.
	 */
	name?: string;
	/**
	 * Whether to enable autocomplete.
	 * @default "off"
	 */
	autoComplete?: "on" | "off";
	/**
	 * Whether to disable animation.
	 * @default false
	 */
	reduceMotion?: boolean;
	/**
	 * The props to be passed to the popover.
	 */
	popoverProps?: PopoverProps;
	/**
	 * Whether to close the popover when an item is selected.
	 * @default true for non-multiple select, false for multiple select
	 */
	closeOnSelect?: boolean;
	/**
	 * Whether to show the clear button.
	 * @default false
	 */
	isClearable?: boolean;
}

export function useSelect<T extends boolean>(props: UseSelectProps<T>) {
	const globalReduceMotion = useReducedMotion();

	const {
		reduceMotion = globalReduceMotion ?? false,
		isOpen: isOpenProp,
		onOpen: onOpenProp,
		onClose: onCloseProp,
		defaultIsOpen: defaultIsOpenProp,
		ref,
		isMultiple = false,
		name,
		closeOnSelect = !isMultiple,
		selectedStrategy = "both",
		isInvalid,
		onChangeValue,
		onChange,
		popoverProps,
		isRequired,
		isDisabled,
		defaultValue,
		value,
		autoComplete = "off",
		isClearable,
		...rest
	} = props;

	const descendants = useSelectDescendants();

	const { isOpen, onOpen, onClose, onToggle } = useControllable({
		isOpen: isOpenProp,
		defaultIsOpen: defaultIsOpenProp,
		onOpen: onOpenProp,
		onClose: onCloseProp
	});

	/**
	 * Id for the hidden select key mapping.
	 */
	const id = useId();

	const domRef = useDOMRef(ref);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);

	let [selectedKeys, setSelectedKeys] = useState<string[]>(
		defaultValue
			? isMultiple
				? (defaultValue as unknown as string[])
				: [defaultValue as string]
			: []
	);
	if (typeof value !== "undefined") {
		selectedKeys = isMultiple
			? (value as unknown as string[])
			: [value as string];
	}

	const [focusedIndex, setFocusedIndex] = useState(-1);

	useSafeLayoutEffect(() => {
		if (!domRef.current?.value) return;

		setSelectedKeys([domRef.current.value]);
	}, [domRef.current]);

	const [contentWidth, setContentWidth] = useState(0);

	// apply the same with to the popover as the select
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		function updateContentWidth() {
			if (popoverRef.current && triggerRef.current) {
				nextTick(() => {
					if (!triggerRef.current) return;

					const { width } =
						triggerRef.current.getBoundingClientRect();

					if (width !== contentWidth) {
						setContentWidth(width);
					}
				});
			}
		}

		updateContentWidth();

		window.addEventListener("resize", updateContentWidth);
		return () => {
			window.removeEventListener("resize", updateContentWidth);
		};
	}, [isOpen]);

	const handleItemChange = useCallback(
		(value: string) => {
			if (domRef.current) {
				const newValues = isMultiple
					? selectedKeys.includes(value)
						? selectedKeys.filter((v) => v !== value)
						: [...selectedKeys, value]
					: [value];

				if (isMultiple) {
					flushSync(() => {
						setSelectedKeys(newValues);
					});
				}

				if (!isMultiple) {
					domRef.current.value = newValues[0];
				}
				domRef.current?.dispatchEvent(
					new Event("change", { bubbles: true })
				);
			}
			if (closeOnSelect) {
				onClose();
			}
		},
		[closeOnSelect, onClose, domRef.current, isMultiple, selectedKeys]
	);

	const getRootProps: PropGetter = useCallback(
		(props, ref) => {
			return {
				"data-slot": "root",
				"data-open": dataAttr(isOpen),
				"data-selected-strategy": selectedStrategy,
				ref,
				...props,
				className: cx(props?.className, "group")
			};
		},
		[isOpen, selectedStrategy]
	);

	const [isTriggerFocused, setIsTriggerFocused] = useState(false);

	const getTriggerProps: PropGetter = useCallback(
		(props, ref) => {
			const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
				if (!isOpen || !isTriggerFocused) return;

				function scrollToFocusedItem(index: number) {
					if (index === -1) return;
					const item = descendants.item(index);
					if (!item) return;
					item.node.scrollIntoView({ block: "nearest" });
				}

				switch (e.key) {
					case "ArrowUp":
						e.preventDefault();
						if (focusedIndex === -1) {
							setFocusedIndex(0);
						} else {
							setFocusedIndex((prev) => {
								scrollToFocusedItem(prev - 1);
								return prev - 1;
							});
						}
						break;
					case "ArrowDown":
						e.preventDefault();
						setFocusedIndex((prev) => {
							const val =
								prev + 1 >= descendants.count()
									? prev
									: prev + 1;
							scrollToFocusedItem(val);
							return val;
						});
						break;
					case "Enter":
						if (focusedIndex === -1) return;
						e.preventDefault();
						// biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
						const value = (descendants.item(focusedIndex) as any)
							.node.value;
						handleItemChange(value);
						break;
					case "Escape":
						if (popoverProps?.closeOnEsc ?? true) {
							onClose();
						}
						break;
				}
			};

			return {
				"data-slot": "trigger",
				"aria-invalid": ariaAttr(isInvalid),
				"data-invalid": dataAttr(isInvalid),
				ref: mergeRefs(triggerRef, ref),
				"data-placeholder-shown": dataAttr(selectedKeys.length === 0),
				disabled: isDisabled,
				type: "button",
				...props,
				onFocus: callAllHandlers(props?.onFocus, () => {
					setIsTriggerFocused(true);
				}),
				onBlur: callAllHandlers(props?.onBlur, () => {
					setIsTriggerFocused(false);
				}),
				onKeyDown: callAllHandlers(props?.onKeyDown, onKeyDown)
			};
		},
		[
			isInvalid,
			selectedKeys.length,
			focusedIndex,
			descendants,
			isOpen,
			isDisabled,
			isTriggerFocused,
			popoverProps,
			onClose,
			handleItemChange
		]
	);

	const getContentProps: PropGetter = useCallback(
		(props, ref) => {
			return {
				ref: mergeRefs(popoverRef, ref),
				...props,
				style: {
					...props?.style,
					width: contentWidth + "px"
				},
				rootProps: {
					style: {
						zIndex: "var(--z-index-dropdown)"
					}
				}
			};
		},
		[contentWidth]
	);

	const getItemProps: PropGetter = useCallback(
		(props, ref) => {
			return {
				ref: mergeRefs(ref),
				"data-slot": "item",
				...props,
				type: "button",
				onClick: callAllHandlers(props?.onClick, () => {
					const value = props!.value;
					handleItemChange(value);

					if (triggerRef.current) {
						requestAnimationFrame(() => {
							triggerRef.current?.focus();
						});
					}
				})
			};
		},
		[handleItemChange]
	);

	const getHiddenSelectProps: PropGetter = useCallback(
		(props = {}) =>
			({
				triggerRef,
				domRef,
				placeholder: props.placeholder,
				name,
				isRequired,
				autoComplete,
				isDisabled,
				selectedKeys,
				...props
			} as const),
		[domRef, name, isRequired, autoComplete, isDisabled, selectedKeys]
	);

	const getClearButtonProps: PropGetter = useCallback((props, ref) => {
		return {
			ref,
			...props,
			type: "button",
			onClick: callAllHandlers(props?.onClick, (e) => {
				e.preventDefault();
				e.stopPropagation();
				setSelectedKeys([]);
			})
		};
	}, []);

	return {
		name,
		triggerRef,
		reduceMotion,
		isInvalid,
		isDisabled,
		isRequired,
		selectedKeys,
		focusedIndex,
		selectedStrategy,
		setSelectedKeys,
		setFocusedIndex,
		isOpen,
		onOpen,
		onClose,
		onToggle,
		isMultiple,
		onChange,
		onChangeValue,
		isClearable,
		defaultValue,
		id,
		getRootProps,
		getHiddenSelectProps,
		getTriggerProps,
		getContentProps,
		getItemProps,
		getClearButtonProps,
		popoverRef,
		descendants,
		rest
	};
}

export type UseSelectReturn = ReturnType<typeof useSelect>;

export const [
	SelectDescendantsProvider,
	useSelectDescendantsContext,
	useSelectDescendants,
	useSelectDescendant
] = createDescendantContext<HTMLButtonElement>();

export interface UseSelectItemProps extends HTMLDreamProps<"button"> {
	isDisabled?: boolean;
	value: string;
	textValue?: ReactNode;
}

/**
 * @internal
 */
export function useSelectItem(
	props: UseSelectItemProps,
	ref: React.Ref<any> = null
): any {
	const { getItemProps, focusedIndex, setFocusedIndex, selectedKeys } =
		useSelectContext();
	const { index, register } = useSelectDescendant(
		{
			disabled: props?.isDisabled || props?.disabled || false
		},
		{
			textValue: props.children
		}
	);

	return getItemProps({
		...props,
		ref: mergeRefs(register, ref),
		index,
		"data-focused": dataAttr(focusedIndex === index),
		"data-selected": dataAttr(selectedKeys.includes(props.value)),
		onPointerEnter: callAllHandlers(props?.onPointerEnter, () => {
			setFocusedIndex(index);
		})
	});
}
