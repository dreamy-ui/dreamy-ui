"use client";

import { createContext } from "@dreamy-ui/react";
import { callAllHandlers } from "@dreamy-ui/react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PopoverProps } from "./popover";

export interface AutocompleteItem {
    value: string;
    label: string;
}

export interface UseAutocompleteProps {
    /**
     * The list of items to display in the autocomplete dropdown.
     */
    items: AutocompleteItem[];
    /**
     * The currently selected value (controlled).
     */
    value?: string | null;
    /**
     * The default selected value (uncontrolled).
     */
    defaultValue?: string;
    /**
     * Called when the selected value changes.
     */
    onChangeValue?: (value: string | null) => void;
    /**
     * Custom filter function for items based on the search query.
     * Receives each item and the current query; return `true` to include the item.
     * @default Case-insensitive substring match on item.label
     */
    filterFn?: (item: AutocompleteItem, query: string) => boolean;
    /**
     * Whether to show a clear button when a value is selected.
     * @default true
     */
    isClearable?: boolean;
    /**
     * Whether the dropdown is open (controlled).
     */
    isOpen?: boolean;
    /**
     * Called when the dropdown opens.
     */
    onOpen?: () => void;
    /**
     * Called when the dropdown closes.
     */
    onClose?: () => void;
    /**
     * Props forwarded to the internal Popover component.
     */
    popoverProps?: Partial<PopoverProps>;
}

function defaultFilterFn(item: AutocompleteItem, query: string): boolean {
    return item.label.toLowerCase().includes(query.toLowerCase());
}

function mergeRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
    return (value) => {
        for (const ref of refs) {
            if (typeof ref === "function") {
                ref(value);
            } else if (ref != null) {
                (ref as React.MutableRefObject<T | null>).current = value;
            }
        }
    };
}

