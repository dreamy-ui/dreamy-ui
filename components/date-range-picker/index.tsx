"use client";

import {
    CalendarIcon,
    type PositioningProps,
    createContext,
    useControllableState,
    useFieldContext
} from "@dreamy-ui/react";
import { Calendar as UiSdkCalendar } from "@ui-sdk/react/calendar";
import dayjs from "dayjs";
import { useCallback, useId, useMemo, useState } from "react";
import { createStyleContext } from "styled-system/jsx";
import { type DateRangePickerVariantProps, dateRangePicker } from "styled-system/recipes";
import { Box, type BoxProps } from "../box";
import { Button, type ButtonProps } from "../button";
import {
    type DreamyDateRange,
    isoRangeToRange,
    jsDateToIsoDate,
    rangeToIsoRange
} from "../date-picker/date-adapters";
import {
    DatePickerUiProvider,
    type WeekStartsOn,
    useDatePickerUi
} from "../date-picker/date-picker-ui-context";
import { UiSdkPickerCalendar, UiSdkPickerHeader } from "../date-picker/ui-sdk-calendar";
import { Flex, type FlexProps } from "../flex";
import { Input as InputComponent, type InputGroupProps, type InputProps } from "../input";
import * as Popover from "../popover";

const { withProvider, withContext } = createStyleContext(dateRangePicker);

interface DateRangePickerUiExtras {
    rangeValue: DreamyDateRange | null;
    setRangeValue: (range: DreamyDateRange | null) => void;
    showFooter: boolean;
    presets?: Record<string, { label: string; value: DreamyDateRange }>;
    closePopover: () => void;
}

const [DateRangePickerUiProvider, useDateRangePickerUi] = createContext<DateRangePickerUiExtras>({
    strict: true,
    name: "DateRangePickerUiContext"
});

type PopoverOpenChangeHandler = NonNullable<Popover.PopoverProps["onOpenChange"]>;

export interface DateRangePickerRootProps
    extends Omit<BoxProps, "defaultValue" | "onChange" | "value">,
        DateRangePickerVariantProps {
    value?: DreamyDateRange | null;
    defaultValue?: DreamyDateRange | null;
    onValueChange?: (range: DreamyDateRange | null) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: PopoverOpenChangeHandler;
    disabled?: boolean;
    readOnly?: boolean;
    onApply?: () => void;
    onCancel?: () => void;
    dateFormat?: string;
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
    weekStartsOn?: WeekStartsOn;
    showFooter?: boolean;
    presets?: Record<string, { label: string; value: DreamyDateRange }>;
    positioning?: PositioningProps;
    reduceMotion?: boolean;
}

