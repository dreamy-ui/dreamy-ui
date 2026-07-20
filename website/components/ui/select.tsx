"use client";

import {
    type FocusableElement,
    type PositioningProps,
    SelectProvider,
    type UseSelectProps,
    useHiddenSelect,
    useSafeLayoutEffect,
    useSelect,
    useSelectContext
} from "@dreamy-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type React from "react";
import { type ReactNode, type RefObject, type SVGProps, useRef, useState } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy, splitCssProps } from "styled-system/jsx";
import { type SelectVariantProps, select } from "styled-system/recipes";
import { Box } from "./box";
import {
    Content as PopoverContent,
    type PopoverContentProps,
    type PopoverProps,
    Root as PopoverRoot,
    Trigger as PopoverTrigger
} from "./popover";
import { VisuallyHidden } from "./visually-hidden";

const { withProvider, withContext } = createStyleContext(select);

export interface SelectItemData {
    value: string;
    label: string;
    disabled?: boolean;
}

export type SelectLayer = "dropdown" | "popover" | "tooltip";

export interface HiddenSelectProps {
    placeholder: string;
    multiple: boolean;
    autoComplete: string;
    triggerRef: RefObject<FocusableElement | null>;
    domRef: RefObject<HTMLSelectElement | null>;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onChangeValue?: (value: string | string[]) => void;
}

function HiddenSelect(props: HiddenSelectProps) {
    const { domRef, placeholder } = props;

    const { containerProps, selectProps, items, id, selectedKeys } = useHiddenSelect({
        ...props,
        domRef
    });

    return (
        <VisuallyHidden {...containerProps}>
            <label>
                {placeholder}
                <select
                    {...selectProps}
                    ref={domRef}
                >
                    <option />
                    {items.map((item: SelectItemData) => {
                        const isSelected = selectProps.multiple
                            ? selectedKeys.includes(item.value)
                            : undefined;

                        return (
                            <option
                                key={`${id}-${item.value}`}
                                selected={isSelected}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        );
                    })}
                </select>
            </label>
        </VisuallyHidden>
    );
}

export interface SelectProps<
    T extends boolean = false,
    Item extends SelectItemData = SelectItemData
> extends Omit<UseSelectProps<T, PopoverProps>, "items" | "popoverProps">,
        SelectVariantProps,
        Omit<HTMLDreamyProps<"div">, keyof UseSelectProps<T, PopoverProps>> {
    /**
     * Options to display in the select. Each item requires `value` and `label`.
     */
    items: Item[];
    /**
     * Custom render function for each item.
     * Receives the full item type so extra fields such as `icon` are type-safe.
     */
    renderItem?: (item: Item) => ReactNode;
    /**
     * Semantic z-index layer for the dropdown content.
     * Nested overlay scopes are added automatically.
     * @default "dropdown"
     */
    layer?: SelectLayer;
    /**
     * Explicit z-index for the dropdown content.
     * Prefer `layer` unless you need a custom CSS value.
     */
    contentZIndex?: string;
    /**
     * Positioning configuration for the select dropdown.
     * @default { placement: "bottom" }
     */
    positioning?: PositioningProps;
    /**
     * Props forwarded to the internal `Popover.Root`.
     * Set `usePortal` to `false` to render the dropdown in place.
     */
    popoverProps?: Omit<PopoverProps, "positioning">;
    children?: ReactNode;
}

/**
 * Select component — dropdown for choosing one or more options.
 *
 * @see Docs https://dreamy-ui.com/docs/components/select
 *
 * @example
 * ```tsx
 * <Select.Root items={items}>
 *   <Select.Trigger />
 *   <Select.Content />
 * </Select.Root>
 * ```
 */
export const Root: <T extends boolean = false, Item extends SelectItemData = SelectItemData>(
    props: SelectProps<T, Item>
) => React.JSX.Element = withProvider(function SelectRoot<
    T extends boolean = false,
    Item extends SelectItemData = SelectItemData
>({ children, items, renderItem, layer, contentZIndex, positioning, ...props }: SelectProps<T, Item>) {
    const [cssProps, restProps] = splitCssProps(props);
    const resolvedContentZIndex =
        contentZIndex ?? (layer ? `var(--z-index-${layer})` : "var(--z-index-dropdown)");

    const ctx = useSelect<T, PopoverProps>({
        ...restProps,
        items,
        contentZIndex: resolvedContentZIndex
    });

    return (
        <SelectProvider
            value={
                {
                    ...ctx,
                    renderItem: renderItem as ((item: SelectItemData) => ReactNode) | undefined
                } as React.ComponentProps<typeof SelectProvider>["value"]
            }
        >
            <Box
                {...ctx.getRootProps({
                    ...cssProps,
                    className: restProps.className
                })}
            >
                <HiddenSelect {...ctx.getHiddenSelectProps()} />
                <PopoverRoot
                    hasArrow={false}
                    initialFocusRef={ctx.triggerRef}
                    isOpen={ctx.isOpen}
                    lazyBehavior="keepMounted"
                    onClose={ctx.onClose}
                    onOpen={ctx.onOpen}
                    positioning={{ placement: "bottom", ...positioning }}
                    reduceMotion={ctx.reduceMotion}
                    {...props.popoverProps}
                    portalProps={{
                        zIndex: resolvedContentZIndex,
                        ...props.popoverProps?.portalProps
                    }}
                >
                    {children}
                </PopoverRoot>
            </Box>
        </SelectProvider>
    );
}, "root") as <T extends boolean = false, Item extends SelectItemData = SelectItemData>(
    props: SelectProps<T, Item>
) => React.JSX.Element;

