"use client";

import {
    Combobox as ArkCombobox,
    useComboboxContext as useArkComboboxContext,
    useListCollection,
    type ComboboxRootProps as ArkComboboxRootProps,
    type ComboboxValueChangeDetails
} from "@ark-ui/react/combobox";
import {
    type PositioningProps,
    ariaAttr,
    callAllHandlers,
    dataAttr,
    useControllableState,
    useFieldProps,
    useReducedMotion
} from "@dreamy-ui/react";
import { matchSorter } from "match-sorter";
import { useVirtualizer } from "@tanstack/react-virtual";
import type React from "react";
import {
    type ReactNode,
    type SVGProps,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy, splitCssProps } from "styled-system/jsx";
import { type AutocompleteVariantProps, autocomplete } from "styled-system/recipes";
import { Box } from "../box";
import { Input as BaseInput, type InputProps } from "../input";
import * as Popover from "../popover";
import type { PopoverContentProps } from "../popover";
import {
    AutocompleteUiProvider,
    useAutocompleteUi,
    type AutocompleteItem
} from "./autocomplete-ui-context";

export type { AutocompleteItem };

const { withProvider, withContext } = createStyleContext(autocomplete, {
    forwardVariants: ["size"]
});

export type AutocompletePopoverProps = Omit<
    Popover.PopoverProps,
    "positioning" | "children" | "open" | "defaultOpen" | "onOpenChange"
>;

export interface AutocompleteProps
    extends Omit<
            ArkComboboxRootProps<AutocompleteItem>,
            | "collection"
            | "value"
            | "defaultValue"
            | "onValueChange"
            | "disabled"
            | "invalid"
            | "required"
            | "positioning"
            | "inputValue"
            | "defaultInputValue"
            | "onInputValueChange"
        >,
        AutocompleteVariantProps,
        Omit<
            HTMLDreamyProps<"div">,
            keyof ArkComboboxRootProps<AutocompleteItem> | "onChange" | "items"
        > {
    items: AutocompleteItem[];
    value?: string | null;
    defaultValue?: string;
    onChangeValue?: (value: string | null) => void;
    filterFn?: (item: AutocompleteItem, query: string) => boolean;
    isClearable?: boolean;
    positioning?: PositioningProps;
    popoverProps?: AutocompletePopoverProps;
    triggerVariant?: InputProps["variant"];
    children?: ReactNode;
    isDisabled?: boolean;
    isInvalid?: boolean;
    isRequired?: boolean;
    reduceMotion?: boolean;
}

