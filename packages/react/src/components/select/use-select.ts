import { useControllable, type useControllableProps, useSafeLayoutEffect } from "@/hooks";
import { type ReactRef, mergeRefs } from "@/hooks/use-merge-refs";
import { createContext, useReducedMotion } from "@/provider";
import { type PropGetter, callAllHandlers, cx } from "@/utils";
import { ariaAttr, dataAttr } from "@/utils/attr";
import { useDOMRef } from "@/utils/dom";
import { nextTick } from "@/utils/ticks";
import {
    type ComponentPropsWithoutRef,
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
    type RefObject,
    useCallback,
    useEffect,
    useId,
    useRef,
    useState
} from "react";
import { flushSync } from "react-dom";
import { type UserFeedbackProps, useFieldProps } from "../field";
import type { FocusableElement } from "@/utils/types";

interface SelectContext extends Omit<UseSelectReturn, "rest"> {
    renderItem?: (item: SelectOption) => ReactNode;
}

export const [SelectProvider, useSelectContext] = createContext<SelectContext>({
    name: "SelectContext",
    hookName: "useSelectContext",
    providerName: "Select"
});

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface UseSelectProps<T extends boolean, P extends Record<string, any>>
    extends UserFeedbackProps,
        useControllableProps {
    children?: ReactNode;
    /**
     * Options to display in the select.
     */
    items: SelectOption[];
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
    popoverProps?: P;
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
    /**
     * Z-index applied to the select dropdown content positioner.
     * Accepts a CSS value such as `var(--z-index-popover)`.
     * @default "var(--z-index-dropdown)"
     */
    contentZIndex?: string;
    /**
     * Props forwarded to the hidden native `<select>` element used for form submission and autofill.
     */
    hiddenSelectProps?: ComponentPropsWithoutRef<"select">;
}

