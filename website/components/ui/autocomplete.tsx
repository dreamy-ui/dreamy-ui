"use client";

import {
    type DreamyHostProps,
    type PositioningProps,
    type UiSdkMotionController,
    UiSdkMotionSync,
    ariaAttr,
    dataAttr,
    mergeMotionRefs,
    transformReducedMotion,
    useFieldProps,
    useMotionVariants,
    useReducedMotion,
    useUiSdkMotion
} from "@dreamy-ui/react";
import type { ChangeDetails } from "@ui-sdk/core";
import {
    Combobox as UiSdkCombobox,
    ComboboxClear as UiSdkComboboxClear,
    ComboboxContent as UiSdkComboboxContent,
    ComboboxEmpty as UiSdkComboboxEmpty,
    ComboboxInput as UiSdkComboboxInput,
    ComboboxItem as UiSdkComboboxItem,
    ComboboxItemIndicator as UiSdkComboboxItemIndicator,
    ComboboxItemText as UiSdkComboboxItemText,
    ComboboxList as UiSdkComboboxList,
    type ComboboxOpenChangeReason,
    type ComboboxProps as UiSdkComboboxProps,
    ComboboxTrigger as UiSdkComboboxTrigger,
    type ComboboxValueChangeReason
} from "@ui-sdk/react/combobox";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Variants } from "motion/react";
import type React from "react";
import {
    type CSSProperties,
    type ReactNode,
    type SVGProps,
    useEffect,
    useMemo,
    useRef
} from "react";
import { css, cx } from "styled-system/css";
import {
    type HTMLDreamyProps,
    createStyleContext,
    dreamy,
    splitCssProps
} from "styled-system/jsx";
import {
    type AutocompleteVariantProps,
    autocomplete,
    input as inputRecipe
} from "styled-system/recipes";
import type { InputProps } from "./input";
import { MotionBox } from "./motion";
import { mapUiSdkPositioning } from "./map-positioning";
import {
    type AutocompleteItem,
    AutocompleteUiProvider,
    type AutocompleteUiContextValue,
    useAutocompleteUi
} from "./autocomplete-ui-context";

export type { AutocompleteItem };

const { withProvider, withContext } = createStyleContext(autocomplete, {
    forwardVariants: ["size"]
});

type UiSdkComboboxBaseProps = Omit<
    UiSdkComboboxProps<string, false>,
    "children" | "items" | "multiple" | "value" | "defaultValue" | "onValueChange"
>;

export interface AutocompleteProps
    extends UiSdkComboboxBaseProps,
        AutocompleteVariantProps,
        Omit<
            HTMLDreamyProps<"div">,
            | keyof UiSdkComboboxBaseProps
            | "items"
            | "value"
            | "defaultValue"
            | "onValueChange"
            | "onChange"
            | "children"
        > {
    items: AutocompleteItem[];
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (
        value: string | null,
        details: ChangeDetails<ComboboxValueChangeReason>
    ) => void;
    onOpenChange?: (open: boolean, details: ChangeDetails<ComboboxOpenChangeReason>) => void;
    filterFn?: (item: AutocompleteItem, query: string) => boolean;
    clearable?: boolean;
    positioning?: PositioningProps;
    triggerVariant?: InputProps["variant"];
    children?: ReactNode;
    invalid?: boolean;
    reduceMotion?: boolean;
}

