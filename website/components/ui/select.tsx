"use client";

import {
    Select as ArkSelect,
    createListCollection,
    useSelectContext as useArkSelectContext,
    type SelectRootProps as ArkSelectRootProps,
    type SelectValueChangeDetails
} from "@ark-ui/react/select";
import {
    type PositioningProps,
    ariaAttr,
    dataAttr,
    useControllableState,
    useFieldProps,
    useReducedMotion,
    useSafeLayoutEffect
} from "@dreamy-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type React from "react";
import {
    type ReactNode,
    type SVGProps,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { cx } from "styled-system/css";
import { type HTMLDreamyProps, createStyleContext, dreamy, splitCssProps } from "styled-system/jsx";
import { type SelectVariantProps, select } from "styled-system/recipes";
import { Box } from "./box";
import * as Popover from "./popover";
import type { PopoverContentProps } from "./popover";
import { SelectUiProvider, useSelectUi, type SelectItemData } from "./select-ui-context";

export type { SelectItemData };

const { withProvider, withContext } = createStyleContext(select);

export type SelectLayer = "dropdown" | "popover" | "tooltip";

export type SelectPopoverProps = Omit<
    Popover.PopoverProps,
    "positioning" | "children" | "open" | "defaultOpen" | "onOpenChange"
>;

export interface SelectProps<
    T extends boolean = false,
    Item extends SelectItemData = SelectItemData
> extends Omit<
            ArkSelectRootProps<Item>,
            | "collection"
            | "value"
            | "defaultValue"
            | "onValueChange"
            | "multiple"
            | "disabled"
            | "invalid"
            | "required"
            | "positioning"
            | "closeOnSelect"
            | "onChange"
        >,
        SelectVariantProps,
        Omit<HTMLDreamyProps<"div">, keyof ArkSelectRootProps<Item> | "items" | "onChange"> {
    items: Item[];
    renderItem?: (item: Item) => ReactNode;
    layer?: SelectLayer;
    contentZIndex?: string;
    positioning?: PositioningProps;
    popoverProps?: SelectPopoverProps;
    isMultiple?: T;
    selectedStrategy?: "checkmark" | "background" | "both";
    isClearable?: boolean;
    reduceMotion?: boolean;
    closeOnSelect?: boolean;
    isDisabled?: boolean;
    isInvalid?: boolean;
    isRequired?: boolean;
    defaultValue?: T extends true ? string[] : string;
    value?: T extends true ? string[] : string;
    onChangeValue?: (value: T extends true ? string[] : string) => void;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    name?: string;
    autoComplete?: string;
    hiddenSelectProps?: React.ComponentPropsWithoutRef<"select">;
    children?: ReactNode;
}

function toValueArray<T extends boolean>(
    value: string | string[] | undefined,
    isMultiple: T
): string[] | undefined {
    if (value === undefined) return undefined;
    return isMultiple ? (value as string[]) : [value as string];
}

function SelectRoot<T extends boolean = false, Item extends SelectItemData = SelectItemData>(
    props: SelectProps<T, Item>
) {
    const {
        children,
        items,
        renderItem,
        layer,
        contentZIndex: contentZIndexProp,
        positioning,
        popoverProps,
        isMultiple = false as T,
        selectedStrategy = "both",
        isClearable = false,
        reduceMotion: reduceMotionProp,
        closeOnSelect,
        open: openProp,
        defaultOpen,
        onOpenChange,
        isDisabled,
        isInvalid,
        isRequired,
        defaultValue,
        value,
        onChangeValue,
        onChange,
        name,
        autoComplete = "off",
        hiddenSelectProps,
        className,
        ...rest
    } = props;

    const [, arkRest] = splitCssProps(rest);

    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? popoverProps?.reduceMotion ?? globalReduceMotion ?? false;

    const resolvedContentZIndex =
        contentZIndexProp ?? (layer ? `var(--z-index-${layer})` : "var(--z-index-dropdown)");

    const {
        isDisabled: isDisabledField = false,
        isRequired: isRequiredField = false,
        isInvalid: isInvalidField = false,
        id: fieldId,
        "aria-describedby": ariaDescribedByField
    } = useFieldProps({
        isDisabled,
        isInvalid,
        isRequired,
        id: props.id
    });

    const resolvedIsDisabled = isDisabled ?? isDisabledField;
    const resolvedIsRequired = isRequired ?? isRequiredField;
    const resolvedIsInvalid = isInvalid ?? isInvalidField;

    const collection = useMemo(
        () =>
            createListCollection({
                items: items as SelectItemData[],
                itemToValue: (item) => item.value,
                itemToString: (item) => item.label,
                isItemDisabled: (item) => !!item.disabled
            }),
        [items]
    );

    const handleValueChange = useCallback(
        (details: SelectValueChangeDetails<Item>) => {
            const next = details.value;
            if (isMultiple) {
                onChangeValue?.(next as T extends true ? string[] : string);
            } else {
                onChangeValue?.((next[0] ?? "") as T extends true ? string[] : string);
            }
        },
        [isMultiple, onChangeValue]
    );

    const handleSelect = useCallback(
        (details: { value: string }) => {
            if (isMultiple) return;
            onChangeValue?.(details.value as T extends true ? string[] : string);
        },
        [isMultiple, onChangeValue]
    );

    const [open, setOpen] = useControllableState({
        value: openProp,
        defaultValue: defaultOpen
    });

    const handleOpenChange = useCallback(
        (details: Parameters<NonNullable<ArkSelectRootProps<Item>["onOpenChange"]>>[0]) => {
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

    const uiValue = useMemo(
        () => ({
            items: items as SelectItemData[],
            renderItem: renderItem as ((item: SelectItemData) => ReactNode) | undefined,
            selectedStrategy,
            isClearable,
            triggerFieldProps: {
                id: fieldId,
                "aria-describedby": ariaDescribedByField,
                "aria-invalid": ariaAttr(resolvedIsInvalid),
                "aria-required": ariaAttr(resolvedIsRequired)
            },
            onSingleValueChange: isMultiple
                ? undefined
                : (nextValue: string) => {
                      onChangeValue?.(nextValue as T extends true ? string[] : string);
                  }
        }),
        [
            ariaDescribedByField,
            fieldId,
            isClearable,
            isMultiple,
            onChangeValue,
            items,
            renderItem,
            resolvedIsInvalid,
            resolvedIsRequired,
            selectedStrategy
        ]
    );

    const controlledValue = toValueArray(value, isMultiple);
    const controlledDefaultValue = toValueArray(defaultValue, isMultiple);

    return (
        <SelectUiProvider value={uiValue}>
            <ArkSelect.Root
                {...(arkRest as ArkSelectRootProps<Item>)}
                autoComplete={autoComplete}
                className={cx("group", className)}
                closeOnSelect={closeOnSelect ?? !isMultiple}
                collection={collection as unknown as ArkSelectRootProps<Item>["collection"]}
                composite
                data-selected-strategy={selectedStrategy}
                disabled={resolvedIsDisabled}
                immediate
                invalid={resolvedIsInvalid}
                lazyMount={false}
                multiple={isMultiple}
                name={name}
                required={resolvedIsRequired}
                translations={{ clearTriggerLabel: "Clear selection" }}
                unmountOnExit={false}
                open={open}
                {...(controlledValue !== undefined ? { value: controlledValue } : {})}
                {...(controlledDefaultValue !== undefined ? { defaultValue: controlledDefaultValue } : {})}
                onOpenChange={handleOpenChange}
                onSelect={handleSelect}
                onValueChange={handleValueChange}
            >
                <ArkSelect.HiddenSelect
                    {...hiddenSelectProps}
                    onChange={onChange}
                />
                <SelectValueChangeBridge
                    isMultiple={isMultiple}
                    onChangeValue={onChangeValue as (value: string | string[]) => void}
                />
                <SelectFocusBridge />
                <Popover.Root
                    {...restPopoverProps}
                    autoFocus={false}
                    closeOnEscape={false}
                    closeOnInteractOutside={false}
                    modal={false}
                    open={open}
                    onOpenChange={handleOpenChange}
                    positioning={popoverPositioning}
                    portalProps={{
                        zIndex: resolvedContentZIndex,
                        ...popoverProps?.portalProps
                    }}
                    reduceMotion={reduceMotion}
                    restoreFocus={false}
                    size={popoverSize ?? "reference"}
                >
                    {children}
                </Popover.Root>
            </ArkSelect.Root>
        </SelectUiProvider>
    );
}

interface SelectValueChangeBridgeProps {
    isMultiple: boolean;
    onChangeValue?: (value: string | string[]) => void;
}

function focusSelectTrigger(api: { focus: () => void }) {
    api.focus();
    requestAnimationFrame(() => {
        api.focus();
    });
}

function SelectFocusBridge() {
    const api = useArkSelectContext();
    const wasOpen = useRef(api.open);

    useLayoutEffect(() => {
        if (wasOpen.current && !api.open) {
            focusSelectTrigger(api);
        }
        wasOpen.current = api.open;
    }, [api, api.open]);

    return null;
}

function SelectValueChangeBridge({ isMultiple, onChangeValue }: SelectValueChangeBridgeProps) {
    const api = useArkSelectContext();
    const previousValue = useRef(api.valueAsString);

    useEffect(() => {
        const next = api.valueAsString;
        if (next === previousValue.current) return;
        previousValue.current = next;

        if (!onChangeValue) return;

        if (isMultiple) {
            onChangeValue(api.value);
            return;
        }

        onChangeValue(api.value[0] ?? "");
    }, [api.value, api.valueAsString, isMultiple, onChangeValue]);

    return null;
}

export const Root: <T extends boolean = false, Item extends SelectItemData = SelectItemData>(
    props: SelectProps<T, Item>
) => React.JSX.Element = withProvider(SelectRoot, "root") as <
    T extends boolean = false,
    Item extends SelectItemData = SelectItemData
>(props: SelectProps<T, Item>) => React.JSX.Element;

const TriggerButton = withContext(dreamy.button, "trigger");
const SelectAnchor = withContext(dreamy.div, "control");

export interface SelectTriggerProps extends HTMLDreamyProps<"button"> {
    icon?: React.ReactNode;
    placeholder?: string;
    multipleSelectedText?: (selectedLabels: string[]) => string;
    children?: ReactNode;
}

export function Trigger({
    children,
    placeholder,
    icon,
    multipleSelectedText,
    ...rest
}: SelectTriggerProps) {
    const { triggerFieldProps, renderItem, isClearable, selectedStrategy } = useSelectUi();
    const api = useArkSelectContext();
    const selectedItems = api.selectedItems as SelectItemData[];
    const selectedNames = selectedItems.map((item) => item.label);

    function getDisplayContent() {
        if (selectedItems.length === 0) return placeholder;

        if (renderItem) {
            if (selectedItems.length === 1) {
                return renderItem(selectedItems[0]);
            }

            return selectedItems.map((item, index) => (
                <span key={item.value}>
                    {index > 0 ? ", " : null}
                    {renderItem(item)}
                </span>
            ));
        }

        if (selectedNames.length === 1) return selectedNames[0];
        return multipleSelectedText?.(selectedNames) ?? selectedNames.join(", ");
    }

    const showClear = isClearable && api.value.length > 0;

    return (
        <Popover.Anchor>
            <SelectAnchor>
                <ArkSelect.Trigger asChild>
                    <TriggerButton
                        {...triggerFieldProps}
                        {...rest}
                        data-part="trigger"
                        data-open={dataAttr(api.open)}
                        data-placeholder-shown={dataAttr(api.value.length === 0)}
                        data-selected-strategy={selectedStrategy}
                        type="button"
                        onKeyDown={(event) => {
                            rest.onKeyDown?.(event);
                            if (event.defaultPrevented) return;
                            if (event.key === "Escape" && api.open) {
                                event.preventDefault();
                                api.setOpen(false);
                            }
                        }}
                    >
                {icon && icon}
                <dreamy.span data-part="value">{children ?? getDisplayContent()}</dreamy.span>
                <SelectIndicatorGroup>
                    {showClear && (
                        <SelectClearButton
                            aria-label="Clear selection"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                api.clearValue();
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    api.clearValue();
                                }
                            }}
                            role="button"
                            tabIndex={0}
                        />
                    )}
                    <ArkSelect.Indicator asChild>
                        <SelectIndicator />
                    </ArkSelect.Indicator>
                </SelectIndicatorGroup>
                    </TriggerButton>
                </ArkSelect.Trigger>
            </SelectAnchor>
        </Popover.Anchor>
    );
}

