"use client";

import {
    type AutocompleteItem,
    AutocompleteProvider,
    type UseAutocompleteProps,
    useAutocomplete,
    useAutocompleteContext
} from "@dreamy-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type React from "react";
import { type ReactNode, type SVGProps, forwardRef, useEffect, useRef } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy, splitCssProps } from "styled-system/jsx";
import { type AutocompleteVariantProps, autocomplete } from "styled-system/recipes";
import { Box } from "./box";
import { Input as BaseInput, type InputProps } from "./input";
import {
    Anchor as PopoverAnchor,
    Content as PopoverContent,
    type PopoverContentProps,
    Root as PopoverRoot
} from "./popover";

export type { AutocompleteItem };

const { withProvider, withContext } = createStyleContext(autocomplete, {
    forwardVariants: ["size"]
});

// ─── Internal styled primitives ──────────────────────────────────────────────

const AutocompleteControl = withContext(
    forwardRef<HTMLDivElement, HTMLDreamyProps<"div">>(
        function AutocompleteControlBase(props, ref) {
            return (
                <dreamy.div
                    ref={ref}
                    {...props}
                />
            );
        }
    ),
    "control"
);

const AutocompleteIndicatorGroup = withContext(Box, "indicatorGroup");

const AutocompleteIndicatorBase = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
    function AutocompleteIndicatorBase(props, ref) {
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

const AutocompleteIndicator = withContext(AutocompleteIndicatorBase, "indicator");

const AutocompleteClearButton = withContext(
    forwardRef<HTMLButtonElement, HTMLDreamyProps<"button">>(
        function AutocompleteClearButtonBase(props, ref) {
            const { getClearButtonProps } = useAutocompleteContext();

            return (
                <dreamy.button {...getClearButtonProps(props, ref)}>
                    <dreamy.svg
                        aria-hidden="true"
                        asChild
                    >
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
        }
    ),
    "clearButton"
);

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

const AutocompleteItemIndicator = withContext(CheckIcon, "itemIndicator");
const AutocompleteNoResults = withContext(Box, "noResults");

// ─── Public API ──────────────────────────────────────────────────────────────

export interface AutocompleteProps
    extends UseAutocompleteProps,
        AutocompleteVariantProps,
        Omit<HTMLDreamyProps<"div">, "children" | "onChange" | "value" | "defaultValue"> {
    /**
     * The visual variant forwarded to the inner `Input` component.
     * @default "outline"
     */
    variant?: InputProps["variant"];
    children?: ReactNode;
}

/**
 * Autocomplete component
 *
 * @See Docs https://dreamy-ui.com/docs/components/autocomplete
 */
export const Root: (props: AutocompleteProps) => React.JSX.Element = withProvider(
    function AutocompleteRoot({
        children,
        size = "md",
        variant = "outline",
        ...props
    }: AutocompleteProps) {
        const [cssProps, restProps] = splitCssProps(props);
        const ctx = useAutocomplete(restProps);

        return (
            <AutocompleteProvider
                value={{
                    ...ctx,
                    size: size as "xs" | "sm" | "md" | "lg",
                    variant: variant as string
                }}
            >
                <Box
                    {...ctx.getRootProps({
                        ...cssProps,
                        className: restProps.className
                    })}
                >
                    <PopoverRoot {...ctx.getPopoverRootProps()}>{children}</PopoverRoot>
                </Box>
            </AutocompleteProvider>
        );
    },
    "root"
) as any;

export interface AutocompleteInputProps
    extends Omit<InputProps, "value" | "onChange" | "size" | "variant"> {
    /**
     * Icon shown at the start of the input.
     */
    icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, AutocompleteInputProps>(
    function AutocompleteInput({ icon, placeholder, ...rest }, ref) {
        const { getInputProps, isClearable, selectedValue, size, variant } =
            useAutocompleteContext();

        return (
            <PopoverAnchor>
                <AutocompleteControl>
                    {icon && (
                        <Box
                            alignItems="center"
                            color="fg.medium"
                            display="flex"
                            flexShrink={0}
                            justifyContent="center"
                            pl="var(--ac-px)"
                        >
                            {icon}
                        </Box>
                    )}
                    <BaseInput
                        placeholder={placeholder}
                        size={size}
                        variant={variant as InputProps["variant"]}
                        width="full"
                        {...(getInputProps(rest as any, ref) as any)}
                    />
                    <AutocompleteIndicatorGroup>
                        {isClearable && selectedValue && <AutocompleteClearButton />}
                        <AutocompleteIndicator />
                    </AutocompleteIndicatorGroup>
                </AutocompleteControl>
            </PopoverAnchor>
        );
    }
);

export interface AutocompleteContentProps extends Omit<PopoverContentProps, "children"> {
    /**
     * Text shown when no items match the current search query.
     * @default "No results found"
     */
    noResultsText?: string;
    /**
     * Custom ReactNode rendered in place of `noResultsText` when the filtered list is empty.
     * Useful for showing a loading spinner during async fetching.
     */
    noResultsContent?: ReactNode;
    /**
     * Custom render function for each filtered item.
     * If omitted, items are rendered with their `label` as text content.
     */
    renderItem?: (item: AutocompleteItem) => ReactNode;
}

export const Content = withContext(
    forwardRef<HTMLDivElement, AutocompleteContentProps>(function AutocompleteContent(
        { noResultsText = "No results found", noResultsContent, renderItem, className, ...rest },
        ref
    ) {
        const { filteredItems, getContentProps } = useAutocompleteContext();

        return (
            <PopoverContent
                className={className}
                {...(getContentProps(rest as any, ref as any) as any)}
            >
                {filteredItems.length === 0
                    ? (noResultsContent ?? (
                          <AutocompleteNoResults>{noResultsText}</AutocompleteNoResults>
                      ))
                    : filteredItems.map((item: AutocompleteItem, index: number) =>
                          renderItem ? (
                              renderItem(item)
                          ) : (
                              <Item
                                  index={index}
                                  key={item.value}
                                  value={item.value}
                              >
                                  {item.label}
                              </Item>
                          )
                      )}
            </PopoverContent>
        );
    }),
    "content"
);

export interface AutocompleteVirtualContentProps extends Omit<PopoverContentProps, "children"> {
    /**
     * Estimated height of each item in pixels. Used for virtualization calculations.
     * For different autocomplete sizes: `xs`: 26, `sm`: 28, `md`: 32, `lg`: 40.
     * @default 32
     */
    estimatedItemHeight?: number;
    /**
     * Number of items to render outside the visible area. Higher values reduce flickering
     * during fast scrolling at the cost of initial render work.
     * @default 5
     */
    overscan?: number;
    /**
     * Maximum height of the virtualized list container in pixels.
     * @default 300
     */
    maxHeight?: number;
    /**
     * Text shown when no items match the current search query.
     * @default "No results found"
     */
    noResultsText?: string;
    /**
     * Custom ReactNode rendered in place of `noResultsText` when the filtered list is empty.
     */
    noResultsContent?: ReactNode;
    /**
     * Custom render function for each filtered item.
     */
    renderItem?: (item: AutocompleteItem) => ReactNode;
}

export const VirtualContent = withContext(
    forwardRef<HTMLDivElement, AutocompleteVirtualContentProps>(function AutocompleteVirtualContent(
        {
            estimatedItemHeight = 32,
            overscan = 5,
            maxHeight = 300,
            noResultsText = "No results found",
            noResultsContent,
            renderItem,
            className,
            ...rest
        },
        ref
    ) {
        const { filteredItems, getContentProps, isOpen } = useAutocompleteContext();

        return (
            <PopoverContent
                className={className}
                {...(getContentProps(rest as any, ref as any) as any)}
            >
                {filteredItems.length === 0 ? (
                    (noResultsContent ?? (
                        <AutocompleteNoResults>{noResultsText}</AutocompleteNoResults>
                    ))
                ) : (
                    <AutocompleteVirtualizedList
                        estimatedItemHeight={estimatedItemHeight}
                        filteredItems={filteredItems}
                        isOpen={isOpen}
                        maxHeight={maxHeight}
                        overscan={overscan}
                        renderItem={renderItem}
                    />
                )}
            </PopoverContent>
        );
    }),
    "content"
);

interface AutocompleteVirtualizedListProps {
    filteredItems: AutocompleteItem[];
    estimatedItemHeight: number;
    overscan: number;
    maxHeight: number;
    isOpen: boolean;
    renderItem?: (item: AutocompleteItem) => ReactNode;
}

function AutocompleteVirtualizedList({
    filteredItems,
    estimatedItemHeight,
    overscan,
    maxHeight,
    isOpen,
    renderItem
}: AutocompleteVirtualizedListProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { focusedIndex } = useAutocompleteContext();

    const virtualizer = useVirtualizer({
        count: filteredItems.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: () => estimatedItemHeight,
        overscan
    });

    useEffect(() => {
        if (isOpen && scrollContainerRef.current) {
            requestAnimationFrame(() => {
                virtualizer.measure();
            });
        }
    }, [isOpen, virtualizer]);

    useEffect(() => {
        if (focusedIndex >= 0) {
            virtualizer.scrollToIndex(focusedIndex, { align: "auto" });
        }
    }, [focusedIndex, virtualizer]);

    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    return (
        <div
            ref={scrollContainerRef}
            style={{ maxHeight, overflowY: "auto", width: "100%" }}
        >
            <div style={{ height: totalSize, position: "relative", width: "100%" }}>
                {virtualItems.map((virtualItem) => {
                    const item = filteredItems[virtualItem.index];
                    return (
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
                            {renderItem ? (
                                renderItem(item)
                            ) : (
                                <Item
                                    index={virtualItem.index}
                                    value={item.value}
                                >
                                    {item.label}
                                </Item>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export interface AutocompleteItemProps extends HTMLDreamyProps<"button"> {
    /**
     * The value of this item, used to track selection state.
     */
    value: string;
    /**
     * The index of this item within the filtered list. Used for keyboard navigation.
     * Automatically provided when using `Autocomplete.Content`.
     */
    index?: number;
}

export const Item = withContext(
    forwardRef<HTMLButtonElement, AutocompleteItemProps>(function AutocompleteItem(
        { value, index, children, ...rest },
        ref
    ) {
        const { getItemProps, selectedValue } = useAutocompleteContext();
        const isSelected = selectedValue === value;

        return (
            <dreamy.button {...(getItemProps({ value, index, ...rest }, ref) as any)}>
                {children}
                {isSelected && <AutocompleteItemIndicator />}
            </dreamy.button>
        );
    }),
    "item"
);