export function useSelect<T extends boolean, P extends Record<string, any>>(
    props: UseSelectProps<T, P>
) {
    const globalReduceMotion = useReducedMotion();

    const {
        reduceMotion = globalReduceMotion ?? false,
        isOpen: isOpenProp,
        onOpen: onOpenProp,
        onClose: onCloseProp,
        defaultIsOpen: defaultIsOpenProp,
        ref,
        items,
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
        contentZIndex = "var(--z-index-dropdown)",
        hiddenSelectProps,
        ...rest
    } = props;

    const {
        isDisabled: isDisabledField = false,
        isRequired: isRequiredField = false,
        isInvalid: isInvalidField = false,
        id: fieldId,
        onBlur: onBlurField,
        onFocus: onFocusField,
        "aria-describedby": ariaDescribedByField
    } = useFieldProps(props);

    const resolvedIsDisabled = isDisabled ?? isDisabledField;
    const resolvedIsRequired = isRequired ?? isRequiredField;
    const resolvedIsInvalid = isInvalid ?? isInvalidField;

    const { isOpen, onOpen, onClose, onToggle } = useControllable({
        isOpen: isOpenProp,
        defaultIsOpen: defaultIsOpenProp,
        onOpen: onOpenProp,
        onClose: onCloseProp
    });

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
        selectedKeys = isMultiple ? (value as unknown as string[]) : [value as string];
    }

    const [focusedIndex, setFocusedIndex] = useState(-1);

    useSafeLayoutEffect(() => {
        if (!domRef.current?.value) return;

        setSelectedKeys([domRef.current.value]);
    }, [domRef.current]);

    const [contentWidth, setContentWidth] = useState(0);

    useSafeLayoutEffect(() => {
        function updateContentWidth() {
            const trigger = triggerRef.current;
            if (!trigger) return;

            nextTick(() => {
                const el = triggerRef.current;
                if (!el) return;

                const { width } = el.getBoundingClientRect();
                if (width > 0) {
                    setContentWidth((prev) => (prev !== width ? width : prev));
                }
            });
        }

        updateContentWidth();

        window.addEventListener("resize", updateContentWidth);
        return () => {
            window.removeEventListener("resize", updateContentWidth);
        };
    }, [isOpen, items]);

    const scrollToFocusedItem = useCallback((index: number) => {
        if (index === -1 || !popoverRef.current) return;

        const itemEl = popoverRef.current.querySelector(`[data-index="${index}"]`);
        itemEl?.scrollIntoView({ block: "nearest" });
    }, []);

    const getDefaultFocusedIndex = useCallback(() => {
        if (items.length === 0) return -1;

        if (selectedKeys.length > 0) {
            const selectedIndex = items.findIndex(
                (item) => selectedKeys.includes(item.value) && !item.disabled
            );
            if (selectedIndex >= 0) return selectedIndex;
        }

        return 0;
    }, [items, selectedKeys]);

    useSafeLayoutEffect(() => {
        if (!isOpen) {
            setFocusedIndex(-1);
            return;
        }

        const defaultIndex = getDefaultFocusedIndex();
        if (defaultIndex >= 0) {
            setFocusedIndex(defaultIndex);
            nextTick(() => scrollToFocusedItem(defaultIndex));
        }
    }, [isOpen, getDefaultFocusedIndex, scrollToFocusedItem]);

    const openSelect = useCallback(() => {
        onOpen();
        const defaultIndex = getDefaultFocusedIndex();
        if (defaultIndex >= 0) {
            setFocusedIndex(defaultIndex);
        }
    }, [onOpen, getDefaultFocusedIndex]);

    const handleItemChange = useCallback(
        (itemValue: string) => {
            if (domRef.current) {
                const newValues = isMultiple
                    ? selectedKeys.includes(itemValue)
                        ? selectedKeys.filter((v) => v !== itemValue)
                        : [...selectedKeys, itemValue]
                    : [itemValue];

                if (isMultiple) {
                    flushSync(() => {
                        setSelectedKeys(newValues);
                    });
                } else {
                    setSelectedKeys(newValues);
                }

                if (!isMultiple) {
                    domRef.current.value = newValues[0];
                }
                domRef.current?.dispatchEvent(new Event("change", { bubbles: true }));

                onChangeValue?.((isMultiple ? newValues : newValues[0]) as any);
            } else {
                const newValues = isMultiple
                    ? selectedKeys.includes(itemValue)
                        ? selectedKeys.filter((v) => v !== itemValue)
                        : [...selectedKeys, itemValue]
                    : [itemValue];

                setSelectedKeys(newValues);
                onChangeValue?.((isMultiple ? newValues : newValues[0]) as any);
            }

            if (closeOnSelect) {
                onClose();
            }
        },
        [closeOnSelect, onClose, domRef, isMultiple, selectedKeys, onChangeValue]
    );

    const getRootProps: PropGetter = useCallback(
        (props = {}) => {
            const { ref, className, ...rest } = props;
            return {
                ...rest,
                "data-slot": "root",
                "data-open": dataAttr(isOpen),
                "data-selected-strategy": selectedStrategy,
                ref,
                className: cx(className, "group")
            };
        },
        [isOpen, selectedStrategy]
    );

    const [isTriggerFocused, setIsTriggerFocused] = useState(false);

    const getTriggerProps: PropGetter = useCallback(
        (props = {}) => {
            const {
                ref,
                id: propsId,
                onFocus: propsOnFocus,
                onBlur: propsOnBlur,
                onKeyDown: propsOnKeyDown,
                ...rest
            } = props;
            const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
                if (resolvedIsDisabled || document.activeElement !== triggerRef.current) return;

                const lastIndex = items.length - 1;

                function getActiveIndex() {
                    return focusedIndex >= 0 ? focusedIndex : getDefaultFocusedIndex();
                }

                switch (e.key) {
                    case " ":
                        e.preventDefault();
                        if (isOpen) {
                            onClose();
                        } else {
                            openSelect();
                        }
                        break;
                    case "Enter": {
                        e.preventDefault();
                        if (!isOpen) {
                            openSelect();
                            break;
                        }
                        if (items.length === 0) break;
                        const index = getActiveIndex();
                        const item = items[index];
                        if (item && !item.disabled) {
                            handleItemChange(item.value);
                        }
                        break;
                    }
                    case "ArrowDown":
                        e.preventDefault();
                        if (!isOpen) {
                            openSelect();
                            break;
                        }
                        if (lastIndex < 0) break;
                        setFocusedIndex((prev) => {
                            const start = prev < 0 ? getDefaultFocusedIndex() : prev;
                            const next = start + 1 > lastIndex ? start : start + 1;
                            scrollToFocusedItem(next);
                            return next;
                        });
                        break;
                    case "ArrowUp":
                        e.preventDefault();
                        if (!isOpen) {
                            openSelect();
                            if (lastIndex >= 0) {
                                setFocusedIndex(lastIndex);
                                scrollToFocusedItem(lastIndex);
                            }
                            break;
                        }
                        if (lastIndex < 0) break;
                        setFocusedIndex((prev) => {
                            const start = prev < 0 ? getDefaultFocusedIndex() : prev;
                            const next = Math.max(0, start - 1);
                            scrollToFocusedItem(next);
                            return next;
                        });
                        break;
                    case "Escape":
                        if (isOpen && (popoverProps?.closeOnEsc ?? true)) {
                            e.preventDefault();
                            onClose();
                        }
                        break;
                }
            };

            return {
                ...rest,
                "data-slot": "trigger",
                id: propsId ?? fieldId,
                "aria-invalid": ariaAttr(resolvedIsInvalid),
                "aria-required": ariaAttr(resolvedIsRequired),
                "aria-describedby": ariaDescribedByField,
                "aria-expanded": isOpen,
                "aria-haspopup": "listbox",
                "data-invalid": dataAttr(resolvedIsInvalid),
                ref: mergeRefs(triggerRef, ref),
                "data-placeholder-shown": dataAttr(selectedKeys.length === 0),
                disabled: resolvedIsDisabled,
                type: "button",
                onFocus: callAllHandlers(propsOnFocus, onFocusField, () => {
                    setIsTriggerFocused(true);
                }),
                onBlur: callAllHandlers(propsOnBlur, onBlurField, () => {
                    setIsTriggerFocused(false);
                }),
                onKeyDown: callAllHandlers(propsOnKeyDown, onKeyDown)
            };
        },
        [
            resolvedIsInvalid,
            resolvedIsRequired,
            ariaDescribedByField,
            fieldId,
            selectedKeys.length,
            focusedIndex,
            items,
            isOpen,
            resolvedIsDisabled,
            popoverProps,
            onClose,
            openSelect,
            onFocusField,
            onBlurField,
            handleItemChange,
            scrollToFocusedItem,
            getDefaultFocusedIndex
        ]
    );

    const getContentProps = useCallback(
        (props: Record<string, any> = {}) => {
            const { ref, onMouseDown, style, ...rest } = props;
            return {
                ...rest,
                role: "listbox",
                ref: mergeRefs(popoverRef, ref),
                onMouseDown: (e: MouseEvent) => {
                    e.preventDefault();
                    onMouseDown?.(e);
                },
                style: {
                    ...style,
                    ...(contentWidth > 0
                        ? { width: `${contentWidth}px`, minWidth: `${contentWidth}px` }
                        : {})
                },
                rootProps: {
                    style: {
                        zIndex: contentZIndex
                    }
                }
            } as const;
        },
        [contentWidth, contentZIndex]
    );

    const getItemProps = useCallback(
        (props: Record<string, any> = {}) => {
            const { ref, value, index, disabled, onPointerEnter, onClick, ...rest } = props;
            const isSelected = selectedKeys.includes(value);

            return {
                ...rest,
                ref: mergeRefs(ref),
                "data-slot": "item",
                "data-index": index,
                value,
                disabled,
                type: "button",
                role: "option",
                "aria-selected": isSelected,
                "data-selected-strategy": selectedStrategy,
                "data-focused": dataAttr(focusedIndex === index),
                "data-selected": dataAttr(isSelected),
                onPointerEnter: callAllHandlers(onPointerEnter, () => {
                    setFocusedIndex(index);
                }),
                onClick: callAllHandlers(onClick, () => {
                    if (disabled) return;
                    handleItemChange(value);

                    if (triggerRef.current) {
                        requestAnimationFrame(() => {
                            triggerRef.current?.focus();
                        });
                    }
                })
            };
        },
        [handleItemChange, selectedStrategy, focusedIndex, selectedKeys]
    );

    const getHiddenSelectProps = useCallback(
        (props: Record<string, any> = {}) =>
            ({
                triggerRef,
                domRef,
                placeholder: props.placeholder,
                name,
                isRequired: resolvedIsRequired,
                autoComplete,
                isDisabled: resolvedIsDisabled,
                hiddenSelectProps,
                selectedKeys,
                onChangeValue: onChangeValue as unknown as (value: string | string[]) => void,
                onChange,
                multiple: isMultiple,
                ...props
            }) as const,
        [
            domRef,
            name,
            resolvedIsRequired,
            autoComplete,
            resolvedIsDisabled,
            hiddenSelectProps,
            selectedKeys,
            isMultiple,
            onChangeValue,
            onChange
        ]
    );

    const getClearButtonProps: PropGetter = useCallback((props = {}) => {
        const { ref, onClick, ...rest } = props;
        return {
            "aria-label": "Clear selection",
            ...rest,
            ref,
            type: "button",
            onClick: callAllHandlers(onClick, (e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedKeys([]);
                onChangeValue?.((isMultiple ? [] : "") as any);
            })
        };
    }, [isMultiple, onChangeValue]);

    return {
        name,
        items,
        triggerRef,
        reduceMotion,
        isInvalid: resolvedIsInvalid,
        isDisabled: resolvedIsDisabled,
        isRequired: resolvedIsRequired,
        hiddenSelectProps,
        selectedKeys,
        focusedIndex,
        selectedStrategy,
        setSelectedKeys,
        setFocusedIndex,
        isOpen,
        onOpen: openSelect,
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
        rest
    };
}