function AutocompleteRoot(props: AutocompleteProps) {
    const {
        children,
        size = "md",
        triggerVariant = "outline",
        items,
        filterFn,
        isClearable = true,
        reduceMotion: reduceMotionProp,
        open: openProp,
        defaultOpen,
        onOpenChange,
        isDisabled,
        isInvalid,
        isRequired,
        value,
        defaultValue,
        onChangeValue,
        positioning,
        popoverProps,
        className,
        ...rest
    } = props;
    const [, arkRest] = splitCssProps(rest);

    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? popoverProps?.reduceMotion ?? globalReduceMotion ?? false;

    const {
        isDisabled: isDisabledField = false,
        isRequired: isRequiredField = false,
        isInvalid: isInvalidField = false,
        id: fieldId,
        "aria-describedby": ariaDescribedByField
    } = useFieldProps({ isDisabled, isInvalid, isRequired, id: props.id });

    const resolvedIsDisabled = isDisabled ?? isDisabledField;
    const resolvedIsRequired = isRequired ?? isRequiredField;
    const resolvedIsInvalid = isInvalid ?? isInvalidField;

    const [visibleItems, setVisibleItems] = useState(items);

    const { collection, set } = useListCollection<AutocompleteItem>({
        initialItems: items,
        itemToString: (item) => item.label
    });

    useEffect(() => {
        set(items);
        setVisibleItems(items);
    }, [items, set]);

    const handleInputValueChange = useCallback(
        (details: { inputValue: string }) => {
            if (!details.inputValue) {
                set(items);
                setVisibleItems(items);
                return;
            }
            const nextItems = filterFn
                ? items.filter((entry) => filterFn(entry, details.inputValue))
                : matchSorter(items, details.inputValue, { keys: ["label"] });
            set(nextItems);
            setVisibleItems(nextItems);
        },
        [filterFn, items, set]
    );

    const handleValueChange = useCallback(
        (details: ComboboxValueChangeDetails<AutocompleteItem>) => {
            const next = details.value[0] ?? null;
            onChangeValue?.(next);
        },
        [onChangeValue]
    );

    const [open, setOpen] = useControllableState({
        value: openProp,
        defaultValue: defaultOpen
    });

    const handleOpenChange = useCallback(
        (details: Parameters<NonNullable<ArkComboboxRootProps<AutocompleteItem>["onOpenChange"]>>[0]) => {
            setOpen(details.open);
            onOpenChange?.(details);
        },
        [onOpenChange, setOpen]
    );

    const popoverPositioning = useMemo(
        () => ({
            placement: "bottom-start" as const,
            matchWidth: true,
            shift: false,
            ...positioning
        }),
        [positioning]
    );

    const { size: popoverSize, ...restPopoverProps } = popoverProps ?? {};

    const controlledValue = value === undefined ? undefined : value ? [value] : [];
    const controlledDefaultValue = defaultValue ? [defaultValue] : undefined;

    const uiValue = useMemo(
        () => ({
            size: size as AutocompleteUiContextValue["size"],
            triggerVariant: triggerVariant as string,
            isClearable,
            inputFieldProps: {
                id: fieldId,
                "aria-describedby": ariaDescribedByField,
                "aria-invalid": ariaAttr(resolvedIsInvalid),
                "aria-required": ariaAttr(resolvedIsRequired)
            },
            onInputValueChange: (inputValue: string) => {
                handleInputValueChange({ inputValue });
            },
            onChangeValue,
            visibleItems
        }),
        [
            ariaDescribedByField,
            fieldId,
            handleInputValueChange,
            isClearable,
            onChangeValue,
            visibleItems,
            resolvedIsInvalid,
            resolvedIsRequired,
            size,
            triggerVariant
        ]
    );

    return (
        <AutocompleteUiProvider value={uiValue}>
            <ArkCombobox.Root
                {...arkRest}
                className={className}
                collection={collection}
                {...(controlledDefaultValue !== undefined
                    ? { defaultValue: controlledDefaultValue }
                    : {})}
                disabled={resolvedIsDisabled}
                immediate
                invalid={resolvedIsInvalid}
                lazyMount={false}
                inputBehavior="autohighlight"
                onInputValueChange={handleInputValueChange}
                onOpenChange={handleOpenChange}
                onValueChange={handleValueChange}
                open={open}
                openOnClick
                required={resolvedIsRequired}
                selectionBehavior="replace"
                translations={{ clearTriggerLabel: "Clear selection" }}
                unmountOnExit={false}
                {...(controlledValue !== undefined ? { value: controlledValue } : {})}
            >
                <Popover.Root
                    {...restPopoverProps}
                    autoFocus={false}
                    closeOnEscape={false}
                    closeOnInteractOutside={false}
                    modal={false}
                    open={open}
                    onOpenChange={handleOpenChange}
                    positioning={popoverPositioning}
                    reduceMotion={reduceMotion}
                    restoreFocus={false}
                    size={popoverSize ?? "reference"}
                    portalProps={{
                        zIndex: "var(--z-index-dropdown)",
                        ...popoverProps?.portalProps
                    }}
                >
                    {children}
                </Popover.Root>
            </ArkCombobox.Root>
        </AutocompleteUiProvider>
    );
}

type AutocompleteUiContextValue = import("./autocomplete-ui-context").AutocompleteUiContextValue;

export const Root: (props: AutocompleteProps) => React.JSX.Element = withProvider(
    AutocompleteRoot,
    "root"
) as (props: AutocompleteProps) => React.JSX.Element;

const AutocompleteControl = withContext(ArkCombobox.Control, "control");

const AutocompleteIcon = withContext(function AutocompleteIconBase(props: HTMLDreamyProps<"div">) {
    return <dreamy.div {...props} />;
}, "icon");