export interface SelectContentProps extends Omit<PopoverContentProps, "children" | "transition"> {
    showItems?: boolean;
    children?: ReactNode;
}

const SelectContentEl = withContext(ArkSelect.Content, "content");

function SelectListbox({ children }: { children: ReactNode }) {
    const api = useArkSelectContext();

    return (
        <SelectContentEl
            aria-hidden={!api.open}
            hidden={false}
            tabIndex={api.open ? 0 : -1}
            onKeyDown={(event) => {
                if (event.key === "Escape" && api.open) {
                    event.preventDefault();
                    api.setOpen(false);
                }
            }}
        >
            {children}
        </SelectContentEl>
    );
}

export function Content(props: SelectContentProps) {
    const { showItems = true, children, motionProps, rootProps, ...contentProps } = props;
    const { items, renderItem, selectedStrategy } = useSelectUi();

    const list = showItems
        ? items.map((item) => (
              <SelectListItem
                  item={item}
                  key={item.value}
                  renderItem={renderItem}
                  selectedStrategy={selectedStrategy}
              />
          ))
        : children;

    return (
        <Popover.Content
            motionProps={motionProps}
            role="presentation"
            rootProps={rootProps}
            tabIndex={-1}
            {...contentProps}
        >
            <SelectListbox>{list}</SelectListbox>
        </Popover.Content>
    );
}

