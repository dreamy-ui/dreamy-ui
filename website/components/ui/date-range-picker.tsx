"use client";

import {
    DatePicker as ArkDatePicker,
    type DatePickerRootProps as ArkDatePickerRootProps,
    type OpenChangeDetails,
    type ValueChangeDetails,
} from "@ark-ui/react/date-picker";
import {
    CalendarIcon,
    createContext,
    type PositioningProps,
    useControllableState,
    useFieldContext
} from "@dreamy-ui/react";
import dayjs from "dayjs";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { createStyleContext } from "styled-system/jsx";
import { type DateRangePickerVariantProps, dateRangePicker } from "styled-system/recipes";
import { ArkPickerCalendar, ArkPickerHeader } from "./ark-calendar";
import {
    type DreamyDateRange,
    arkValueToRange,
    calendarDateToJsDate,
    jsDateToArkMinMax,
    rangeToArkValue
} from "./date-adapters";
import {
    DatePickerUiProvider,
    useDatePickerUi
} from "./date-picker-ui-context";
import { Box, type BoxProps } from "./box";
import { Button, type ButtonProps } from "./button";
import { Flex, type FlexProps } from "./flex";
import { Input as InputComponent, type InputGroupProps, type InputProps } from "./input";
import * as Popover from "./popover";

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

export interface DateRangePickerRootProps
    extends Omit<BoxProps, "defaultValue" | "onChange" | "value">,
        DateRangePickerVariantProps {
    value?: DreamyDateRange | null;
    defaultValue?: DreamyDateRange | null;
    onChange?: (range: DreamyDateRange | null) => void;
    onApply?: () => void;
    onCancel?: () => void;
    dateFormat?: string;
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
    showFooter?: boolean;
    presets?: Record<string, { label: string; value: DreamyDateRange }>;
    positioning?: PositioningProps;
    popoverProps?: Omit<Popover.PopoverProps, "positioning">;
}

function DateRangePickerRoot(props: DateRangePickerRootProps) {
    const {
        value: valueProp,
        defaultValue,
        onChange,
        onApply,
        onCancel,
        dateFormat = "MMM D, YYYY",
        placeholder = "Select date range",
        minDate,
        maxDate,
        showFooter = false,
        presets,
        positioning,
        popoverProps,
        children,
        size,
        ...rest
    } = props;

    const id = useId();

    const focusCalendar = useCallback(
        function focusCalendar() {
            document.getElementById(`${id}-calendar-grid`)?.focus();
        },
        [id]
    );

    const [value, setValue] = useControllableState<DreamyDateRange | null>({
        value: valueProp,
        defaultValue: defaultValue ?? null,
        onChange
    });

    const [open, setOpen] = useState(popoverProps?.defaultOpen ?? false);

    useEffect(
        function syncOpenFromPopoverProps() {
            if (typeof popoverProps?.open === "boolean") {
                setOpen(popoverProps.open);
            }
        },
        [popoverProps?.open]
    );

    const arkValue = useMemo(
        function mapArkValue() {
            return rangeToArkValue(value);
        },
        [value]
    );

    const closePopover = useCallback(
        function closePopover() {
            setOpen(false);
            popoverProps?.onOpenChange?.({ open: false });
        },
        [popoverProps]
    );

    const handleArkValueChange = useCallback(
        function handleArkValueChange(details: ValueChangeDetails) {
            const next = arkValueToRange(details.value);
            setValue(next);
            if (!showFooter && next?.start && next?.end) {
                closePopover();
            }
        },
        [setValue, showFooter, closePopover]
    );

    const handleOpenChange = useCallback(
        function handleOpenChange(details: OpenChangeDetails) {
            setOpen(details.open);
            popoverProps?.onOpenChange?.(details);
        },
        [popoverProps]
    );

    const handleApply = useCallback(
        function handleApply() {
            onApply?.();
            closePopover();
        },
        [onApply, closePopover]
    );

    const handleCancel = useCallback(
        function handleCancel() {
            onCancel?.();
            closePopover();
        },
        [onCancel, closePopover]
    );

    const pickerUi = useMemo(
        function createPickerUi() {
            return {
                id,
                value: value?.start ?? null,
                setValue: function noop() {},
                dateFormat,
                placeholder,
                size,
                minDate,
                maxDate,
                hasFooter: showFooter,
                setHasFooter: function noop() {},
                onApply: handleApply,
                onCancel: handleCancel,
                focusCalendar
            };
        },
        [
            id,
            value?.start,
            dateFormat,
            placeholder,
            size,
            minDate,
            maxDate,
            showFooter,
            handleApply,
            handleCancel,
            focusCalendar
        ]
    );

    const rangeUi = useMemo(
        function createRangeUi() {
            return {
                rangeValue: value,
                setRangeValue: setValue,
                showFooter,
                presets,
                closePopover
            };
        },
        [value, setValue, showFooter, presets, closePopover]
    );

    const arkRootProps: ArkDatePickerRootProps = {
        id,
        value: arkValue,
        onValueChange: handleArkValueChange,
        open,
        onOpenChange: handleOpenChange,
        openOnClick: false,
        closeOnSelect: !showFooter,
        startOfWeek: 1,
        min: jsDateToArkMinMax(minDate),
        max: jsDateToArkMinMax(maxDate),
        selectionMode: "range",
        format: function formatArkDate(date) {
            return dayjs(calendarDateToJsDate(date)).format(dateFormat);
        }
    };

    return (
        <ArkDatePicker.Root {...arkRootProps}>
            <DatePickerUiProvider value={pickerUi}>
                <DateRangePickerUiProvider value={rangeUi}>
                    <Popover.Root
                        open={open}
                        onOpenChange={(details) => {
                            setOpen(details.open);
                            popoverProps?.onOpenChange?.(details);
                            if (!details.open) {
                                onCancel?.();
                            }
                        }}
                        positioning={positioning}
                        {...popoverProps}
                        portalProps={{
                            zIndex: "var(--z-index-popover)",
                            ...popoverProps?.portalProps
                        }}
                    >
                        <Box {...rest}>{children}</Box>
                    </Popover.Root>
                </DateRangePickerUiProvider>
            </DatePickerUiProvider>
        </ArkDatePicker.Root>
    );
}