function DateRangePickerRoot(props: DateRangePickerRootProps) {
    const {
        value: valueProp,
        defaultValue,
        onValueChange,
        open: openProp,
        defaultOpen,
        onOpenChange,
        disabled,
        readOnly,
        onApply,
        onCancel,
        dateFormat = "MMM D, YYYY",
        placeholder = "Select date range",
        minDate,
        maxDate,
        weekStartsOn = 1,
        showFooter = false,
        presets,
        positioning,
        reduceMotion,
        children,
        size,
        ...rest
    } = props;

    const id = useId();

    const focusCalendar = useCallback(() => {
        const grid = document.getElementById(`${id}-calendar-grid`);
        const activeCell = grid?.querySelector<HTMLElement>(
            '[role="gridcell"][tabindex="0"]'
        );
        activeCell?.focus({ preventScroll: true });
    }, [id]);

    const [value, setValue] = useControllableState<DreamyDateRange | null>({
        value: valueProp,
        defaultValue: defaultValue ?? null,
        onChange: onValueChange
    });

    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
    const open = openProp ?? uncontrolledOpen;

    const closePopover = useCallback(() => {
        if (openProp === undefined) {
            setUncontrolledOpen(false);
        }
        onOpenChange?.(false, {
            reason: "imperative",
            source: "programmatic",
            cancel: () => {},
            canceled: false
        } as Parameters<PopoverOpenChangeHandler>[1]);
    }, [onOpenChange, openProp]);

    const handleOpenChange = useCallback<PopoverOpenChangeHandler>(
        (nextOpen, details) => {
            if (openProp === undefined) {
                setUncontrolledOpen(nextOpen);
            }
            onOpenChange?.(nextOpen, details);
            if (!nextOpen) {
                onCancel?.();
            }
        },
        [onCancel, onOpenChange, openProp]
    );

    const handleApply = useCallback(() => {
        onApply?.();
        closePopover();
    }, [closePopover, onApply]);

    const handleCancel = useCallback(() => {
        onCancel?.();
        closePopover();
    }, [closePopover, onCancel]);

    const pickerUi = useMemo(
        () => ({
            id,
            value: value?.start ?? null,
            setValue: () => {},
            dateFormat,
            placeholder,
            size,
            minDate,
            maxDate,
            weekStartsOn,
            disabled,
            readOnly,
            hasFooter: showFooter,
            setHasFooter: () => {},
            onApply: handleApply,
            onCancel: handleCancel,
            focusCalendar,
            closePopover
        }),
        [
            closePopover,
            dateFormat,
            disabled,
            focusCalendar,
            handleApply,
            handleCancel,
            id,
            maxDate,
            minDate,
            placeholder,
            readOnly,
            showFooter,
            size,
            value?.start,
            weekStartsOn
        ]
    );

    const rangeUi = useMemo(
        () => ({
            rangeValue: value,
            setRangeValue: setValue,
            showFooter,
            presets,
            closePopover
        }),
        [closePopover, presets, setValue, showFooter, value]
    );

    return (
        <DatePickerUiProvider value={pickerUi}>
            <DateRangePickerUiProvider value={rangeUi}>
                <Popover.Root
                    onOpenChange={handleOpenChange}
                    open={open}
                    positioning={positioning}
                    reduceMotion={reduceMotion}
                >
                    <Box {...rest}>{children}</Box>
                </Popover.Root>
            </DateRangePickerUiProvider>
        </DatePickerUiProvider>
    );
}

/**
 * Date Range Picker component — calendar popover for selecting a start and end date range.
 *
 * @see Docs https://dreamy-ui.com/docs/components/date-picker
 */
export const Root = withProvider(DateRangePickerRoot, "root");

export interface DateRangePickerTriggerProps extends ButtonProps {}

export const Trigger = withContext(function DateRangePickerTrigger(
    props: DateRangePickerTriggerProps
) {
    const { disabled } = useDatePickerUi();

    return (
        <Popover.Trigger>
            <Button
                disabled={disabled}
                variant="outline"
                {...props}
            />
        </Popover.Trigger>
    );
}, "trigger");

export interface DateRangePickerInputProps extends InputGroupProps {}

export const Input = withContext(function DateRangePickerInput(props: DateRangePickerInputProps) {
    const { ref: _ref, ...inputProps } = props;
    const context = useDatePickerUi();
    const { rangeValue } = useDateRangePickerUi();
    const field = useFieldContext();

    const formattedRange =
        rangeValue?.start && rangeValue?.end
            ? `${dayjs(rangeValue.start).format(context.dateFormat)} – ${dayjs(rangeValue.end).format(context.dateFormat)}`
            : "";

    return (
        <InputComponent.Group>
            <Popover.Trigger>
                <InputComponent
                    aria-labelledby={field?.labelId}
                    cursor="pointer"
                    disabled={context.disabled}
                    id={field?.id}
                    placeholder={context.placeholder}
                    readOnly
                    type="text"
                    value={formattedRange}
                    {...(inputProps as InputProps)}
                />
            </Popover.Trigger>
            <InputComponent.EndAddon>
                <CalendarIcon aria-hidden="true" />
            </InputComponent.EndAddon>
        </InputComponent.Group>
    );
}, "trigger");

export interface DateRangePickerPopoverProps extends Popover.PopoverContentProps {}

