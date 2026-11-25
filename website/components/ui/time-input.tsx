"use client";

import {
    ClockIcon,
    type DreamyHostProps,
    type PositioningProps,
    dataAttr,
    pad2,
    useControllableState,
    useFieldProps,
    useInfiniteWheel,
    useReducedMotion
} from "@dreamy-ui/react";
import type { ChangeDetails } from "@ui-sdk/core";
import {
    TimeInput as UiSdkTimeInput,
    type TimeInputGranularity,
    type TimeInputOptions,
    TimeInputSegment as UiSdkTimeInputSegment,
    type TimeInputValueChangeReason
} from "@ui-sdk/react/time-input";
import type React from "react";
import {
    type CSSProperties,
    type ReactNode,
    createContext,
    memo,
    useCallback,
    useContext,
    useMemo,
    useState
} from "react";
import { css, cx } from "styled-system/css";
import {
    type HTMLDreamyProps,
    createStyleContext,
    dreamy,
    splitCssProps
} from "styled-system/jsx";
import { type TimeInputVariantProps, timeInput } from "styled-system/recipes";
import * as Popover from "./popover";

const { withProvider, withContext } = createStyleContext(timeInput, {
    forwardVariants: ["size", "variant"]
});

const ITEM_HEIGHT = 36;
const VISIBLE_ROWS = 5;
const SPACER_ROWS = 2;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const SPACER_HEIGHT = ITEM_HEIGHT * SPACER_ROWS;
const HIGHLIGHT_TOP = SPACER_HEIGHT;
const ITEM_STYLE: CSSProperties = {
    height: ITEM_HEIGHT,
    minHeight: ITEM_HEIGHT,
    maxHeight: ITEM_HEIGHT
};
const SPACER_STYLE: CSSProperties = { height: SPACER_HEIGHT };
const WHEEL_STYLE: CSSProperties = {
    height: WHEEL_HEIGHT,
    maxHeight: WHEEL_HEIGHT,
    overflowY: "auto",
    touchAction: "none"
};
const WHEEL_WRAP_STYLE: CSSProperties = {
    height: WHEEL_HEIGHT,
    width: "100%"
};
const COLUMNS_PADDING_Y = 8;
const LABEL_BLOCK_HEIGHT = 18;

function getColumnsHighlightStyle(showLabels: boolean): CSSProperties {
    return {
        top: COLUMNS_PADDING_Y + (showLabels ? LABEL_BLOCK_HEIGHT : 0) + HIGHLIGHT_TOP,
        height: ITEM_HEIGHT,
        transform: "none"
    };
}

function parseIsoTime(value: string | null | undefined): {
    hours: number;
    minutes: number;
    seconds: number;
} {
    if (!value) return { hours: 0, minutes: 0, seconds: 0 };
    const [h, m, s] = value.split(":").map((part) => Number(part));
    return {
        hours: Number.isFinite(h) ? h : 0,
        minutes: Number.isFinite(m) ? m : 0,
        seconds: Number.isFinite(s) ? s : 0
    };
}

function formatIsoTime(
    hours: number,
    minutes: number,
    seconds: number,
    granularity: TimeInputGranularity
): string {
    if (granularity === "hour") return `${pad2(hours)}:00`;
    if (granularity === "second") return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
    return `${pad2(hours)}:${pad2(minutes)}`;
}

interface TimeInputUiContextValue {
    value: string | null;
    setValue: (next: string | null, details?: ChangeDetails<TimeInputValueChangeReason>) => void;
    granularity: TimeInputGranularity;
    hourCycle?: 12 | 24;
    minuteStep: number;
    secondStep: number;
    min?: string;
    max?: string;
    locale?: string;
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
    invalid: boolean;
    name?: string;
    form?: string;
    controller?: TimeInputOptions["controller"];
    debug?: boolean;
    open: boolean;
    setOpen: (next: boolean) => void;
    fieldId?: string;
    ariaDescribedBy?: string;
}

const TimeInputUiContext = createContext<TimeInputUiContextValue | null>(null);

function useTimeInputUi() {
    const ctx = useContext(TimeInputUiContext);
    if (!ctx) {
        throw new Error("TimeInput sub-components must be used within TimeInput.Root");
    }
    return ctx;
}

type PopoverOpenChangeHandler = NonNullable<Popover.PopoverProps["onOpenChange"]>;

