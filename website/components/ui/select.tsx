"use client";

import {
    type DreamyHostProps,
    type PositioningProps,
    type UiSdkMotionController,
    UiSdkMotionSync,
    ariaAttr,
    mergeMotionRefs,
    transformReducedMotion,
    useFieldProps,
    useMotionVariants,
    useReducedMotion,
    useSafeLayoutEffect,
    useUiSdkMotion
} from "@dreamy-ui/react";
import type { ChangeDetails } from "@ui-sdk/core";
import {
    Select as UiSdkSelect,
    SelectClear as UiSdkSelectClear,
    SelectContent as UiSdkSelectContent,
    SelectEmpty as UiSdkSelectEmpty,
    SelectGroup as UiSdkSelectGroup,
    SelectGroupLabel as UiSdkSelectGroupLabel,
    SelectInput as UiSdkSelectInput,
    SelectItem as UiSdkSelectItem,
    SelectItemIndicator as UiSdkSelectItemIndicator,
    SelectItemText as UiSdkSelectItemText,
    SelectList as UiSdkSelectList,
    type SelectOpenChangeReason,
    type SelectProps as UiSdkSelectProps,
    SelectSeparator as UiSdkSelectSeparator,
    SelectTrigger as UiSdkSelectTrigger,
    SelectValue as UiSdkSelectValue,
    type SelectValueChangeReason
} from "@ui-sdk/react/select";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Variants } from "motion/react";
import type React from "react";
import {
    type CSSProperties,
    type ReactNode,
    type SVGProps,
    useMemo,
    useRef,
    useState
} from "react";
import { css, cx } from "styled-system/css";
import {
    type HTMLDreamyProps,
    createStyleContext,
    dreamy,
    splitCssProps
} from "styled-system/jsx";
import { type SelectVariantProps, select } from "styled-system/recipes";
import { MotionBox } from "./motion";
import { mapUiSdkPositioning } from "./map-positioning";
import { type SelectItemData, SelectUiProvider, useSelectUi } from "./select-ui-context";

export type { SelectItemData };

const { withProvider, withContext } = createStyleContext(select);

type UiSdkSelectBaseProps = Omit<
    UiSdkSelectProps<string, boolean>,
    "children" | "items" | "multiple" | "value" | "defaultValue" | "onValueChange"
>;

export interface SelectProps<
    T extends boolean = false,
    Item extends SelectItemData = SelectItemData
> extends UiSdkSelectBaseProps,
        SelectVariantProps,
        Omit<
            HTMLDreamyProps<"div">,
            | keyof UiSdkSelectBaseProps
            | "items"
            | "value"
            | "defaultValue"
            | "onValueChange"
            | "onChange"
            | "multiple"
            | "children"
        > {
    items: Item[];
    renderItem?: (item: Item) => ReactNode;
    positioning?: PositioningProps;
    multiple?: T;
    selectedStrategy?: "checkmark" | "background" | "both";
    clearable?: boolean;
    reduceMotion?: boolean;
    invalid?: boolean;
    defaultValue?: T extends true ? string[] : string | null;
    value?: T extends true ? string[] : string | null;
    onValueChange?: (
        value: T extends true ? string[] : string | null,
        details: ChangeDetails<SelectValueChangeReason>
    ) => void;
    onOpenChange?: (open: boolean, details: ChangeDetails<SelectOpenChangeReason>) => void;
    children?: ReactNode;
}

