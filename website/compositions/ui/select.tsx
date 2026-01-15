"use client";

import {
    type FocusableElement,
    SelectDescendantsProvider,
    SelectProvider,
    type UseSelectItemProps,
    type UseSelectProps,
    useHiddenSelect,
    useSafeLayoutEffect,
    useSelect,
    useSelectContext,
    useSelectItem
} from "@dreamy-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type React from "react";
import {
    Children,
    type ReactNode,
    type RefObject,
    type SVGProps,
    forwardRef,
    useRef,
    useState
} from "react";
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

    const { containerProps, selectProps, descendants, id, selectedKeys } = useHiddenSelect({
        ...props,
        domRef
    });

    const [, forceUpdate] = useState({});

    useSafeLayoutEffect(() => {
        forceUpdate({});
    }, []);

    const items = Array.from(descendants.values());

    return (
        <VisuallyHidden {...containerProps}>
            <label>
                {placeholder}
                <select
                    {...selectProps}
                    ref={domRef}
                >
                    <option />
                    {items.map((item: any) => {
                        const isSelected = selectProps.multiple
                            ? selectedKeys.includes(item.node.value)
                            : undefined;

                        return (
                            <option
                                key={`${id}-${item.node.value}`}
                                selected={isSelected}
                                value={item.node.value}
                            >
                                {item.textValue}
                            </option>
                        );
                    })}
                </select>
            </label>
        </VisuallyHidden>
    );
}

export interface SelectProps<T extends boolean>
    extends UseSelectProps<T, PopoverProps>,
        SelectVariantProps,
        Omit<HTMLDreamyProps<"div">, keyof UseSelectProps<T, PopoverProps>> {
    children?: ReactNode;
}

/**
 * Select component
 *
 * @See Docs https://dreamy-ui.com/docs/components/select
 */
export const Root: <T extends boolean = false>(props: SelectProps<T>) => React.JSX.Element =
    withProvider(function SelectRoot<T extends boolean = false>({
        children,
        ...props
    }: SelectProps<T>) {
        const [cssProps, restProps] = splitCssProps(props);
        const ctx = useSelect<T, PopoverProps>(restProps);

        return (
            <SelectProvider value={ctx as any}>
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
                        placement="bottom"
                        reduceMotion={ctx.reduceMotion}
                        {...props.popoverProps}
                    >
                        <SelectDescendantsProvider value={ctx.descendants}>
                            {children}
                        </SelectDescendantsProvider>
                    </PopoverRoot>
                </Box>
            </SelectProvider>
        );
    }, "root") as any;

export interface SelectTriggerProps extends HTMLDreamyProps<"button"> {
    /**
     * Icon to show in the trigger.
     */
    icon?: React.ReactNode;
    /**
     * Placeholder text to show when no item is selected.
     */
    placeholder?: string;
    /**
     * Text to show when multiple items are selected.
     */
    multipleSelectedText?: (selectedKeys: string[]) => string;
}

export const Trigger = withContext(
    forwardRef<HTMLButtonElement, SelectTriggerProps>(function SelectTrigger(
        {
            children,
            placeholder,
            icon,
            multipleSelectedText = (selectedKeys) => `${selectedKeys.length} Selected`,
            ...rest
        },
        ref
    ) {
        const { getTriggerProps, selectedKeys, descendants, isClearable } = useSelectContext();

        const selectedNames = selectedKeys.map((key) => {
            const item: any = Array.from(descendants.values()).find((node: any) => {
                return node.node.value === key;
            });
            return item?.textValue;
        });

        const [, forceUpdate] = useState({});

        useSafeLayoutEffect(() => {
            forceUpdate({});
        }, [JSON.stringify(Array.from(descendants.values()).map((node: any) => node.node.value))]);

        return (
            <>
                <PopoverTrigger>
                    <dreamy.button {...(getTriggerProps(rest, ref) as any)}>
                        {icon && icon}

                        <span>
                            {selectedNames.length === 1
                                ? selectedNames[0]
                                : selectedNames.length > 1
                                  ? multipleSelectedText(selectedNames)
                                  : placeholder}
                        </span>
                        <SelectIndicatorGroup>
                            {isClearable && selectedKeys.length > 0 && <SelectClearButton />}
                            <SelectIndicator />
                        </SelectIndicatorGroup>
                    </dreamy.button>
                </PopoverTrigger>
            </>
        );
    }),
    "trigger"
);

export interface SelectContentProps extends PopoverContentProps {}

export const Content = withContext(
    forwardRef<HTMLDivElement, SelectContentProps>(function SelectContent(props, ref) {
        const { children, ...rest } = props;
        const { getContentProps } = useSelectContext();
        const contentPropsResult = getContentProps(rest, ref);

        return <PopoverContent {...contentPropsResult}>{children}</PopoverContent>;
    }),
    "content"
);

export interface SelectVirtualContentProps extends PopoverContentProps {
    /**
     * Estimated height of each item in pixels.
     * Used for virtualization calculations.
     * @default 32
     */
    estimatedItemHeight?: number;
    /**
     * Number of items to render outside the visible area.
     * Higher values reduce flickering during fast scrolling but increase initial render cost.
     * @default 5
     */
    overscan?: number;
    /**
     * Maximum height of the virtualized list container in pixels.
     * @default 300
     */
    maxHeight?: number;
}

