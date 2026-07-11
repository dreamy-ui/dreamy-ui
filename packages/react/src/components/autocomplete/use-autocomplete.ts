import type { UsePopoverProps } from "@/components/popover";
import type { PositioningProps } from "@/components/popper";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { createContext } from "@/provider";
import { callAllHandlers } from "@/utils";
import { matchSorter } from "match-sorter";
import type React from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

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
     * @default `matchSorter` on the full `items` list keyed by `label` (filtered and ranked)
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
     * Positioning configuration for the dropdown floating element.
     * Controls placement, offset, flip, shift, and more.
     */
    positioning?: PositioningProps;
    /**
     * Additional props forwarded to the internal Popover root (non-positioning).
     */
    popoverProps?: Omit<Partial<UsePopoverProps>, "positioning">;
}

export function useAutocomplete(props: UseAutocompleteProps) {
    const {
        items,
        value: controlledValue,
        defaultValue,
        onChangeValue,
        filterFn,
        isClearable = true,
        isOpen: controlledIsOpen,
        onOpen: onOpenProp,
        onClose: onCloseProp,
        positioning,
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

    const filteredItems = useMemo(() => {
        if (!searchQuery) {
            return items;
        }
        if (!filterFn) {
            return matchSorter(items, searchQuery, {
                keys: ["label"]
            });
        }
        return items.filter((item) => filterFn(item, searchQuery));
    }, [items, searchQuery, filterFn]);

    function getDefaultFocusedIndex(list: AutocompleteItem[], value: string | null): number {
        if (list.length === 0) return -1;

        if (value != null) {
            const selectedIndex = list.findIndex((item) => item.value === value);
            if (selectedIndex >= 0) return selectedIndex;
        }

        return 0;
    }

    // Highlight the selected item (or first match) when the query changes while open
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset
    useEffect(() => {
        if (isOpen && filteredItems.length > 0) {
            setFocusedIndex(getDefaultFocusedIndex(filteredItems, selectedValue));
        }
    }, [searchQuery]);

    // Scroll focused item into view
    useEffect(() => {
        if (focusedIndex < 0 || !contentRef.current) return;
        const options = contentRef.current.querySelectorAll<HTMLElement>('[role="option"]');
        options[focusedIndex]?.scrollIntoView({ block: "nearest" });
    }, [focusedIndex]);

    // Keep dropdown width in sync with the control width
    // biome-ignore lint/correctness/useExhaustiveDependencies: remeasure when layout may change
    useEffect(() => {
        function updateWidth() {
            if (!controlRef.current) return;

            const { width } = controlRef.current.getBoundingClientRect();
            if (width > 0) {
                setContentWidth((prev) => (prev !== width ? width : prev));
            }
        }
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [isOpen, items]);

    const onOpen = useCallback(() => {
        if (!isOpenControlled) setInternalIsOpen(true);
        onOpenProp?.();
        const defaultIndex = getDefaultFocusedIndex(filteredItems, selectedValue);
        if (defaultIndex >= 0) {
            setFocusedIndex(defaultIndex);
        }
    }, [isOpenControlled, onOpenProp, filteredItems, selectedValue]);

    const onClose = useCallback(() => {
        if (!isOpenControlled) setInternalIsOpen(false);
        onCloseProp?.();
        setSearchQuery("");
        setFocusedIndex(-1);
    }, [isOpenControlled, onCloseProp]);

    useLayoutEffect(() => {
        if (!isOpen) {
            setFocusedIndex(-1);
            return;
        }

        const defaultIndex = getDefaultFocusedIndex(filteredItems, selectedValue);
        if (defaultIndex >= 0) {
            setFocusedIndex(defaultIndex);
        }
    }, [isOpen, filteredItems, selectedValue]);

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
        (props: Record<string, any> = {}) => {
            const { ref, ...rest } = props;
            return {
                ...rest,
                "data-open": isOpen ? "" : undefined,
                ref: mergeRefs(controlRef, ref)
            };
        },
        [isOpen]
    );

    const getInputProps = useCallback(
        (props: Record<string, any> = {}) => {
            const { ref, onChange, onFocus, onBlur, onKeyDown, ...rest } = props;
            return {
                pe: "var(--ac-pe)",
                value: isOpen ? searchQuery : selectedLabel,
                role: "combobox",
                "aria-expanded": isOpen,
                "aria-haspopup": "listbox",
                autoComplete: "off",
                ...rest,
                ref: mergeRefs(inputRef, ref ?? null),
                onChange: callAllHandlers(onChange, (e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchQuery(e.target.value);
                    if (!isOpen) onOpen();
                }),
                onFocus: callAllHandlers(onFocus, () => {
                    if (!isOpen) onOpen();
                }),
                onBlur: callAllHandlers(onBlur, () => {
                    onClose();
                }),
                onKeyDown: callAllHandlers(
                    onKeyDown,
                    (e: React.KeyboardEvent<HTMLInputElement>) => {
                        const lastIndex = filteredItems.length - 1;

                        function getActiveIndex() {
                            return focusedIndex >= 0
                                ? focusedIndex
                                : getDefaultFocusedIndex(filteredItems, selectedValue);
                        }

                        switch (e.key) {
                            case "ArrowDown":
                                e.preventDefault();
                                if (!isOpen) {
                                    onOpen();
                                    break;
                                }
                                if (filteredItems.length === 0) break;
                                setFocusedIndex((prev) => {
                                    const start =
                                        prev < 0
                                            ? getDefaultFocusedIndex(filteredItems, selectedValue)
                                            : prev;
                                    const next = start + 1 > lastIndex ? start : start + 1;
                                    return next;
                                });
                                break;
                            case "ArrowUp":
                                e.preventDefault();
                                if (!isOpen) {
                                    onOpen();
                                    break;
                                }
                                if (filteredItems.length === 0) break;
                                setFocusedIndex((prev) => {
                                    const start =
                                        prev < 0
                                            ? getDefaultFocusedIndex(filteredItems, selectedValue)
                                            : prev;
                                    return Math.max(0, start - 1);
                                });
                                break;
                            case "Enter": {
                                e.preventDefault();
                                if (!isOpen) {
                                    onOpen();
                                    break;
                                }
                                if (filteredItems.length === 0) break;
                                selectItem(filteredItems[getActiveIndex()].value);
                                break;
                            }
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
            };
        },
        [
            isOpen,
            searchQuery,
            selectedLabel,
            filteredItems,
            focusedIndex,
            onOpen,
            onClose,
            selectItem
        ]
    );

    const getContentProps = useCallback(
        (props: Record<string, any> = {}) => {
            const { ref, onMouseDown, style, ...rest } = props;
            return {
                ...rest,
                role: "listbox",
                ref: mergeRefs(contentRef, ref ?? null),
                // Prevent the input from losing focus when the user clicks inside the
                // dropdown — without this, blur fires on the input before the item click
                // registers, which closes the list and swallows the selection.
                onMouseDown: (e: React.MouseEvent) => {
                    e.preventDefault();
                    onMouseDown?.(e);
                },
                style: {
                    ...style,
                    ...(contentWidth && contentWidth > 0
                        ? { width: `${contentWidth}px`, minWidth: `${contentWidth}px` }
                        : {})
                },
                rootProps: {
                    style: { zIndex: "var(--z-index-dropdown)" }
                }
            };
        },
        [contentWidth]
    );

    const getItemProps = useCallback(
        (props: Record<string, any> = {}) => {
            const { ref, onClick, onPointerEnter, value, index, ...rest } = props;
            return {
                ...rest,
                type: "button" as const,
                role: "option",
                ref,
                value,
                index,
                "aria-selected": selectedValue === value,
                "data-selected": selectedValue === value ? "" : undefined,
                "data-focused": focusedIndex === index ? "" : undefined,
                onClick: callAllHandlers(onClick, () => selectItem(value)),
                onPointerEnter: callAllHandlers(onPointerEnter, () => {
                    setFocusedIndex(index ?? -1);
                })
            };
        },
        [selectedValue, focusedIndex, selectItem]
    );

    const getClearButtonProps = useCallback(
        (props: Record<string, any> = {}) => {
            const { ref, onClick, ...rest } = props;
            return {
                ...rest,
                type: "button" as const,
                "aria-label": "Clear selection",
                ref,
                onClick: callAllHandlers(onClick, (e: React.MouseEvent) => {
                    e.stopPropagation();
                    clearItem();
                })
            };
        },
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
            positioning: { placement: "bottom" as const, ...positioning },
            ...popoverProps
        }),
        [isOpen, onClose, onOpen, positioning, popoverProps]
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
    triggerVariant: string;
}

export const [AutocompleteProvider, useAutocompleteContext] =
    createContext<AutocompleteContextValue>({
        strict: true,
        name: "AutocompleteContext"
    });
