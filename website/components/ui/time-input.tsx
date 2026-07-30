"use client";

import {
    ClockIcon,
    type PositioningProps,
    type TimeField,
    TimeInputProvider,
    type TimePeriod,
    type TimeSegment,
    type UseTimeInputProps,
    dataAttr,
    formatSegmentValue,
    getDisplayHour,
    getFieldSeparator,
    getPeriod,
    pad2,
    pad3,
    snapMillisecond,
    snapMinute,
    snapSecond,
    to24Hour,
    useInfiniteWheel,
    useSafeLayoutEffect,
    useTimeInput,
    useTimeInputContext
} from "@dreamy-ui/react";
import type React from "react";
import { type ReactNode, Fragment, memo, useCallback, useMemo, useRef } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy, splitCssProps } from "styled-system/jsx";
import { type TimeInputVariantProps, timeInput } from "styled-system/recipes";
import {
    Content as PopoverContent,
    type PopoverContentProps,
    type PopoverProps,
    Root as PopoverRoot,
    Trigger as PopoverTrigger
} from "./popover";
import { VisuallyHidden } from "./visually-hidden";

const { withProvider, withContext } = createStyleContext(timeInput, {
    forwardVariants: ["size", "variant"]
});

/** Fixed geometry keeps scroll math and layout in sync (portal-safe). */
const ITEM_HEIGHT = 36;
const VISIBLE_ROWS = 5;
const SPACER_ROWS = 2;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const SPACER_HEIGHT = ITEM_HEIGHT * SPACER_ROWS;
const HIGHLIGHT_TOP = SPACER_HEIGHT;
const ITEM_STYLE: React.CSSProperties = {
    height: ITEM_HEIGHT,
    minHeight: ITEM_HEIGHT,
    maxHeight: ITEM_HEIGHT
};
const SPACER_STYLE: React.CSSProperties = { height: SPACER_HEIGHT };
const WHEEL_STYLE: React.CSSProperties = {
    height: WHEEL_HEIGHT,
    maxHeight: WHEEL_HEIGHT,
    overflowY: "auto",
    touchAction: "none"
};
const WHEEL_WRAP_STYLE: React.CSSProperties = {
    height: WHEEL_HEIGHT,
    width: "100%"
};
/** Matches recipe `columns.py` (2) + optional label block (`columnLabel.h` 3 + `column.gap` 1.5). */
const COLUMNS_PADDING_Y = 8;
const LABEL_BLOCK_HEIGHT = 18;

const COLUMN_LABELS: Record<Exclude<TimeSegment, "period">, string> = {
    hour: "Hour",
    minute: "Min",
    second: "Sec",
    millisecond: "Ms"
};

function getColumnsHighlightStyle(showLabels: boolean): React.CSSProperties {
    return {
        top: COLUMNS_PADDING_Y + (showLabels ? LABEL_BLOCK_HEIGHT : 0) + HIGHLIGHT_TOP,
        height: ITEM_HEIGHT,
        transform: "none"
    };
}

function getSegmentSeparator(previous: TimeSegment, current: TimeSegment): string | null {
    if (current === "period") {
        return null;
    }
    if (previous === "period") {
        return null;
    }
    return getFieldSeparator(previous as TimeField, current as TimeField);
}

export type TimeInputLayer = "dropdown" | "popover" | "tooltip";

export interface TimeInputProps
    extends Omit<UseTimeInputProps, "popoverProps">,
        TimeInputVariantProps,
        Omit<HTMLDreamyProps<"div">, keyof UseTimeInputProps | "transition"> {
    /**
     * Semantic z-index layer for the popover content.
     * @default "popover"
     */
    layer?: TimeInputLayer;
    /**
     * Explicit z-index for the popover content.
     * Prefer `layer` unless you need a custom CSS value.
     */
    contentZIndex?: string;
    /**
     * Positioning configuration for the time popover.
     * @default { placement: "bottom" }
     */
    positioning?: PositioningProps;
    /**
     * Props forwarded to the internal `Popover.Root`.
     * Set `usePortal` to `false` to render the panel in place.
     */
    popoverProps?: Omit<PopoverProps, "positioning">;
    children?: ReactNode;
}