/**
 * Virtualized SelectContent for better performance with large lists.
 * Only renders visible items.
 */
export const VirtualContent = withContext(
    forwardRef<HTMLDivElement, SelectVirtualContentProps>(
        function SelectVirtualContent(props, ref) {
            const {
                children,
                estimatedItemHeight = 32,
                overscan = 5,
                maxHeight = 300,
                ...rest
            } = props;

            const { getContentProps, isOpen, selectedKeys } = useSelectContext();
            const contentPropsResult = getContentProps(rest, ref);

            return (
                <PopoverContent {...contentPropsResult}>
                    <VirtualizedList
                        estimatedItemHeight={estimatedItemHeight}
                        isOpen={isOpen}
                        maxHeight={maxHeight}
                        overscan={overscan}
                        selectedKeys={selectedKeys}
                    >
                        {children}
                    </VirtualizedList>
                </PopoverContent>
            );
        }
    ),
    "content"
);

interface VirtualizedListProps {
    children: ReactNode;
    estimatedItemHeight: number;
    overscan: number;
    maxHeight: number;
    isOpen: boolean;
    selectedKeys: string[];
}

function VirtualizedList({
    children,
    estimatedItemHeight,
    overscan,
    maxHeight,
    isOpen,
    selectedKeys
}: VirtualizedListProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const childArray = Children.toArray(children);
    const [hasMeasured, setHasMeasured] = useState(false);

    const virtualizer = useVirtualizer({
        count: childArray.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: () => estimatedItemHeight,
        overscan
    });

    // Force remeasure when popover opens
    useSafeLayoutEffect(() => {
        if (isOpen && scrollContainerRef.current) {
            // Use requestAnimationFrame to ensure the DOM has fully painted
            requestAnimationFrame(() => {
                virtualizer.measure();
                setHasMeasured(true);
            });
        }
    }, [isOpen, virtualizer]);

    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    // Find indices of selected items to always render them
    const selectedIndices = new Set<number>();
    childArray.forEach((child, index) => {
        if (
            child &&
            typeof child === "object" &&
            "props" in child &&
            selectedKeys.includes((child as React.ReactElement<{ value: string }>).props.value)
        ) {
            selectedIndices.add(index);
        }
    });

    // Get the set of indices that are already being rendered by virtualizer
    const virtualizedIndices = new Set(virtualItems.map((item) => item.index));

    // Find selected items that are NOT in the virtualized view
    const hiddenSelectedIndices = Array.from(selectedIndices).filter(
        (index) => !virtualizedIndices.has(index)
    );

    // If we haven't measured yet but we're open, show initial items as fallback
    const showFallback =
        isOpen && !hasMeasured && virtualItems.length === 0 && childArray.length > 0;
    const initialItemsToShow = Math.min(
        Math.ceil(maxHeight / estimatedItemHeight) + overscan,
        childArray.length
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
                    height: showFallback ? childArray.length * estimatedItemHeight : totalSize,
                    width: "100%",
                    position: "relative"
                }}
            >
                {showFallback
                    ? childArray.slice(0, initialItemsToShow).map((child, index) => (
                          <div
                              key={index}
                              style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  transform: `translateY(${index * estimatedItemHeight}px)`
                              }}
                          >
                              {child}
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
                              {childArray[virtualItem.index]}
                          </div>
                      ))}

                {/* Always render selected items that are outside the virtualized view (hidden but mounted for descendants registration) */}
                {!showFallback &&
                    hiddenSelectedIndices.map((index) => (
                        <div
                            aria-hidden="true"
                            key={`selected-${index}`}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                pointerEvents: "none",
                                visibility: "hidden"
                            }}
                        >
                            {childArray[index]}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export interface SelectItemProps extends UseSelectItemProps {}

/**
 * @internal
 */
const SelectIndicatorGroup = withContext(Box, "indicatorGroup");

const CheckIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
    function CheckIcon(props, ref) {
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
                ref={ref}
            >
                <path d="M20 6 9 17l-5-5" />
            </svg>
        );
    }
);

const SelectItemIndicator = withContext(CheckIcon, "itemIndicator");

export const Item = withContext(
    forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(props, ref) {
        const { selectedStrategy, selectedKeys } = useSelectContext();
        const itemProps = useSelectItem(props, ref);

        return (
            <dreamy.button {...(itemProps as any)}>
                {itemProps.children}

                {(selectedStrategy === "checkmark" || selectedStrategy === "both") &&
                    selectedKeys.includes(itemProps.value) && <SelectItemIndicator />}
            </dreamy.button>
        );
    }),
    "item"
);

const SelectIndicatorBase = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
    function SelectIndicator(props, ref) {
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
                ref={ref}
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
        );
    }
);

const SelectIndicator = withContext(SelectIndicatorBase, "indicator");

export interface SelectClearButtonProps extends HTMLDreamyProps<"button"> {}

const SelectClearButton = withContext(
    forwardRef<HTMLButtonElement, SelectClearButtonProps>(function SelectClearButton(props, ref) {
        const { getClearButtonProps } = useSelectContext();

        return (
            <dreamy.button {...getClearButtonProps(props, ref)}>
                <dreamy.svg asChild>
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
                </dreamy.svg>
            </dreamy.button>
        );
    }),
    "clearButton"
);