function SelectRoot<T extends boolean = false, Item extends SelectItemData = SelectItemData>(
    props: SelectProps<T, Item>
) {
    const {
        children,
        items,
        renderItem,
        positioning,
        multiple = false as T,
        selectedStrategy = "both",
        clearable = false,
        reduceMotion: reduceMotionProp,
        open,
        defaultOpen,
        onOpenChange,
        onOpenChangeComplete,
        disabled,
        readOnly,
        invalid,
        required,
        defaultValue,
        value,
        onValueChange,
        name,
        form,
        autoComplete,
        placeholder,
        loop,
        modal,
        presentation,
        dismissible,
        onDismissAttempt,
        controller,
        debug,
        container,
        query,
        defaultQuery,
        onQueryChange,
        filter,
        status,
        onLoadMore,
        announcement,
        onHighlight,
        className,
        id,
        ...rest
    } = props;

    const [cssProps, domProps] = splitCssProps(rest);
    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? globalReduceMotion ?? false;
    const motion = useUiSdkMotion({ open, defaultOpen, reduceMotion });
    const handleOpenChange = motion.wrapOnOpenChange(onOpenChange);

    const {
        isDisabled: isDisabledField = false,
        isRequired: isRequiredField = false,
        isInvalid: isInvalidField = false,
        isReadOnly: isReadOnlyField = false,
        id: fieldId,
        "aria-describedby": ariaDescribedByField
    } = useFieldProps({
        isDisabled: disabled,
        isInvalid: invalid,
        isRequired: required,
        isReadOnly: readOnly,
        id
    });

    const resolvedDisabled = disabled ?? isDisabledField;
    const resolvedRequired = required ?? isRequiredField;
    const resolvedInvalid = invalid ?? isInvalidField;
    const resolvedReadOnly = readOnly ?? isReadOnlyField;

    const uiValue = useMemo(
        () => ({
            items: items as SelectItemData[],
            renderItem: renderItem as ((item: SelectItemData) => ReactNode) | undefined,
            selectedStrategy,
            clearable,
            multiple: Boolean(multiple),
            reduceMotion,
            motion,
            positioning,
            triggerFieldProps: {
                id: fieldId,
                "aria-describedby": ariaDescribedByField,
                "aria-invalid": ariaAttr(resolvedInvalid),
                "data-invalid": resolvedInvalid ? "" : undefined
            }
        }),
        [
            ariaDescribedByField,
            clearable,
            fieldId,
            items,
            motion,
            multiple,
            positioning,
            reduceMotion,
            renderItem,
            resolvedInvalid,
            selectedStrategy
        ]
    );

    const listItems = useMemo(
        () =>
            items.map((item) => ({
                value: item.value,
                label: item.label,
                disabled: item.disabled
            })),
        [items]
    );

    return (
        <dreamy.div
            {...domProps}
            className={cx("group", className as string | undefined, css(cssProps))}
            data-selected-strategy={selectedStrategy}
        >
            <SelectUiProvider value={uiValue}>
                <UiSdkSelect
                    announcement={announcement}
                    autoComplete={autoComplete}
                    container={container}
                    controller={controller}
                    debug={debug}
                    defaultOpen={defaultOpen}
                    defaultQuery={defaultQuery}
                    defaultValue={defaultValue as never}
                    disabled={resolvedDisabled}
                    dismissible={dismissible}
                    filter={filter}
                    form={form}
                    items={listItems}
                    loop={loop}
                    modal={modal}
                    multiple={multiple as never}
                    name={name}
                    onDismissAttempt={onDismissAttempt}
                    onHighlight={onHighlight}
                    onLoadMore={onLoadMore}
                    onOpenChange={handleOpenChange}
                    onOpenChangeComplete={onOpenChangeComplete}
                    onQueryChange={onQueryChange}
                    onValueChange={onValueChange as never}
                    open={open}
                    placeholder={placeholder}
                    presentation={presentation}
                    query={query}
                    readOnly={resolvedReadOnly}
                    required={resolvedRequired}
                    status={status}
                    value={value as never}
                >
                    <UiSdkMotionSync
                        controller={motion}
                        open={open}
                    />
                    {children}
                </UiSdkSelect>
            </SelectUiProvider>
        </dreamy.div>
    );
}

/**
 * Select component — dropdown list for single or multiple selection.
 *
 * @see Docs https://dreamy-ui.com/docs/components/select
 */
export const Root: <T extends boolean = false, Item extends SelectItemData = SelectItemData>(
    props: SelectProps<T, Item>
) => React.JSX.Element = withProvider(SelectRoot, "root") as <
    T extends boolean = false,
    Item extends SelectItemData = SelectItemData
>(
    props: SelectProps<T, Item>
) => React.JSX.Element;

const SelectAnchor = withContext(dreamy.div, "control");

export interface SelectTriggerProps extends Omit<HTMLDreamyProps<"button">, "children"> {
    icon?: ReactNode;
    placeholder?: string;
    multipleSelectedText?: (selectedLabels: string[]) => string;
    children?: ReactNode;
}