export type UseSelectReturn = ReturnType<typeof useSelect<false, any>>;

export interface HiddenSelectProps {
    placeholder: string;
    multiple: boolean;
    autoComplete: string;
    triggerRef: RefObject<FocusableElement | null>;
    domRef: RefObject<HTMLSelectElement | null>;
    hiddenSelectProps?: ComponentPropsWithoutRef<"select">;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onChangeValue?: (value: string | string[]) => void;
}

/**
 * Provides the behavior and accessibility implementation for a hidden `<select>` element, which
 * can be used in combination with `useSelect` to support browser form autofill, mobile form
 * navigation, and native HTML form submission.
 */
export function useHiddenSelect(props: HiddenSelectProps) {
    const {
        selectedKeys,
        setSelectedKeys,
        defaultValue,
        items,
        name,
        isDisabled,
        isRequired,
        onChange,
        onChangeValue,
        isInvalid,
        isMultiple,
        id
    } = useSelectContext();
    const { autoComplete, domRef, hiddenSelectProps } = props;

    useSafeLayoutEffect(() => {
        const el = domRef.current;
        if (!el?.form) return;
        const formResetListener = () => {
            setSelectedKeys(
                defaultValue
                    ? typeof defaultValue === "string"
                        ? [defaultValue]
                        : defaultValue
                    : []
            );
        };
        el.form.addEventListener("reset", formResetListener);
        return () => el.form?.removeEventListener("reset", formResetListener);
    }, []);

    return {
        items,
        selectedKeys,
        id,
        containerProps: {
            "aria-hidden": true,
            "data-a11y-ignore": "aria-hidden-focus"
        },
        selectProps: {
            ...hiddenSelectProps,
            name,
            tabIndex: -1,
            autoComplete,
            disabled: isDisabled,
            required: isRequired,
            "aria-invalid": ariaAttr(isInvalid),
            value: isMultiple ? selectedKeys.map((k: any) => String(k)) : (selectedKeys[0] ?? ""),
            multiple: isMultiple,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                const val = isMultiple
                    ? Array.from(e.target.selectedOptions).map((o) => o.value)
                    : [e.target.value];

                setSelectedKeys(val);
                domRef.current!.value = isMultiple ? val.join(",") : val[0];
                onChangeValue?.((isMultiple ? val : val[0]) as any);
                onChange?.(e);
            }
        }
    };
}