export interface SelectTriggerProps extends HTMLDreamyProps<"button"> {
    icon?: React.ReactNode;
    placeholder?: string;
    /**
     * Custom formatter when more than one item is selected in a multiple select.
     * Receives the selected item labels. Defaults to a comma-separated list.
     */
    multipleSelectedText?: (selectedLabels: string[]) => string;
    children?: ReactNode;
}

/**
 * Select Trigger — button that opens the dropdown.
 */
export const Trigger = withContext(function SelectTrigger({
    children,
    placeholder,
    icon,
    multipleSelectedText,
    ...rest
}: SelectTriggerProps) {
    const { getTriggerProps, selectedKeys, items, isClearable, renderItem } = useSelectContext() as ReturnType<
        typeof useSelect
    > & {
        renderItem?: (item: SelectItemData) => ReactNode;
    };

    const selectedItems = selectedKeys
        .map((key: string) => items.find((item: SelectItemData) => item.value === key))
        .filter((item: SelectItemData | undefined): item is SelectItemData => item != null);

    const selectedNames = selectedItems.map((item: SelectItemData) => item.label);

    function getDisplayContent() {
        if (selectedItems.length === 0) return placeholder;

        if (renderItem) {
            if (selectedItems.length === 1) {
                return renderItem(selectedItems[0]);
            }

            return selectedItems.map((item: SelectItemData, index: number) => (
                <span key={item.value}>
                    {index > 0 ? ", " : null}
                    {renderItem(item)}
                </span>
            ));
        }

        if (selectedNames.length === 1) return selectedNames[0];
        return multipleSelectedText?.(selectedNames) ?? selectedNames.join(", ");
    }

    return (
        <PopoverTrigger>
            <dreamy.button {...(getTriggerProps(rest) as HTMLDreamyProps<"button">)}>
                {icon && icon}

                <dreamy.span data-part="value">{children ?? getDisplayContent()}</dreamy.span>
                <SelectIndicatorGroup>
                    {isClearable && selectedKeys.length > 0 && <SelectClearButton />}
                    <SelectIndicator />
                </SelectIndicatorGroup>
            </dreamy.button>
        </PopoverTrigger>
    );
}, "trigger");

export interface SelectContentProps extends PopoverContentProps {
    /**
     * When `false`, renders `children` instead of the default items list.
     * Useful for loading or empty states during async fetching.
     * @default true
     */
    showItems?: boolean;
}

/**
 * Select Content — dropdown panel listing available options.
 */
export const Content = withContext(function SelectContent(props: SelectContentProps) {
    const { showItems = true, children, ...rest } = props;
    const { getContentProps, items, renderItem } = useSelectContext() as ReturnType<
        typeof useSelect
    > & {
        renderItem?: (item: SelectItemData) => ReactNode;
    };
    const contentPropsResult = getContentProps(rest);

    return (
        <PopoverContent {...contentPropsResult}>
            {showItems
                ? items.map((item: SelectItemData, index: number) => (
                      <SelectListItem
                          index={index}
                          item={item}
                          key={item.value}
                          renderItem={renderItem}
                      />
                  ))
                : children}
        </PopoverContent>
    );
}, "content");

export interface SelectVirtualContentProps extends PopoverContentProps {
    estimatedItemHeight?: number;
    overscan?: number;
    maxHeight?: number;
    /**
     * When `false`, renders `children` instead of the default virtualized items list.
     * Useful for loading or empty states during async fetching.
     * @default true
     */
    showItems?: boolean;
}

/**
 * Select Virtual Content — virtualized dropdown panel for large option lists.
 */