/**
 * Time Input component — pick a time with segmented fields and a scroll wheel popover.
 *
 * @see Docs https://dreamy-ui.com/docs/components/time-input
 *
 * @example
 * ```tsx
 * <TimeInput.Root hour12 fields={["hour", "minute", "second"]}>
 *   <TimeInput.Trigger />
 *   <TimeInput.Content>
 *     <TimeInput.Columns />
 *   </TimeInput.Content>
 * </TimeInput.Root>
 * ```
 */
export const Root = withProvider(function TimeInputRoot({
    children,
    layer,
    contentZIndex,
    positioning,
    popoverProps,
    ...props
}: TimeInputProps) {
    const [cssProps, restProps] = splitCssProps(props);
    const resolvedContentZIndex =
        contentZIndex ?? (layer ? `var(--z-index-${layer})` : "var(--z-index-popover)");

    const ctx = useTimeInput({
        ...restProps,
        contentZIndex: resolvedContentZIndex
    });

    return (
        <TimeInputProvider value={ctx}>
            <dreamy.div
                {...ctx.getRootProps({
                    ...cssProps,
                    className: restProps.className
                })}
            >
                <VisuallyHidden>
                    <input {...ctx.getHiddenInputProps()} />
                </VisuallyHidden>
                <PopoverRoot
                    autoFocus={false}
                    hasArrow={false}
                    isOpen={ctx.isOpen}
                    lazyBehavior="keepMounted"
                    onClose={ctx.onClose}
                    onOpen={ctx.onOpen}
                    positioning={{ placement: "bottom", ...positioning }}
                    {...popoverProps}
                    portalProps={{
                        zIndex: resolvedContentZIndex,
                        ...popoverProps?.portalProps
                    }}
                >
                    {children}
                </PopoverRoot>
            </dreamy.div>
        </TimeInputProvider>
    );
}, "root");

export interface TimeInputTriggerProps extends HTMLDreamyProps<"div"> {
    /**
     * Custom icon rendered at the end of the trigger.
     * Pass `null` to hide the clock icon.
     */
    icon?: ReactNode | null;
}

/**
 * Time Input Trigger — segmented time fields that open the popover.
 */
export const Trigger = withContext(function TimeInputTrigger({
    children,
    icon,
    ...rest
}: TimeInputTriggerProps) {
    const { getTriggerProps, getSegmentProps, time, hour12, segments, isOpen } =
        useTimeInputContext();

    return (
        <PopoverTrigger>
            <dreamy.div
                {...(getTriggerProps({
                    ...rest,
                    "data-open": dataAttr(isOpen)
                }) as HTMLDreamyProps<"div">)}
            >
                {children ?? (
                    <>
                        {segments.map(function renderSegment(segment, index) {
                            const previous = index > 0 ? segments[index - 1] : null;
                            const separator =
                                previous !== null ? getSegmentSeparator(previous, segment) : null;

                            return (
                                <Fragment key={segment}>
                                    {separator ? (
                                        <TimeSeparator>{separator}</TimeSeparator>
                                    ) : null}
                                    <TimeSegmentPart {...getSegmentProps(segment)}>
                                        {formatSegmentValue(segment, time, hour12)}
                                    </TimeSegmentPart>
                                </Fragment>
                            );
                        })}
                        {icon === null ? null : (
                            <TimeIndicator>{icon ?? <ClockIcon />}</TimeIndicator>
                        )}
                    </>
                )}
            </dreamy.div>
        </PopoverTrigger>
    );
}, "trigger");

const TimeSegmentPart = withContext(dreamy.span, "segment");
const TimeSeparator = withContext(dreamy.span, "separator");
const TimeIndicator = withContext(dreamy.span, "indicator");
const WheelWrap = withContext(dreamy.div, "wheelWrap");
const Wheel = withContext(dreamy.div, "wheel");
const WheelItem = withContext(dreamy.div, "wheelItem");
const WheelSpacer = withContext(dreamy.div, "wheelSpacer");
const WheelHighlight = withContext(dreamy.div, "wheelHighlight");
const ColumnLabel = withContext(dreamy.span, "columnLabel");

interface WheelListItem {
    value: number | string;
    label: string;
    key: string;
}

/**
 * Static wheel item list. Selection styling is applied via DOM so scroll/drag
 * never re-renders hundreds of nodes.
 */