export interface TimeInputProps
    extends TimeInputOptions,
        TimeInputVariantProps,
        DreamyHostProps<HTMLDreamyProps<"div">, TimeInputOptions, "onChange" | "size"> {
    granularity?: TimeInputGranularity;
    hourCycle?: 12 | 24;
    minuteStep?: number;
    secondStep?: number;
    invalid?: boolean;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: PopoverOpenChangeHandler;
    positioning?: PositioningProps;
    reduceMotion?: boolean;
    children?: ReactNode;
}

/**
 * Time Input component — segmented time input powered by UI SDK with optional scroll-wheel popover.
 *
 * @see Docs https://dreamy-ui.com/docs/components/time-input
 */
export const Root = withProvider(function TimeInputRoot(props: TimeInputProps) {
    const {
        value: valueProp,
        defaultValue,
        onValueChange,
        granularity = "minute",
        hourCycle,
        minuteStep = 1,
        secondStep = 1,
        min,
        max,
        locale,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        form,
        controller,
        debug,
        open: openProp,
        defaultOpen,
        onOpenChange,
        positioning,
        reduceMotion: reduceMotionProp,
        children,
        id,
        className,
        ...rest
    } = props;

    const [cssProps, domProps] = splitCssProps(rest);
    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? globalReduceMotion ?? false;

    const {
        isDisabled: isDisabledField = false,
        isRequired: isRequiredField = false,
        isInvalid: isInvalidField = false,
        isReadOnly: isReadOnlyField = false,
        id: fieldId,
        "aria-describedby": ariaDescribedBy
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

    const [value, setInternalValue] = useControllableState<string | null>({
        value: valueProp,
        defaultValue: defaultValue ?? null
    });

    const handleValueChange = useCallback(
        (next: string | null, details?: ChangeDetails<TimeInputValueChangeReason>) => {
            setInternalValue(next);
            onValueChange?.(
                next,
                details ??
                    ({
                        reason: "imperative",
                        source: "programmatic",
                        cancel: () => {},
                        canceled: false
                    } as ChangeDetails<TimeInputValueChangeReason>)
            );
        },
        [onValueChange, setInternalValue]
    );

    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
    const open = openProp ?? uncontrolledOpen;

    const setOpen = useCallback(
        (next: boolean) => {
            if (resolvedDisabled || resolvedReadOnly) return;
            if (openProp === undefined) {
                setUncontrolledOpen(next);
            }
            onOpenChange?.(next, {
                reason: "imperative",
                source: "programmatic",
                cancel: () => {},
                canceled: false
            } as Parameters<PopoverOpenChangeHandler>[1]);
        },
        [onOpenChange, openProp, resolvedDisabled, resolvedReadOnly]
    );

    const handlePopoverOpenChange = useCallback<PopoverOpenChangeHandler>(
        (next, details) => {
            if (next && (resolvedDisabled || resolvedReadOnly)) {
                details.cancel();
                return;
            }
            if (openProp === undefined) {
                setUncontrolledOpen(next);
            }
            onOpenChange?.(next, details);
        },
        [onOpenChange, openProp, resolvedDisabled, resolvedReadOnly]
    );

    const uiValue = useMemo<TimeInputUiContextValue>(
        () => ({
            value,
            setValue: handleValueChange,
            granularity,
            hourCycle,
            minuteStep,
            secondStep,
            min,
            max,
            locale,
            disabled: resolvedDisabled,
            readOnly: resolvedReadOnly,
            required: resolvedRequired,
            invalid: resolvedInvalid,
            name,
            form,
            controller,
            debug,
            open,
            setOpen,
            fieldId,
            ariaDescribedBy
        }),
        [
            ariaDescribedBy,
            controller,
            debug,
            fieldId,
            form,
            granularity,
            handleValueChange,
            hourCycle,
            locale,
            max,
            min,
            minuteStep,
            name,
            open,
            resolvedDisabled,
            resolvedInvalid,
            resolvedReadOnly,
            resolvedRequired,
            secondStep,
            setOpen,
            value
        ]
    );

    const popoverPositioning = useMemo<PositioningProps>(
        () => ({ placement: "bottom-start", ...positioning }),
        [positioning]
    );

    return (
        <dreamy.div
            {...domProps}
            className={cx(className as string | undefined, css(cssProps))}
        >
            <TimeInputUiContext.Provider value={uiValue}>
                <Popover.Root
                    autoFocus={false}
                    onOpenChange={handlePopoverOpenChange}
                    open={open}
                    positioning={popoverPositioning}
                    reduceMotion={reduceMotion}
                >
                    {children}
                </Popover.Root>
            </TimeInputUiContext.Provider>
        </dreamy.div>
    );
}, "root");

const SegmentSlot = withContext(function TimeInputSegmentSlot(
    props: React.ComponentProps<typeof UiSdkTimeInputSegment>
) {
    return <UiSdkTimeInputSegment {...props} />;
}, "segment");

const SeparatorSlot = withContext(function TimeInputSeparatorSlot(
    props: React.ComponentProps<typeof UiSdkTimeInputSegment>
) {
    return <UiSdkTimeInputSegment {...props} />;
}, "separator");

const IndicatorSlot = withContext(dreamy.span, "indicator");

export interface TimeInputTriggerProps extends Omit<HTMLDreamyProps<"div">, "children"> {
    icon?: ReactNode | null;
}

export const Trigger = withContext(function TimeInputTrigger(props: TimeInputTriggerProps) {
    const { icon, className, style, onClick, ...rest } = props;
    const ui = useTimeInputUi();
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    return (
        <Popover.Anchor>
            <UiSdkTimeInput
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkTimeInput>)}
                aria-describedby={ui.ariaDescribedBy}
                aria-expanded={ui.open}
                aria-haspopup="dialog"
                aria-invalid={ui.invalid || undefined}
                className={mergedClassName}
                controller={ui.controller}
                data-invalid={dataAttr(ui.invalid)}
                data-open={dataAttr(ui.open)}
                debug={ui.debug}
                disabled={ui.disabled}
                form={ui.form}
                granularity={ui.granularity}
                hourCycle={ui.hourCycle}
                id={ui.fieldId}
                locale={ui.locale}
                max={ui.max}
                min={ui.min}
                name={ui.name}
                onClick={(event) => {
                    (onClick as React.MouseEventHandler<HTMLDivElement> | undefined)?.(event);
                    if (!ui.disabled && !ui.readOnly) {
                        ui.setOpen(true);
                    }
                }}
                onValueChange={(next, details) => ui.setValue(next, details)}
                readOnly={ui.readOnly}
                required={ui.required}
                style={style as CSSProperties | undefined}
                value={ui.value}
            >
                {(state) => (
                    <>
                        {state.segments.map((segment, index) =>
                            segment.type === "literal" ? (
                                <SeparatorSlot
                                    key={`lit-${index}`}
                                    segment={segment}
                                />
                            ) : (
                                <SegmentSlot
                                    key={`${segment.type}-${index}`}
                                    segment={segment}
                                />
                            )
                        )}
                        {icon !== null ? (
                            <IndicatorSlot aria-hidden="true">
                                {icon ?? <ClockIcon />}
                            </IndicatorSlot>
                        ) : null}
                    </>
                )}
            </UiSdkTimeInput>
        </Popover.Anchor>
    );
}, "trigger");