export const VirtualContent = withContext(function SelectVirtualContent(
    props: SelectVirtualContentProps
) {
    const {
        estimatedItemHeight = 32,
        overscan = 5,
        maxHeight = 300,
        showItems = true,
        children,
        ...rest
    } = props;

    const { getContentProps, isOpen, items, renderItem } = useSelectContext() as ReturnType<
        typeof useSelect
    > & {
        renderItem?: (item: SelectItemData) => ReactNode;
    };
    const contentPropsResult = getContentProps(rest);

    return (
        <PopoverContent {...contentPropsResult}>
            {showItems ? (
                <VirtualizedList
                    estimatedItemHeight={estimatedItemHeight}
                    isOpen={isOpen}
                    items={items}
                    maxHeight={maxHeight}
                    overscan={overscan}
                    renderItem={renderItem}
                />
            ) : (
                children
            )}
        </PopoverContent>
    );
}, "content");

interface SelectListItemProps<Item extends SelectItemData>
    extends Omit<HTMLDreamyProps<"button">, "children" | "value"> {
    item: Item;
    index: number;
    renderItem?: (item: Item) => ReactNode;
}

const SelectListItem = withContext(function SelectListItem({
    item,
    index,
    renderItem,
    ...rest
}: SelectListItemProps<SelectItemData>) {
    const { getItemProps, selectedStrategy, selectedKeys } = useSelectContext();

    return (
        <dreamy.button
            {...(getItemProps(
                {
                    value: item.value,
                    index,
                    disabled: item.disabled,
                    ...rest
                }
            ) as HTMLDreamyProps<"button">)}
        >
            {renderItem ? renderItem(item) : item.label}
            {(selectedStrategy === "checkmark" || selectedStrategy === "both") &&
                selectedKeys.includes(item.value) && <SelectItemIndicator />}
        </dreamy.button>
    );
}, "item");

/** @internal Recipe slot target — items are rendered automatically from `items`. */
export const Item = SelectListItem;

interface VirtualizedListProps {
    items: SelectItemData[];
    renderItem?: (item: SelectItemData) => ReactNode;
    estimatedItemHeight: number;
    overscan: number;
    maxHeight: number;
    isOpen: boolean;
}

function VirtualizedList({
    items,
    renderItem,
    estimatedItemHeight,
    overscan,
    maxHeight,
    isOpen
}: VirtualizedListProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [hasMeasured, setHasMeasured] = useState(false);

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: () => estimatedItemHeight,
        overscan
    });

    useSafeLayoutEffect(() => {
        if (isOpen && scrollContainerRef.current) {
            requestAnimationFrame(() => {
                virtualizer.measure();
                setHasMeasured(true);
            });
        }
    }, [isOpen, virtualizer]);

    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    const showFallback = isOpen && !hasMeasured && virtualItems.length === 0 && items.length > 0;
    const initialItemsToShow = Math.min(
        Math.ceil(maxHeight / estimatedItemHeight) + overscan,
        items.length
    );

    return (
        <div
            ref={scrollContainerRef}
            style={{
                maxHeight,
                overflowY: "auto",
                width: "100%"
            }}
        >
            <div
                style={{
                    height: showFallback ? items.length * estimatedItemHeight : totalSize,
                    width: "100%",
                    position: "relative"
                }}
            >
                {showFallback
                    ? items.slice(0, initialItemsToShow).map((item, index) => (
                          <div
                              key={item.value}
                              style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  transform: `translateY(${index * estimatedItemHeight}px)`
                              }}
                          >
                              <SelectListItem
                                  index={index}
                                  item={item}
                                  renderItem={renderItem}
                              />
                          </div>
                      ))
                    : virtualItems.map((virtualItem) => (
                          <div
                              data-index={virtualItem.index}
                              key={virtualItem.key}
                              ref={virtualizer.measureElement}
                              style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  transform: `translateY(${virtualItem.start}px)`
                              }}
                          >
                              <SelectListItem
                                  index={virtualItem.index}
                                  item={items[virtualItem.index]}
                                  renderItem={renderItem}
                              />
                          </div>
                      ))}
            </div>
        </div>
    );
}

const SelectIndicatorGroup = withContext(Box, "indicatorGroup");

function CheckIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            {...props}
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

const SelectItemIndicator = withContext(CheckIcon, "itemIndicator");

function SelectIndicatorBase(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

const SelectIndicator = withContext(SelectIndicatorBase, "indicator");

export interface SelectClearButtonProps extends HTMLDreamyProps<"button"> {}

const SelectClearButton = withContext(function SelectClearButton(props: SelectClearButtonProps) {
    const { getClearButtonProps } = useSelectContext();

    return (
        <dreamy.button {...getClearButtonProps(props)}>
            <svg
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
            </svg>
        </dreamy.button>
    );
}, "clearButton");