function AutocompleteRoot(props: AutocompleteProps) {
    const {
        children,
        size = "md",
        triggerVariant = "outline",
        items,
        filterFn,
        filter,
        clearable = true,
        reduceMotion: reduceMotionProp,
        open,
        defaultOpen,
        onOpenChange,
        onOpenChangeComplete,
        query,
        defaultQuery,
        onQueryChange,
        disabled,
        readOnly,
        invalid,
        required,
        value,
        defaultValue,
        onValueChange,
        positioning,
        name,
        form,
        loop,
        modal,
        presentation,
        autoHighlight = true,
        allowCustomValue,
        status,
        onLoadMore,
        announcement,
        onHighlight,
        dismissible,
        onDismissAttempt,
        controller,
        debug,
        container,
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

    const resolvedFilter = useMemo<UiSdkComboboxBaseProps["filter"]>(() => {
        if (filter !== undefined) return filter;
        if (!filterFn) return undefined;
        return (entry, q) => filterFn({ value: entry.value, label: entry.label }, q);
    }, [filter, filterFn]);

    const itemToLabel = useMemo(() => {
        const map = new Map<string, string>();
        for (const entry of items) {
            map.set(entry.value, entry.label);
        }
        return (val: string) => map.get(val) ?? val;
    }, [items]);

    const listItems = useMemo(
        () =>
            items.map((item) => ({
                value: item.value,
                label: item.label,
                disabled: item.disabled
            })),
        [items]
    );

    const uiValue = useMemo<AutocompleteUiContextValue>(
        () => ({
            items,
            size: size as AutocompleteUiContextValue["size"],
            triggerVariant: triggerVariant as string,
            clearable,
            reduceMotion,
            motion,
            positioning,
            inputFieldProps: {
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
            positioning,
            reduceMotion,
            resolvedInvalid,
            size,
            triggerVariant
        ]
    );

    return (
        <dreamy.div
            {...domProps}
            className={cx(className as string | undefined, css(cssProps))}
        >
            <AutocompleteUiProvider value={uiValue}>
                <UiSdkCombobox
                    allowCustomValue={allowCustomValue}
                    announcement={announcement}
                    autoHighlight={autoHighlight}
                    container={container}
                    controller={controller}
                    debug={debug}
                    defaultOpen={defaultOpen}
                    defaultQuery={defaultQuery}
                    defaultValue={defaultValue}
                    disabled={resolvedDisabled}
                    dismissible={dismissible}
                    filter={resolvedFilter}
                    form={form}
                    itemToLabel={itemToLabel}
                    items={listItems}
                    loop={loop}
                    modal={modal}
                    name={name}
                    onDismissAttempt={onDismissAttempt}
                    onHighlight={onHighlight}
                    onLoadMore={onLoadMore}
                    onOpenChange={handleOpenChange}
                    onOpenChangeComplete={onOpenChangeComplete}
                    onQueryChange={onQueryChange}
                    onValueChange={onValueChange}
                    open={open}
                    presentation={presentation}
                    query={query}
                    readOnly={resolvedReadOnly}
                    required={resolvedRequired}
                    status={status}
                    value={value}
                >
                    <UiSdkMotionSync
                        controller={motion}
                        open={open}
                    />
                    {children}
                </UiSdkCombobox>
            </AutocompleteUiProvider>
        </dreamy.div>
    );
}

/**
 * Autocomplete component — searchable combobox that filters options as the user types.
 *
 * @see Docs https://dreamy-ui.com/docs/components/autocomplete
 */
export const Root: (props: AutocompleteProps) => React.JSX.Element = withProvider(
    AutocompleteRoot,
    "root"
) as (props: AutocompleteProps) => React.JSX.Element;

const AutocompleteControl = withContext(dreamy.div, "control");
const AutocompleteIcon = withContext(dreamy.div, "icon");
const AutocompleteIndicatorGroup = withContext(dreamy.div, "indicatorGroup");

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
    if (typeof size !== "string") return "md";
    if (size === "xs") return "sm";
    if (size === "sm" || size === "md" || size === "lg" || size === "xl" || size === "2xl") {
        return size;
    }
    return "md";
}

const AutocompleteClearButton = withContext(function AutocompleteClearButtonBase(
    props: Omit<React.ComponentProps<typeof UiSdkComboboxClear>, "children">
) {
    return (
        <UiSdkComboboxClear {...props}>
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
        </UiSdkComboboxClear>
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
const AutocompleteNoResults = withContext(dreamy.div, "noResults");

export interface AutocompleteInputProps
    extends Omit<InputProps, "size" | "variant" | "value" | "defaultValue" | "onValueChange"> {
    icon?: ReactNode;
    placeholder?: string;
}

export const Input = withContext(function AutocompleteInput({
    icon,
    placeholder,
    className,
    style,
    ...rest
}: AutocompleteInputProps) {
    const { inputFieldProps, clearable, size, triggerVariant } = useAutocompleteUi();
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(
        inputRecipe({
            size: resolveAutocompleteInputSize(size ?? "md"),
            variant: triggerVariant as InputProps["variant"]
        }),
        className as string | undefined,
        css({ pe: "var(--ac-pe)", ...cssProps })
    );

    return (
        <AutocompleteControl data-has-icon={dataAttr(!!icon)}>
            {icon ? <AutocompleteIcon>{icon}</AutocompleteIcon> : null}
            <UiSdkComboboxInput
                {...(inputFieldProps as Record<string, unknown>)}
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkComboboxInput>)}
                autoComplete="off"
                className={mergedClassName}
                placeholder={placeholder}
                style={style as CSSProperties | undefined}
            />
            <AutocompleteIndicatorGroup>
                {clearable ? <AutocompleteClearButton aria-label="Clear selection" /> : null}
                <UiSdkComboboxTrigger
                    aria-label="Toggle options"
                    render={<dreamy.button type="button" />}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "auto",
                        cursor: "pointer"
                    }}
                >
                    <AutocompleteIndicator />
                </UiSdkComboboxTrigger>
            </AutocompleteIndicatorGroup>
        </AutocompleteControl>
    );
}, "input");

type UiSdkComboboxContentProps = React.ComponentProps<typeof UiSdkComboboxContent>;
type UiSdkComboboxContentPickedProps = Pick<
    UiSdkComboboxContentProps,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "arrowPadding"
    | "anchor"
    | "container"
    | "keepMounted"
>;

export interface AutocompleteContentProps
    extends DreamyHostProps<HTMLDreamyProps<"div">, UiSdkComboboxContentPickedProps, "children">,
        UiSdkComboboxContentPickedProps {
    noResultsText?: string;
    noResultsContent?: ReactNode;
    renderItem?: (item: AutocompleteItem) => ReactNode;
    children?: ReactNode;
}

function renderAutocompletePopoverMotion(
    motion: UiSdkMotionController,
    popoverVariants: Variants,
    reduceMotion: boolean
): UiSdkComboboxContentProps["render"] {
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

export const Content = withContext(function AutocompleteContent(props: AutocompleteContentProps) {
    const {
        noResultsText = "No results found",
        noResultsContent,
        renderItem,
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
        keepMounted,
        ...rest
    } = props;
    const { items, positioning, reduceMotion, motion } = useAutocompleteUi();
    const { popover: popoverVariants } = useMotionVariants();
    const mapped = mapUiSdkPositioning(positioning);
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    return (
        <UiSdkComboboxContent
            {...(domProps as unknown as UiSdkComboboxContentProps)}
            align={align ?? mapped.align ?? "start"}
            alignOffset={alignOffset ?? mapped.alignOffset}
            anchor={anchor}
            arrowPadding={arrowPadding ?? mapped.arrowPadding}
            className={mergedClassName}
            collisionPadding={collisionPadding ?? mapped.collisionPadding}
            container={container}
            data-reduce-motion={reduceMotion ? "" : undefined}
            keepMounted={keepMounted}
            render={renderAutocompletePopoverMotion(motion, popoverVariants, reduceMotion)}
            side={side ?? mapped.side ?? "bottom"}
            sideOffset={sideOffset ?? mapped.sideOffset ?? 6}
            style={style as CSSProperties | undefined}
        >
            <UiSdkComboboxEmpty
                render={<AutocompleteNoResults />}
            >
                {noResultsContent ?? noResultsText}
            </UiSdkComboboxEmpty>
            <UiSdkComboboxList>
                {children ??
                    items.map((item) =>
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
                    )}
            </UiSdkComboboxList>
        </UiSdkComboboxContent>
    );
}, "content");

export interface AutocompleteVirtualContentProps extends AutocompleteContentProps {
    estimatedItemHeight?: number;
    overscan?: number;
    maxHeight?: number;
}

export const VirtualContent = withContext(function AutocompleteVirtualContent(
    props: AutocompleteVirtualContentProps
) {
    const {
        estimatedItemHeight = 32,
        overscan = 5,
        maxHeight = 300,
        noResultsText = "No results found",
        noResultsContent,
        renderItem,
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
        keepMounted,
        ...rest
    } = props;
    const { positioning, reduceMotion, motion } = useAutocompleteUi();
    const { popover: popoverVariants } = useMotionVariants();
    const mapped = mapUiSdkPositioning(positioning);
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    return (
        <UiSdkComboboxContent
            {...(domProps as unknown as UiSdkComboboxContentProps)}
            align={align ?? mapped.align ?? "start"}
            alignOffset={alignOffset ?? mapped.alignOffset}
            anchor={anchor}
            arrowPadding={arrowPadding ?? mapped.arrowPadding}
            className={mergedClassName}
            collisionPadding={collisionPadding ?? mapped.collisionPadding}
            container={container}
            data-reduce-motion={reduceMotion ? "" : undefined}
            keepMounted={keepMounted}
            render={renderAutocompletePopoverMotion(motion, popoverVariants, reduceMotion)}
            side={side ?? mapped.side ?? "bottom"}
            sideOffset={sideOffset ?? mapped.sideOffset ?? 6}
            style={style as CSSProperties | undefined}
        >
            <UiSdkComboboxEmpty render={<AutocompleteNoResults />}>
                {noResultsContent ?? noResultsText}
            </UiSdkComboboxEmpty>
            <UiSdkComboboxList>
                {(state) => (
                    <AutocompleteVirtualizedList
                        estimatedItemHeight={estimatedItemHeight}
                        isOpen={state.open}
                        items={(state.items as AutocompleteItem[]) ?? []}
                        maxHeight={maxHeight}
                        overscan={overscan}
                        renderItem={renderItem}
                    />
                )}
            </UiSdkComboboxList>
        </UiSdkComboboxContent>
    );
}, "content");

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
                                    index={virtualItem.index}
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

export interface AutocompleteItemProps extends Omit<HTMLDreamyProps<"div">, "value" | "children"> {
    item?: AutocompleteItem;
    value?: string;
    label?: string;
    disabled?: boolean;
    index?: number;
    children?: ReactNode;
}

export const Item = withContext(function AutocompleteItem({
    item: itemProp,
    value,
    label,
    disabled,
    index,
    children,
    className,
    style,
    ...rest
}: AutocompleteItemProps) {
    const { items } = useAutocompleteUi();
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    const resolved =
        itemProp ??
        items.find((entry) => entry.value === value) ??
        ({
            value: value ?? "",
            label: label ?? (typeof children === "string" ? children : "")
        } as AutocompleteItem);

    return (
        <UiSdkComboboxItem
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkComboboxItem>)}
            className={mergedClassName}
            disabled={disabled ?? resolved.disabled}
            index={index}
            label={label ?? resolved.label}
            style={style as CSSProperties | undefined}
            value={resolved.value}
        >
            {children ?? <UiSdkComboboxItemText>{resolved.label}</UiSdkComboboxItemText>}
            <UiSdkComboboxItemIndicator render={<AutocompleteItemIndicator />} />
        </UiSdkComboboxItem>
    );
}, "item");