export interface TimeInputContentProps extends Popover.PopoverContentProps {}

export const Content: (props: TimeInputContentProps) => React.JSX.Element = withContext(
    function TimeInputContent(props: TimeInputContentProps) {
    const { children, ...rest } = props;

    return (
        <Popover.Content
            aria-label="Choose time"
            role="dialog"
            {...rest}
        >
            {children}
        </Popover.Content>
    );
}, "content", { forwardProps: ["container"] } as never) as (
    props: TimeInputContentProps
) => React.JSX.Element;

const ColumnsSlot = withContext(dreamy.div, "columns");
const ColumnSlot = withContext(dreamy.div, "column");
const ColumnLabelSlot = withContext(dreamy.span, "columnLabel");
const WheelWrapSlot = withContext(dreamy.div, "wheelWrap");
const WheelSlot = withContext(dreamy.div, "wheel");
const WheelItemSlot = withContext(dreamy.button, "wheelItem");
const WheelSpacerSlot = withContext(dreamy.div, "wheelSpacer");
const WheelHighlightSlot = withContext(dreamy.div, "wheelHighlight");

interface WheelColumnProps {
    label?: string;
    options: { value: number; display: string }[];
    selectedValue: number;
    onSelect: (value: number) => void;
    infinite?: boolean;
}