export const Trigger = withContext(function SelectTrigger({
    children,
    placeholder,
    icon,
    multipleSelectedText,
    className,
    style,
    ...rest
}: SelectTriggerProps) {
    const { items, triggerFieldProps, renderItem, clearable, selectedStrategy } = useSelectUi();
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    const itemByValue = useMemo(() => {
        const map = new Map<string, SelectItemData>();
        for (const item of items) {
            map.set(item.value, item);
        }
        return map;
    }, [items]);

    return (
        <SelectAnchor>
            <UiSdkSelectTrigger
                {...(triggerFieldProps as Record<string, unknown>)}
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkSelectTrigger>)}
                className={mergedClassName}
                data-selected-strategy={selectedStrategy}
                style={style as CSSProperties | undefined}
            >
                {icon ? icon : null}
                <UiSdkSelectValue
                    data-part="value"
                    placeholder={placeholder}
                >
                    {(state) => {
                        if (children !== undefined) return children;
                        if (state.placeholder) return placeholder ?? "";

                        const values = Array.isArray(state.value)
                            ? (state.value as string[])
                            : state.value != null
                              ? [String(state.value)]
                              : [];

                        if (renderItem && values.length > 0) {
                            const selected = values
                                .map((v) => itemByValue.get(v))
                                .filter((entry): entry is SelectItemData => Boolean(entry));
                            if (selected.length === 1) {
                                return renderItem(selected[0]);
                            }
                            if (selected.length > 1) {
                                return selected.map((entry, index) => (
                                    <span key={entry.value}>
                                        {index > 0 ? ", " : null}
                                        {renderItem(entry)}
                                    </span>
                                ));
                            }
                        }

                        if (state.labels.length > 1 && multipleSelectedText) {
                            return multipleSelectedText(state.labels);
                        }

                        return state.label;
                    }}
                </UiSdkSelectValue>
                <SelectIndicatorGroup>
                    <SelectIndicator />
                </SelectIndicatorGroup>
            </UiSdkSelectTrigger>
            {clearable ? <SelectClearButton aria-label="Clear selection" /> : null}
        </SelectAnchor>
    );
}, "trigger");

type UiSdkSelectContentProps = React.ComponentProps<typeof UiSdkSelectContent>;
type UiSdkSelectContentPickedProps = Pick<
    UiSdkSelectContentProps,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "arrowPadding"
    | "anchor"
    | "container"
    | "alignItemWithTrigger"
    | "keepMounted"
>;

export interface SelectContentProps
    extends DreamyHostProps<HTMLDreamyProps<"div">, UiSdkSelectContentPickedProps, "children">,
        UiSdkSelectContentPickedProps {
    showItems?: boolean;
    children?: ReactNode;
}

function renderSelectPopoverMotion(
    motion: UiSdkMotionController,
    popoverVariants: Variants,
    reduceMotion: boolean
): UiSdkSelectContentProps["render"] {
    return (partProps, state) => {
        const {
            ref: partRef,
            style: partStyle,
            children: partChildren,
            ...restPartProps
        } = partProps as React.ComponentPropsWithRef<"div">;
        const isOpen = (state as { open?: boolean })?.open ?? motion.isOpen;

        return (
            <MotionBox
                {...(restPartProps as Record<string, unknown>)}
                animate={isOpen ? "initial" : "exit"}
                initial={reduceMotion ? false : "exit"}
                onAnimationComplete={() => {
                    if (!isOpen) {
                        motion.notifyAnimationComplete("content");
                    }
                }}
                ref={mergeMotionRefs(partRef, (el) => {
                    motion.register("content", el as HTMLElement | null);
                })}
                style={partStyle as CSSProperties | undefined}
                variants={transformReducedMotion(popoverVariants, reduceMotion)}
            >
                {partChildren}
            </MotionBox>
        );
    };
}

export const Content = withContext(function SelectContent(props: SelectContentProps) {
    const {
        showItems = true,
        children,
        className,
        style,
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding,
        arrowPadding,
        anchor,
        container,
        alignItemWithTrigger,
        keepMounted,
        ...rest
    } = props;
    const { items, renderItem, selectedStrategy, positioning, reduceMotion, motion } =
        useSelectUi();
    const { popover: popoverVariants } = useMotionVariants();
    const mapped = mapUiSdkPositioning(positioning);
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

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
        <UiSdkSelectContent
            {...(domProps as unknown as UiSdkSelectContentProps)}
            align={align ?? mapped.align ?? "start"}
            alignItemWithTrigger={alignItemWithTrigger}
            alignOffset={alignOffset ?? mapped.alignOffset}
            anchor={anchor}
            arrowPadding={arrowPadding ?? mapped.arrowPadding}
            className={mergedClassName}
            collisionPadding={collisionPadding ?? mapped.collisionPadding}
            container={container}
            data-reduce-motion={reduceMotion ? "" : undefined}
            keepMounted={keepMounted}
            render={renderSelectPopoverMotion(motion, popoverVariants, reduceMotion)}
            side={side ?? mapped.side ?? "bottom"}
            sideOffset={sideOffset ?? mapped.sideOffset ?? 6}
            style={style as CSSProperties | undefined}
        >
            {list}
        </UiSdkSelectContent>
    );
}, "content");