const StaticWheelList = memo(function StaticWheelList({ items }: { items: WheelListItem[] }) {
    return items.map(function renderItem(item) {
        return (
            <WheelItem
                data-part="wheel-item"
                data-value={String(item.value)}
                key={item.key}
                style={ITEM_STYLE}
            >
                {item.label}
            </WheelItem>
        );
    });
});

export interface TimeInputSegmentProps extends HTMLDreamyProps<"span"> {
    segment: TimeSegment;
}

/**
 * Time Input Segment — a single editable time field or AM/PM part.
 */
export const Segment = withContext(function TimeInputSegment({
    segment,
    children,
    ...rest
}: TimeInputSegmentProps) {
    const { getSegmentProps, time, hour12 } = useTimeInputContext();

    return (
        <TimeSegmentPart
            {...getSegmentProps(segment)}
            {...rest}
        >
            {children ?? formatSegmentValue(segment, time, hour12)}
        </TimeSegmentPart>
    );
}, "segment");

export interface TimeInputContentProps extends Omit<PopoverContentProps, "transition"> {}

/**
 * Time Input Content — popover panel hosting the scroll wheels.
 */
export const Content = withContext(function TimeInputContent(props: TimeInputContentProps) {
    const { id } = useTimeInputContext();
    const { style, ...rest } = props;

    return (
        <PopoverContent
            aria-label="Choose time"
            aria-modal={false}
            id={`${id}-content`}
            role="dialog"
            {...rest}
            style={{
                width: "fit-content",
                minWidth: 0,
                height: "fit-content",
                minHeight: 0,
                ...(style as React.CSSProperties | undefined)
            }}
        />
    );
}, "content");

export interface TimeInputColumnsProps extends HTMLDreamyProps<"div"> {
    /**
     * Whether to show column labels (Hour / Min / Sec / Ms / AM/PM).
     * @default true
     */
    showLabels?: boolean;
}

/**
 * Time Input Columns — scroll wheels for each active field (and optional period).
 */
export const Columns = withContext(function TimeInputColumns({
    showLabels = true,
    ...rest
}: TimeInputColumnsProps) {
    const { fields, hour12 } = useTimeInputContext();

    return (
        <dreamy.div {...rest}>
            <WheelHighlight style={getColumnsHighlightStyle(showLabels)} />
            {fields.map(function renderColumn(field) {
                return (
                    <Column
                        key={field}
                        label={showLabels ? COLUMN_LABELS[field] : undefined}
                        type={field}
                    />
                );
            })}
            {hour12 && fields.includes("hour") ? (
                <Column
                    label={showLabels ? "\u00A0" : undefined}
                    type="period"
                />
            ) : null}
        </dreamy.div>
    );
}, "columns");

export interface TimeInputColumnProps extends Omit<HTMLDreamyProps<"div">, "onChange"> {
    type: TimeSegment;
    label?: string;
}

/**
 * Time Input Column — a single infinite (or finite) scroll wheel.
 */