const WheelColumn = memo(function WheelColumn({
    label,
    options,
    selectedValue,
    onSelect,
    infinite = false
}: WheelColumnProps) {
    const { open } = useTimeInputUi();

    const optionValues = useMemo(() => options.map((o) => o.value), [options]);
    const optionDisplayMap = useMemo(
        () => new Map(options.map((o) => [o.value, o.display])),
        [options]
    );

    const wheel = useInfiniteWheel({
        options: optionValues,
        value: selectedValue,
        onChange: (next) => onSelect(Number(next)),
        itemHeight: ITEM_HEIGHT,
        infinite,
        isActive: open
    });

    return (
        <ColumnSlot>
            {label ? <ColumnLabelSlot>{label}</ColumnLabelSlot> : null}
            <WheelWrapSlot style={WHEEL_WRAP_STYLE}>
                <WheelSlot
                    {...wheel.getContainerProps()}
                    style={WHEEL_STYLE}
                >
                    <WheelSpacerSlot style={SPACER_STYLE} />
                    {Array.from({ length: wheel.paddedCount }, (_, index) => {
                        const optionValue = Number(wheel.getOptionAtIndex(index));
                        const display = optionDisplayMap.get(optionValue) ?? String(optionValue);
                        return (
                            <WheelItemSlot
                                data-selected={dataAttr(optionValue === selectedValue)}
                                key={index}
                                onClick={() => onSelect(optionValue)}
                                style={ITEM_STYLE}
                                tabIndex={-1}
                                type="button"
                            >
                                {display}
                            </WheelItemSlot>
                        );
                    })}
                    <WheelSpacerSlot style={SPACER_STYLE} />
                </WheelSlot>
            </WheelWrapSlot>
        </ColumnSlot>
    );
});

export interface TimeInputColumnsProps extends HTMLDreamyProps<"div"> {
    showLabels?: boolean;
}

export function Columns({ showLabels = true, ...rest }: TimeInputColumnsProps) {
    const ui = useTimeInputUi();
    const parsed = useMemo(() => parseIsoTime(ui.value), [ui.value]);
    const is12Hour = ui.hourCycle === 12;

    const hourOptions = useMemo(
        () =>
            is12Hour
                ? Array.from({ length: 12 }, (_, i) => ({
                      value: i === 0 ? 12 : i,
                      display: pad2(i === 0 ? 12 : i)
                  }))
                : Array.from({ length: 24 }, (_, i) => ({ value: i, display: pad2(i) })),
        [is12Hour]
    );

    const minuteOptions = useMemo(() => {
        const list: { value: number; display: string }[] = [];
        for (let m = 0; m < 60; m += ui.minuteStep) {
            list.push({ value: m, display: pad2(m) });
        }
        return list;
    }, [ui.minuteStep]);

    const secondOptions = useMemo(() => {
        const list: { value: number; display: string }[] = [];
        for (let s = 0; s < 60; s += ui.secondStep) {
            list.push({ value: s, display: pad2(s) });
        }
        return list;
    }, [ui.secondStep]);

    const displayHour = is12Hour ? parsed.hours % 12 || 12 : parsed.hours;
    const isPm = parsed.hours >= 12;

    const updateTime = useCallback(
        (hours: number, minutes: number, seconds: number) => {
            ui.setValue(formatIsoTime(hours, minutes, seconds, ui.granularity));
        },
        [ui]
    );

    return (
        <ColumnsSlot {...rest}>
            <WheelHighlightSlot style={getColumnsHighlightStyle(showLabels)} />
            <WheelColumn
                infinite
                label={showLabels ? "Hour" : undefined}
                onSelect={(h) => {
                    const next24 = is12Hour ? (h % 12) + (isPm ? 12 : 0) : h;
                    updateTime(next24, parsed.minutes, parsed.seconds);
                }}
                options={hourOptions}
                selectedValue={displayHour}
            />
            {ui.granularity !== "hour" ? (
                <WheelColumn
                    infinite
                    label={showLabels ? "Min" : undefined}
                    onSelect={(m) => updateTime(parsed.hours, m, parsed.seconds)}
                    options={minuteOptions}
                    selectedValue={parsed.minutes}
                />
            ) : null}
            {ui.granularity === "second" ? (
                <WheelColumn
                    infinite
                    label={showLabels ? "Sec" : undefined}
                    onSelect={(s) => updateTime(parsed.hours, parsed.minutes, s)}
                    options={secondOptions}
                    selectedValue={parsed.seconds}
                />
            ) : null}
            {is12Hour ? (
                <WheelColumn
                    label={showLabels ? "AM/PM" : undefined}
                    onSelect={(period) => {
                        const base12 = parsed.hours % 12;
                        const next24 = period === 1 ? base12 + 12 : base12;
                        updateTime(next24, parsed.minutes, parsed.seconds);
                    }}
                    options={[
                        { value: 0, display: "AM" },
                        { value: 1, display: "PM" }
                    ]}
                    selectedValue={isPm ? 1 : 0}
                />
            ) : null}
        </ColumnsSlot>
    );
}

export interface TimeInputAIOProps extends TimeInputProps {
    triggerProps?: TimeInputTriggerProps;
    contentProps?: TimeInputContentProps;
    columnsProps?: TimeInputColumnsProps;
}

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