export interface SelectVirtualContentProps extends SelectContentProps {
    estimatedItemHeight?: number;
    overscan?: number;
    maxHeight?: number;
}

export const VirtualContent = withContext(function SelectVirtualContent(
    props: SelectVirtualContentProps
) {
    const {
        estimatedItemHeight = 32,
        overscan = 5,
        maxHeight = 300,
        showItems = true,
        children,
        className,
        style,
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding,
        arrowPadding,
        anchor,
        container,
        alignItemWithTrigger,
        keepMounted,
        ...rest
    } = props;

    const { items, renderItem, selectedStrategy, positioning, reduceMotion, motion } =
        useSelectUi();
    const { popover: popoverVariants } = useMotionVariants();
    const mapped = mapUiSdkPositioning(positioning);
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    return (
        <UiSdkSelectContent
            {...(domProps as unknown as UiSdkSelectContentProps)}
            align={align ?? mapped.align ?? "start"}
            alignItemWithTrigger={alignItemWithTrigger}
            alignOffset={alignOffset ?? mapped.alignOffset}
            anchor={anchor}
            arrowPadding={arrowPadding ?? mapped.arrowPadding}
            className={mergedClassName}
            collisionPadding={collisionPadding ?? mapped.collisionPadding}
            container={container}
            data-reduce-motion={reduceMotion ? "" : undefined}
            keepMounted={keepMounted}
            render={renderSelectPopoverMotion(motion, popoverVariants, reduceMotion)}
            side={side ?? mapped.side ?? "bottom"}
            sideOffset={sideOffset ?? mapped.sideOffset ?? 6}
            style={style as CSSProperties | undefined}
        >
            {(state) =>
                showItems ? (
                    <VirtualizedList
                        estimatedItemHeight={estimatedItemHeight}
                        isOpen={state.open}
                        items={items}
                        maxHeight={maxHeight}
                        overscan={overscan}
                        renderItem={renderItem}
                        selectedStrategy={selectedStrategy}
                    />
                ) : (
                    children
                )
            }
        </UiSdkSelectContent>
    );
}, "content");

interface SelectListItemProps {
    item: SelectItemData;
    renderItem?: (item: SelectItemData) => ReactNode;
    selectedStrategy: "checkmark" | "background" | "both";
    index?: number;
}

const SelectItemSlot = withContext(function SelectItemSlotBase(
    props: React.ComponentProps<typeof UiSdkSelectItem>
) {
    return <UiSdkSelectItem {...props} />;
}, "item");

function SelectListItem({ item, renderItem, selectedStrategy, index }: SelectListItemProps) {
    return (
        <SelectItemSlot
            data-selected-strategy={selectedStrategy}
            disabled={item.disabled}
            index={index}
            label={item.label}
            value={item.value}
        >
            {renderItem ? renderItem(item) : <UiSdkSelectItemText>{item.label}</UiSdkSelectItemText>}
            {selectedStrategy === "checkmark" || selectedStrategy === "both" ? (
                <UiSdkSelectItemIndicator render={<SelectItemIndicator />} />
            ) : null}
        </SelectItemSlot>
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
                                  index={index}
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
                                  index={virtualItem.index}
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

const SelectIndicatorGroup = withContext(dreamy.span, "indicatorGroup");

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

export interface SelectClearButtonProps
    extends Omit<React.ComponentProps<typeof UiSdkSelectClear>, "children"> {}

const SelectClearButton = withContext(function SelectClearButton(props: SelectClearButtonProps) {
    return (
        <UiSdkSelectClear {...props}>
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
        </UiSdkSelectClear>
    );
}, "clearButton");

export const Group = UiSdkSelectGroup;
export const GroupLabel = UiSdkSelectGroupLabel;
export const Separator = UiSdkSelectSeparator;
export const Input = UiSdkSelectInput;
export const Empty = UiSdkSelectEmpty;
export const List = UiSdkSelectList;