export const PopoverContent: (props: DateRangePickerPopoverProps) => React.JSX.Element = withContext(
    function DateRangePickerPopover(
        props: DateRangePickerPopoverProps
    ) {
    const { children, onAnimationComplete, ...rest } = props;
    const ui = useDatePickerUi();
    const { rangeValue, setRangeValue, showFooter, closePopover } = useDateRangePickerUi();
    const isoRange = useMemo(() => rangeToIsoRange(rangeValue), [rangeValue]);
    const minIso = useMemo(() => jsDateToIsoDate(ui.minDate) ?? undefined, [ui.minDate]);
    const maxIso = useMemo(() => jsDateToIsoDate(ui.maxDate) ?? undefined, [ui.maxDate]);

    return (
        <Popover.Content
            role="dialog"
            {...rest}
            onAnimationComplete={(definition) => {
                ui.focusCalendar();
                onAnimationComplete?.(definition);
            }}
        >
            <UiSdkCalendar
                disabled={ui.disabled}
                max={maxIso}
                min={minIso}
                mode="range"
                onValueChange={(next) => {
                    const mapped = Array.isArray(next)
                        ? isoRangeToRange(next as [string, string])
                        : null;
                    setRangeValue(mapped);
                    if (!showFooter && mapped?.start && mapped?.end) {
                        closePopover();
                    }
                }}
                readOnly={ui.readOnly}
                value={isoRange}
                weekStartsOn={ui.weekStartsOn}
            >
                {children}
            </UiSdkCalendar>
        </Popover.Content>
    );
}, "popover", { forwardProps: ["container"] } as never) as (
    props: DateRangePickerPopoverProps
) => React.JSX.Element;

export const CalendarHeader = withContext(Flex, "calendarHeader");
export const CalendarTitle = withContext(Box, "calendarTitle");
export const CalendarNav = withContext(Flex, "calendarNav");
export const CalendarNavButton = withContext(Button, "calendarNavButton");
export const CalendarGrid = withContext(Box, "calendarGrid");
export const CalendarGridHeader = withContext(Box, "calendarGridHeader");
export const CalendarGridHeaderCell = withContext(Box, "calendarGridHeaderCell");
export const CalendarGridBody = withContext(Box, "calendarGridBody");
export const CalendarCell = withContext(Box, "calendarCell");
export const CalendarCellButton = withContext(Button, "calendarCellButton");

export interface DateRangePickerCalendarProps extends BoxProps {}

export const Calendar = withContext(function DateRangePickerCalendar(
    props: DateRangePickerCalendarProps
) {
    const ui = useDatePickerUi();

    return (
        <Box {...props}>
            <CalendarHeader>
                <UiSdkPickerHeader />
            </CalendarHeader>
            <UiSdkPickerCalendar gridId={`${ui.id}-calendar-grid`} />
        </Box>
    );
}, "calendar");

export interface DateRangePickerRangePresetProps extends BoxProps {}

export const RangePreset = withContext(function DateRangePickerRangePreset(
    props: DateRangePickerRangePresetProps
) {
    const { presets, setRangeValue, showFooter, closePopover } = useDateRangePickerUi();

    if (!presets) return null;

    return (
        <Box {...props}>
            {Object.values(presets).map((preset) => (
                <RangePresetButton
                    key={preset.label}
                    onClick={() => {
                        setRangeValue(preset.value);
                        if (!showFooter && preset.value.start && preset.value.end) {
                            closePopover();
                        }
                    }}
                    value={preset.value}
                >
                    {preset.label}
                </RangePresetButton>
            ))}
        </Box>
    );
}, "rangePreset");

export interface DateRangePickerRangePresetButtonProps extends Omit<ButtonProps, "value"> {
    value: DreamyDateRange;
}

export const RangePresetButton = withContext(function DateRangePickerRangePresetButton(
    props: DateRangePickerRangePresetButtonProps
) {
    const { rangeValue } = useDateRangePickerUi();
    const { value: dateRangeValue, ...restProps } = props;
    const isSelected =
        rangeValue?.start &&
        rangeValue?.end &&
        dayjs(rangeValue.start).isSame(dayjs(dateRangeValue.start), "day") &&
        dayjs(rangeValue.end).isSame(dayjs(dateRangeValue.end), "day");

    return (
        <Button
            size="sm"
            variant={isSelected ? "solid" : "outline"}
            {...restProps}
        />
    );
}, "rangePresetButton");

export interface DateRangePickerFooterProps extends FlexProps {}

export const Footer = withContext(function DateRangePickerFooter(
    props: DateRangePickerFooterProps
) {
    const { showFooter } = useDateRangePickerUi();
    const { onApply, onCancel } = useDatePickerUi();

    if (!showFooter) return null;

    return (
        <Flex {...props}>
            <FooterButton
                onClick={onCancel}
                variant="outline"
            >
                Cancel
            </FooterButton>
            <FooterButton
                onClick={onApply}
                variant="solid"
            >
                Apply
            </FooterButton>
        </Flex>
    );
}, "footer");

export const FooterButton = withContext(Button, "footerButton");