export const Column = withContext(function TimeColumn({
    type,
    label,
    ...rest
}: TimeInputColumnProps) {
    const {
        time,
        hour12,
        hourOptions,
        minuteOptions,
        secondOptions,
        millisecondOptions,
        minuteStep,
        secondStep,
        millisecondStep,
        isOpen,
        setHours,
        setMinutes,
        setSeconds,
        setMilliseconds,
        setPeriod,
        focusSegment
    } = useTimeInputContext();

    const isPeriod = type === "period";
    const listRef = useRef<HTMLDivElement | null>(null);

    const options = useMemo(
        function resolveOptions() {
            if (type === "hour") {
                return hourOptions;
            }
            if (type === "minute") {
                return minuteOptions;
            }
            if (type === "second") {
                return secondOptions;
            }
            if (type === "millisecond") {
                return millisecondOptions;
            }
            return ["am", "pm"];
        },
        [hourOptions, millisecondOptions, minuteOptions, secondOptions, type]
    );

    const selectedValue = useMemo(
        function resolveSelected() {
            if (!time) {
                const now = new Date();
                if (type === "period") {
                    return getPeriod(now.getHours());
                }
                if (type === "hour") {
                    return getDisplayHour(now.getHours(), hour12);
                }
                if (type === "minute") {
                    return snapMinute(now.getMinutes(), minuteStep);
                }
                if (type === "second") {
                    return snapSecond(now.getSeconds(), secondStep);
                }
                return snapMillisecond(now.getMilliseconds(), millisecondStep);
            }

            if (type === "hour") {
                return getDisplayHour(time.hours, hour12);
            }
            if (type === "minute") {
                return snapMinute(time.minutes, minuteStep);
            }
            if (type === "second") {
                return snapSecond(time.seconds, secondStep);
            }
            if (type === "millisecond") {
                return snapMillisecond(time.milliseconds, millisecondStep);
            }
            return getPeriod(time.hours);
        },
        [hour12, millisecondStep, minuteStep, secondStep, time, type]
    );

    const handleChange = useCallback(
        function handleChange(next: number | string) {
            focusSegment(type);

            if (type === "hour") {
                const displayHour = Number(next);
                if (hour12) {
                    const period = time ? getPeriod(time.hours) : getPeriod(new Date().getHours());
                    setHours(to24Hour(displayHour, period, true));
                    return;
                }
                setHours(displayHour);
                return;
            }

            if (type === "minute") {
                setMinutes(Number(next));
                return;
            }

            if (type === "second") {
                setSeconds(Number(next));
                return;
            }

            if (type === "millisecond") {
                setMilliseconds(Number(next));
                return;
            }

            setPeriod(next as TimePeriod);
        },
        [
            focusSegment,
            hour12,
            setHours,
            setMilliseconds,
            setMinutes,
            setPeriod,
            setSeconds,
            time,
            type
        ]
    );

    const wheel = useInfiniteWheel({
        options,
        value: selectedValue,
        onChange: handleChange,
        itemHeight: ITEM_HEIGHT,
        copies: 5,
        infinite: !isPeriod,
        isActive: isOpen
    });

    const { ref: wheelRef, onPointerDown, onWheel } = wheel.getContainerProps();

    const setWheelNode = useCallback(
        function setWheelNode(node: HTMLDivElement | null) {
            listRef.current = node;
            wheelRef(node);
        },
        [wheelRef]
    );

    const items = useMemo(
        function buildItems() {
            const next: WheelListItem[] = [];
            for (let index = 0; index < wheel.paddedCount; index++) {
                const option = wheel.getOptionAtIndex(index);
                let label: string;
                if (type === "period") {
                    label = String(option).toUpperCase();
                } else if (type === "millisecond") {
                    label = pad3(Number(option));
                } else {
                    label = pad2(Number(option));
                }

                next.push({
                    value: option,
                    label,
                    key: `${type}-${index}`
                });
            }
            return next;
        },
        [type, wheel.getOptionAtIndex, wheel.paddedCount]
    );

    // Paint selected styles without re-rendering the item list.
    useSafeLayoutEffect(
        function syncSelectedAttribute() {
            const root = listRef.current;
            if (!root) {
                return;
            }

            const selected = String(selectedValue);
            const nodes = root.querySelectorAll<HTMLElement>("[data-value]");
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (node.getAttribute("data-value") === selected) {
                    node.setAttribute("data-selected", "");
                } else {
                    node.removeAttribute("data-selected");
                }
            }
        },
        [items, selectedValue]
    );

    return (
        <dreamy.div {...rest}>
            {label !== undefined ? <ColumnLabel>{label}</ColumnLabel> : null}
            <WheelWrap style={WHEEL_WRAP_STYLE}>
                <Wheel
                    onPointerDown={onPointerDown}
                    onWheel={onWheel}
                    ref={setWheelNode}
                    style={WHEEL_STYLE}
                >
                    <WheelSpacer
                        aria-hidden="true"
                        style={SPACER_STYLE}
                    />
                    <StaticWheelList items={items} />
                    <WheelSpacer
                        aria-hidden="true"
                        style={SPACER_STYLE}
                    />
                </Wheel>
            </WheelWrap>
        </dreamy.div>
    );
}, "column");

export interface TimeInputAIOProps extends TimeInputProps {
    triggerProps?: TimeInputTriggerProps;
    contentProps?: TimeInputContentProps;
    columnsProps?: TimeInputColumnsProps;
}

/**
 * Time Input AIO — all-in-one composed time input.
 */
export function AIO(props: TimeInputAIOProps) {
    const { triggerProps, contentProps, columnsProps, ...rootProps } = props;

    return (
        <Root {...rootProps}>
            <Trigger {...triggerProps} />
            <Content {...contentProps}>
                <Columns {...columnsProps} />
            </Content>
        </Root>
    );
}