export interface SelectVirtualContentProps extends SelectContentProps {
    estimatedItemHeight?: number;
    overscan?: number;
    maxHeight?: number;
}

export function VirtualContent(props: SelectVirtualContentProps) {
    const {
        estimatedItemHeight = 32,
        overscan = 5,
        maxHeight = 300,
        showItems = true,
        children,
        motionProps,
        rootProps,
        ...contentProps
    } = props;

    const { items, renderItem, selectedStrategy } = useSelectUi();
    const api = useArkSelectContext();

    const list = showItems ? (
        <VirtualizedList
            estimatedItemHeight={estimatedItemHeight}
            isOpen={api.open}
            items={items}
            maxHeight={maxHeight}
            overscan={overscan}
            renderItem={renderItem}
            selectedStrategy={selectedStrategy}
        />
    ) : (
        children
    );

    return (
        <Popover.Content
            motionProps={motionProps}
            role="presentation"
            rootProps={rootProps}
            tabIndex={-1}
            {...contentProps}
        >
            <SelectListbox>{list}</SelectListbox>
        </Popover.Content>
    );
}

interface SelectListItemProps {
    item: SelectItemData;
    renderItem?: (item: SelectItemData) => ReactNode;
    selectedStrategy: "checkmark" | "background" | "both";
}