export const Root = withProvider(DateRangePickerRoot, "root");

export interface DateRangePickerTriggerProps extends ButtonProps {}

export const Trigger = withContext(function DateRangePickerTrigger(
    props: DateRangePickerTriggerProps
) {
    return (
        <Popover.Trigger>
            <Button
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
                    id={field?.id}
                    placeholder={context.placeholder}
                    readOnly
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

export interface DateRangePickerPopoverProps
    extends Omit<Popover.PopoverContentProps, "transition"> {}

export const PopoverContent = withContext(function DateRangePickerPopover(
    props: DateRangePickerPopoverProps
) {
    const { children, onAnimationComplete, ...rest } = props;
    const ui = useDatePickerUi();

    return (
        <Popover.Content
            role="dialog"
            {...rest}
            onAnimationComplete={function handleAnimationComplete(definition) {
                ui.focusCalendar();
                onAnimationComplete?.(definition);
            }}
        >
            <ArkDatePicker.Content>{children}</ArkDatePicker.Content>
        </Popover.Content>
    );
}, "popover");

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
                <ArkPickerHeader />
            </CalendarHeader>
            <ArkPickerCalendar gridId={`${ui.id}-calendar-grid`} />
        </Box>
    );
}, "calendar");

export interface DateRangePickerRangePresetProps extends BoxProps {}

export const RangePreset = withContext(function DateRangePickerRangePreset(
    props: DateRangePickerRangePresetProps
) {
    const { presets, setRangeValue, showFooter, closePopover } = useDateRangePickerUi();

    if (!presets) {
        return null;
    }

    return (
        <Box {...props}>
            {Object.values(presets).map((preset) => (
                <RangePresetButton
                    key={preset.label}
                    onClick={function handlePresetClick() {
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
    const { showFooter, onApply, onCancel } = {
        showFooter: useDateRangePickerUi().showFooter,
        onApply: useDatePickerUi().onApply,
        onCancel: useDatePickerUi().onCancel
    };

    if (!showFooter) {
        return null;
    }

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