export function useAutocomplete(props: UseAutocompleteProps) {
    const {
        items,
        value: controlledValue,
        defaultValue,
        onChangeValue,
        filterFn = defaultFilterFn,
        isClearable = true,
        isOpen: controlledIsOpen,
        onOpen: onOpenProp,
        onClose: onCloseProp,
        popoverProps
    } = props;

    const controlRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [internalSelectedValue, setInternalSelectedValue] = useState<string | null>(
        defaultValue ?? null
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [contentWidth, setContentWidth] = useState<number | undefined>(undefined);

    const isValueControlled = controlledValue !== undefined;
    const selectedValue = isValueControlled ? (controlledValue ?? null) : internalSelectedValue;

    const isOpenControlled = controlledIsOpen !== undefined;
    const isOpen = isOpenControlled ? controlledIsOpen : internalIsOpen;

    const selectedLabel = items.find((item) => item.value === selectedValue)?.label ?? "";

    const filteredItems = searchQuery
        ? items.filter((item) => filterFn(item, searchQuery))
        : items;

    // Reset focused index whenever the filtered list changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset
    useEffect(() => {
        setFocusedIndex(-1);
    }, [searchQuery]);

    // Scroll focused item into view
    useEffect(() => {
        if (focusedIndex === -1 || !contentRef.current) return;
        const options = contentRef.current.querySelectorAll<HTMLElement>('[role="option"]');
        options[focusedIndex]?.scrollIntoView({ block: "nearest" });
    }, [focusedIndex]);

    // Keep dropdown width in sync with the control width
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
    useEffect(() => {
        function updateWidth() {
            if (controlRef.current) {
                setContentWidth(controlRef.current.getBoundingClientRect().width);
            }
        }
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [isOpen]);

    const onOpen = useCallback(() => {
        if (!isOpenControlled) setInternalIsOpen(true);
        onOpenProp?.();
    }, [isOpenControlled, onOpenProp]);

    const onClose = useCallback(() => {
        if (!isOpenControlled) setInternalIsOpen(false);
        onCloseProp?.();
        setSearchQuery("");
        setFocusedIndex(-1);
    }, [isOpenControlled, onCloseProp]);

    const selectItem = useCallback(
        (value: string) => {
            if (!isValueControlled) setInternalSelectedValue(value);
            onChangeValue?.(value);
            onClose();
            // Return focus to the input after selection
            requestAnimationFrame(() => inputRef.current?.focus());
        },
        [isValueControlled, onChangeValue, onClose]
    );

    const clearItem = useCallback(() => {
        if (!isValueControlled) setInternalSelectedValue(null);
        onChangeValue?.(null);
        setSearchQuery("");
        setFocusedIndex(-1);
        requestAnimationFrame(() => inputRef.current?.focus());
    }, [isValueControlled, onChangeValue]);

    // ─── Prop Getters ────────────────────────────────────────────────────────────

    const getRootProps = useCallback(
        (props: Record<string, any> = {}) => ({
            "data-open": isOpen ? "" : undefined,
            ...props,
            ref: controlRef
        }),
        [isOpen]
    );

    const getInputProps = useCallback(
        (props: Record<string, any> = {}, ref?: React.Ref<HTMLInputElement>) => ({
            pe: "var(--ac-pe)",
            ...props,
            ref: mergeRefs(inputRef, ref ?? null),
            value: isOpen ? searchQuery : selectedLabel,
            role: "combobox",
            "aria-expanded": isOpen,
            "aria-haspopup": "listbox",
            autoComplete: "off",
            onChange: callAllHandlers(
                props.onChange,
                (e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchQuery(e.target.value);
                    if (!isOpen) onOpen();
                }
            ),
            onFocus: callAllHandlers(props.onFocus, () => {
                if (!isOpen) onOpen();
            }),
            onBlur: callAllHandlers(props.onBlur, () => {
                onClose();
            }),
            onKeyDown: callAllHandlers(
                props.onKeyDown,
                (e: React.KeyboardEvent<HTMLInputElement>) => {
                    switch (e.key) {
                        case "ArrowDown":
                            e.preventDefault();
                            if (!isOpen) {
                                onOpen();
                                break;
                            }
                            setFocusedIndex((prev) =>
                                prev + 1 >= filteredItems.length ? prev : prev + 1
                            );
                            break;
                        case "ArrowUp":
                            e.preventDefault();
                            setFocusedIndex((prev) => (prev <= 0 ? 0 : prev - 1));
                            break;
                        case "Enter":
                            e.preventDefault();
                            if (focusedIndex >= 0 && focusedIndex < filteredItems.length) {
                                selectItem(filteredItems[focusedIndex].value);
                            }
                            break;
                        case "Escape":
                            e.preventDefault();
                            onClose();
                            break;
                        case "Tab":
                            onClose();
                            break;
                    }
                }
            )
        }),
        [isOpen, searchQuery, selectedLabel, filteredItems, focusedIndex, onOpen, onClose, selectItem]
    );

    const getContentProps = useCallback(
        (props: Record<string, any> = {}, ref?: React.Ref<HTMLDivElement>) => ({
            role: "listbox",
            ...props,
            ref: mergeRefs(contentRef, ref ?? null),
            // Prevent the input from losing focus when the user clicks inside the
            // dropdown — without this, blur fires on the input before the item click
            // registers, which closes the list and swallows the selection.
            onMouseDown: (e: React.MouseEvent) => {
                e.preventDefault();
                props.onMouseDown?.(e);
            },
            style: {
                ...props?.style,
                width: contentWidth ? `${contentWidth}px` : undefined
            },
            rootProps: {
                style: { zIndex: "var(--z-index-dropdown)" }
            }
        }),
        [contentWidth]
    );

    const getItemProps = useCallback(
        (props: Record<string, any> = {}, ref?: React.Ref<HTMLButtonElement>) => ({
            type: "button" as const,
            role: "option",
            ...props,
            ref,
            "aria-selected": selectedValue === props.value,
            "data-selected": selectedValue === props.value ? "" : undefined,
            "data-focused": focusedIndex === props.index ? "" : undefined,
            onClick: callAllHandlers(props.onClick, () => selectItem(props.value)),
            onPointerEnter: callAllHandlers(props.onPointerEnter, () => {
                setFocusedIndex(props.index ?? -1);
            })
        }),
        [selectedValue, focusedIndex, selectItem]
    );

    const getClearButtonProps = useCallback(
        (props: Record<string, any> = {}, ref?: React.Ref<HTMLButtonElement>) => ({
            type: "button" as const,
            "aria-label": "Clear selection",
            ...props,
            ref,
            onClick: callAllHandlers(props.onClick, (e: React.MouseEvent) => {
                e.stopPropagation();
                clearItem();
            })
        }),
        [clearItem]
    );

    const getPopoverRootProps = useCallback(
        () => ({
            hasArrow: false,
            // Keep focus on the input when the dropdown opens so the user can keep typing.
            initialFocusRef: inputRef,
            isOpen,
            lazyBehavior: "keepMounted" as const,
            onClose,
            onOpen,
            placement: "bottom" as const,
            ...popoverProps
        }),
        [isOpen, onClose, onOpen, popoverProps]
    );

    return {
        // State
        isOpen,
        selectedValue,
        selectedLabel,
        searchQuery,
        filteredItems,
        focusedIndex,
        isClearable,
        // Refs
        inputRef,
        // Prop getters
        getRootProps,
        getInputProps,
        getContentProps,
        getItemProps,
        getClearButtonProps,
        getPopoverRootProps
    };
}

export type UseAutocompleteReturn = ReturnType<typeof useAutocomplete>;

interface AutocompleteContextValue
    extends Omit<UseAutocompleteReturn, "getRootProps" | "getPopoverRootProps"> {
    size: "xs" | "sm" | "md" | "lg";
    variant: string;
}

export const [AutocompleteProvider, useAutocompleteContext] =
    createContext<AutocompleteContextValue>({
        strict: true,
        name: "AutocompleteContext"
    });