const AutocompleteIndicatorGroup = withContext(Box, "indicatorGroup");

function AutocompleteIndicatorBase(props: SVGProps<SVGSVGElement>) {
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

const AutocompleteIndicator = withContext(AutocompleteIndicatorBase, "indicator");

function resolveAutocompleteInputSize(size: AutocompleteVariantProps["size"]): InputProps["size"] {
    if (typeof size !== "string") {
        return "md";
    }
    if (size === "xs") {
        return "sm";
    }
    if (size === "sm" || size === "md" || size === "lg" || size === "xl" || size === "2xl") {
        return size;
    }
    return "md";
}

const AutocompleteClearButton = withContext(function AutocompleteClearButtonBase(
    props: HTMLDreamyProps<"button">
) {
    return (
        <dreamy.button
            type="button"
            {...props}
        >
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
}, "clearButton");

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

const AutocompleteItemIndicator = withContext(CheckIcon, "itemIndicator");
const AutocompleteContentEl = withContext(ArkCombobox.Content, "content");
const AutocompleteNoResults = withContext(Box, "noResults");

function AutocompleteListbox({ children }: { children: ReactNode }) {
    const api = useArkComboboxContext();

    return (
        <AutocompleteContentEl
            aria-hidden={!api.open}
            hidden={false}
            tabIndex={-1}
        >
            {children}
        </AutocompleteContentEl>
    );
}

export interface AutocompleteInputProps
    extends Omit<InputProps, "size" | "variant" | "triggerVariant"> {
    icon?: ReactNode;
}

export const Input = withContext(function AutocompleteInput({
    icon,
    placeholder,
    ...rest
}: AutocompleteInputProps) {
    const { inputFieldProps, isClearable, onInputValueChange, size, triggerVariant } =
        useAutocompleteUi();
    const api = useArkComboboxContext();
    const showClear = isClearable && api.value.length > 0;
    return (
        <Popover.Anchor>
            <AutocompleteControl data-has-icon={dataAttr(!!icon)}>
                {icon && <AutocompleteIcon>{icon}</AutocompleteIcon>}
                <ArkCombobox.Input asChild>
                <BaseInput
                    placeholder={placeholder}
                    variant={triggerVariant as InputProps["variant"]}
                    {...inputFieldProps}
                    {...rest}
                    aria-haspopup="listbox"
                    size={resolveAutocompleteInputSize(size ?? "md") as InputProps["size"]}
                    autoComplete="off"
                    onChange={callAllHandlers(rest.onChange, (event) => {
                        onInputValueChange(event.currentTarget.value);
                    })}
                    pe="var(--ac-pe)"
                />
            </ArkCombobox.Input>
            <AutocompleteIndicatorGroup>
                {showClear && (
                    <ArkCombobox.ClearTrigger asChild>
                        <AutocompleteClearButton />
                    </ArkCombobox.ClearTrigger>
                )}
                <AutocompleteIndicator data-state={api.open ? "open" : "closed"} />
            </AutocompleteIndicatorGroup>
            </AutocompleteControl>
        </Popover.Anchor>
    );
}, "input");

export interface AutocompleteContentProps extends Omit<PopoverContentProps, "children" | "transition"> {
    noResultsText?: string;
    noResultsContent?: ReactNode;
    renderItem?: (item: AutocompleteItem) => ReactNode;
    children?: ReactNode;
}

export function Content(props: AutocompleteContentProps) {
    const {
        noResultsText = "No results found",
        noResultsContent,
        renderItem,
        motionProps,
        rootProps,
        ...contentProps
    } = props;
    const { visibleItems } = useAutocompleteUi();
    const items = visibleItems;

    const list =
        items.length === 0
            ? (noResultsContent ?? <AutocompleteNoResults>{noResultsText}</AutocompleteNoResults>)
            : items.map((item) =>
                  renderItem ? (
                      renderItem(item)
                  ) : (
                      <Item
                          item={item}
                          key={item.value}
                      >
                          {item.label}
                      </Item>
                  )
              );

    return (
        <Popover.Content
            motionProps={motionProps}
            role="presentation"
            rootProps={rootProps}
            tabIndex={-1}
            {...contentProps}
        >
            <AutocompleteListbox>{list}</AutocompleteListbox>
        </Popover.Content>
    );
}

export interface AutocompleteVirtualContentProps extends AutocompleteContentProps {
    estimatedItemHeight?: number;
    overscan?: number;
    maxHeight?: number;
}

export function VirtualContent(props: AutocompleteVirtualContentProps) {
    const {
        estimatedItemHeight = 32,
        overscan = 5,
        maxHeight = 300,
        noResultsText = "No results found",
        noResultsContent,
        renderItem,
        motionProps,
        rootProps,
        ...contentProps
    } = props;
    const { visibleItems } = useAutocompleteUi();
    const api = useArkComboboxContext();
    const items = visibleItems;

    const list =
        items.length === 0
            ? (noResultsContent ?? <AutocompleteNoResults>{noResultsText}</AutocompleteNoResults>)
            : (
                  <AutocompleteVirtualizedList
                      estimatedItemHeight={estimatedItemHeight}
                      items={items}
                      isOpen={api.open}
                      maxHeight={maxHeight}
                      overscan={overscan}
                      renderItem={renderItem}
                  />
              );

    return (
        <Popover.Content
            motionProps={motionProps}
            role="presentation"
            rootProps={rootProps}
            tabIndex={-1}
            {...contentProps}
        >
            <AutocompleteListbox>{list}</AutocompleteListbox>
        </Popover.Content>
    );
}

interface AutocompleteVirtualizedListProps {
    items: AutocompleteItem[];
    estimatedItemHeight: number;
    overscan: number;
    maxHeight: number;
    isOpen: boolean;
    renderItem?: (item: AutocompleteItem) => ReactNode;
}

function AutocompleteVirtualizedList({
    items,
    estimatedItemHeight,
    overscan,
    maxHeight,
    isOpen,
    renderItem
}: AutocompleteVirtualizedListProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const api = useArkComboboxContext();

    const virtualizer = useVirtualizer({
        count: items.length,
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
        const highlightedValue = api.highlightedValue;
        if (!highlightedValue) return;
        const index = items.findIndex((entry) => entry.value === highlightedValue);
        if (index >= 0) {
            virtualizer.scrollToIndex(index, { align: "auto" });
        }
    }, [api.highlightedValue, items, virtualizer]);

    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    return (
        <div
            ref={scrollContainerRef}
            style={{ maxHeight, overflowY: "auto", width: "100%" }}
        >
            <div style={{ height: totalSize, position: "relative", width: "100%" }}>
                {virtualItems.map((virtualItem) => {
                    const item = items[virtualItem.index];
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
                                    item={item}
                                    key={item.value}
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

export interface AutocompleteItemProps extends Omit<HTMLDreamyProps<"button">, "value"> {
    item?: AutocompleteItem;
    value?: string;
    index?: number;
    children?: ReactNode;
}

export const Item = withContext(function AutocompleteItem({
    item: itemProp,
    value,
    children,
    ...rest
}: AutocompleteItemProps) {
    const api = useArkComboboxContext();
    const { onChangeValue } = useAutocompleteUi();
    const item =
        itemProp ??
        api.collection.items.find((entry) => entry.value === value) ??
        ({ value: value ?? "", label: children?.toString() ?? "" } as AutocompleteItem);
    const state = api.getItemState({ item });
    const itemProps = api.getItemProps({ item });

    return (
        <AutocompleteItemButton
            {...itemProps}
            {...rest}
            data-focused={dataAttr(state.highlighted)}
            data-selected={dataAttr(state.selected)}
            onClick={(event) => {
                itemProps.onClick?.(event);
                onChangeValue?.(item.value);
            }}
            type="button"
        >
            {children ?? <ArkCombobox.ItemText>{item.label}</ArkCombobox.ItemText>}
            {state.selected && <AutocompleteItemIndicator />}
        </AutocompleteItemButton>
    );
}, "item");

const AutocompleteItemButton = withContext(dreamy.button, "item");