const SelectItemEl = withContext(ArkSelect.Item, "item");

function SelectListItem({ item, renderItem, selectedStrategy }: SelectListItemProps) {
    const api = useArkSelectContext();
    const { onSingleValueChange } = useSelectUi();
    const state = api.getItemState({ item });

    return (
        <SelectItemEl
            item={item}
            data-focused={dataAttr(state.highlighted)}
            data-selected={dataAttr(state.selected)}
            data-selected-strategy={selectedStrategy}
            onClick={() => {
                onSingleValueChange?.(item.value);
            }}
        >
            {renderItem ? renderItem(item) : <ArkSelect.ItemText>{item.label}</ArkSelect.ItemText>}
            {(selectedStrategy === "checkmark" || selectedStrategy === "both") && state.selected && (
                <ArkSelect.ItemIndicator asChild>
                    <SelectItemIndicator />
                </ArkSelect.ItemIndicator>
            )}
        </SelectItemEl>
    );
}

export const Item = SelectListItem;

interface VirtualizedListProps {
    items: SelectItemData[];
    renderItem?: (item: SelectItemData) => ReactNode;
    estimatedItemHeight: number;
    overscan: number;
    maxHeight: number;
    isOpen: boolean;
    selectedStrategy: "checkmark" | "background" | "both";
}

function VirtualizedList({
    items,
    renderItem,
    estimatedItemHeight,
    overscan,
    maxHeight,
    isOpen,
    selectedStrategy
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
                                  item={item}
                                  renderItem={renderItem}
                                  selectedStrategy={selectedStrategy}
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
                                  item={items[virtualItem.index]}
                                  renderItem={renderItem}
                                  selectedStrategy={selectedStrategy}
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
    return (
        <dreamy.button
            type="button"
            {...props}
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
        </dreamy.button>
    );
}, "clearButton");
