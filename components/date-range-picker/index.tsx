"use client";

import { createContext, type PositioningProps } from "@dreamy-ui/react";
import { useControllableState } from "@dreamy-ui/react";
import dayjs, { type Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { LuCalendar } from "react-icons/lu";
import { createStyleContext } from "styled-system/jsx";
import { type DateRangePickerVariantProps, dateRangePicker } from "styled-system/recipes";
import { Box, type BoxProps } from "../box";
import { Button, type ButtonProps } from "../button";
import { Flex, type FlexProps } from "../flex";
import { Input as InputComponent, type InputGroupProps, type InputProps } from "../input";
import * as Popover from "../popover";

const { withProvider, withContext } = createStyleContext(dateRangePicker);

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DateRange {
    start: Date | null;
    end: Date | null;
}

interface DateRangePickerContextValue {
    value: DateRange | null;
    setValue: (range: DateRange | null) => void;
    viewDate: Dayjs;
    setViewDate: (date: Dayjs) => void;
    selectingStart: boolean;
    setSelectingStart: (selecting: boolean) => void;
    minDate?: Date;
    maxDate?: Date;
    dateFormat: string;
    placeholder: string;
    showFooter: boolean;
    presets?: Record<string, { label: string; value: DateRange }>;
    onApply?: () => void;
    onCancel?: () => void;
}

const [DateRangePickerProvider, useDateRangePickerContext] =
    createContext<DateRangePickerContextValue>({
        strict: true,
        name: "DateRangePickerContext"
    });

export interface DateRangePickerRootProps
    extends Omit<BoxProps, "defaultValue" | "onChange" | "value">,
        DateRangePickerVariantProps {
    /**
     * The selected date range value
     */
    value?: DateRange | null;
    /**
     * The default selected date range value
     */
    defaultValue?: DateRange | null;
    /**
     * Callback fired when the date range changes
     */
    onChange?: (range: DateRange | null) => void;
    /**
     * The function to call when the apply button is clicked
     */
    onApply?: () => void;
    /**
     * The function to call when the cancel button is clicked
     */
    onCancel?: () => void;
    /**
     * Format string for displaying the date in the input
     * @default "MMM D, YYYY"
     */
    dateFormat?: string;
    /**
     * Placeholder text for the input
     * @default "Select date range"
     */
    placeholder?: string;
    /**
     * Minimum selectable date
     */
    minDate?: Date;
    /**
     * Maximum selectable date
     */
    maxDate?: Date;
    /**
     * Whether to show the footer with Cancel/Apply buttons
     * @default false
     */
    showFooter?: boolean;
    /**
     * Date range presets to display
     */
    presets?: Record<string, { label: string; value: DateRange }>;
    /**
     * Positioning configuration for the date range picker popover.
     */
    positioning?: PositioningProps;
}

export const Root = withProvider(function DateRangePickerRoot(props: DateRangePickerRootProps) {
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
        children,
        ...rest
    } = props;

    const [value, setValue] = useControllableState<DateRange | null>({
        value: valueProp,
        defaultValue: defaultValue ?? null,
        onChange
    });

    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        if (value?.start) return dayjs(value.start);
        return dayjs();
    });
    const [selectingStart, setSelectingStart] = useState(true);

    const handleApply = () => {
        onApply?.();
        setIsOpen(false);
    };

    const handleCancel = () => {
        onCancel?.();
        setIsOpen(false);
    };

    return (
        <DateRangePickerProvider
            value={{
                value,
                setValue: (range) => {
                    setValue(range);
                    if (!showFooter && range?.start && range?.end) {
                        setIsOpen(false);
                    }
                },
                viewDate,
                setViewDate,
                selectingStart,
                setSelectingStart,
                minDate,
                maxDate,
                dateFormat,
                placeholder,
                showFooter,
                presets,
                onApply: handleApply,
                onCancel: handleCancel
            }}
        >
            <Popover.Root
                isOpen={isOpen}
                onClose={handleCancel}
                onOpen={handleApply}
                positioning={positioning}
            >
                <Box {...rest}>{children}</Box>
            </Popover.Root>
        </DateRangePickerProvider>
    );
}, "root");

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
    const context = useDateRangePickerContext();
    const formattedRange =
        context.value?.start && context.value?.end
            ? `${dayjs(context.value.start).format(context.dateFormat)} – ${dayjs(context.value.end).format(context.dateFormat)}`
            : context.placeholder;

    return (
        <Popover.Trigger>
            <InputComponent.Group>
                <InputComponent
                    placeholder={context.placeholder}
                    readOnly
                    value={formattedRange}
                    {...(inputProps as InputProps)}
                />
                <InputComponent.EndAddon>
                    <LuCalendar />
                </InputComponent.EndAddon>
            </InputComponent.Group>
        </Popover.Trigger>
    );
}, "trigger");

export interface DateRangePickerPopoverProps
    extends Omit<Popover.PopoverContentProps, "transition"> {}

export const PopoverContent = withContext(function DateRangePickerPopover(
    props: DateRangePickerPopoverProps
) {
    return <Popover.Content {...props} />;
}, "popover");

export interface DateRangePickerCalendarProps extends BoxProps {}

export const Calendar = withContext(function DateRangePickerCalendar(
    props: DateRangePickerCalendarProps
) {
    const context = useDateRangePickerContext();
    const {
        value,
        setValue,
        viewDate,
        setViewDate,
        selectingStart,
        setSelectingStart,
        minDate,
        maxDate
    } = context;

    const calendarDays = useMemo(() => {
        const startOfMonth = viewDate.startOf("month");
        const endOfMonth = viewDate.endOf("month");
        const startOfCalendar = startOfMonth.startOf("week");
        const endOfCalendar = endOfMonth.endOf("week");

        const days: Dayjs[] = [];
        let current = startOfCalendar;

        while (current.isBefore(endOfCalendar) || current.isSame(endOfCalendar, "day")) {
            days.push(current);
            current = current.add(1, "day");
        }

        return days;
    }, [viewDate]);

    const handlePreviousMonth = () => {
        setViewDate(viewDate.subtract(1, "month"));
    };

    const handleNextMonth = () => {
        setViewDate(viewDate.add(1, "month"));
    };

    const handleDateClick = (date: Dayjs) => {
        if (minDate && date.isBefore(dayjs(minDate), "day")) return;
        if (maxDate && date.isAfter(dayjs(maxDate), "day")) return;

        const currentRange = value || { start: null, end: null };

        if (selectingStart || !currentRange.start) {
            setValue({ start: date.toDate(), end: null });
            setSelectingStart(false);
        } else {
            if (date.isBefore(dayjs(currentRange.start), "day")) {
                setValue({ start: date.toDate(), end: currentRange.start });
            } else {
                setValue({ start: currentRange.start, end: date.toDate() });
            }
        }
    };

    const isToday = (date: Dayjs) => date.isSame(dayjs(), "day");
    const isStart = (date: Dayjs) => value?.start && dayjs(value.start).isSame(date, "day");
    const isEnd = (date: Dayjs) => value?.end && dayjs(value.end).isSame(date, "day");
    const isInRange = (date: Dayjs) => {
        if (!value?.start || !value?.end) return false;
        const start = dayjs(value.start);
        const end = dayjs(value.end);
        return date.isAfter(start, "day") && date.isBefore(end, "day");
    };
    const isOutsideMonth = (date: Dayjs) => !date.isSame(viewDate, "month");
    const isDisabled = (date: Dayjs) => {
        if (minDate && date.isBefore(dayjs(minDate), "day")) return true;
        if (maxDate && date.isAfter(dayjs(maxDate), "day")) return true;
        return false;
    };

    return (
        <Box {...props}>
            <CalendarHeader>
                <CalendarNav>
                    <CalendarNavButton
                        onClick={handlePreviousMonth}
                        type="button"
                    >
                        <BiChevronLeft />
                    </CalendarNavButton>
                    <CalendarTitle>{viewDate.format("MMMM YYYY")}</CalendarTitle>
                    <CalendarNavButton
                        onClick={handleNextMonth}
                        type="button"
                    >
                        <BiChevronRight />
                    </CalendarNavButton>
                </CalendarNav>
            </CalendarHeader>
            <CalendarGrid>
                <CalendarGridHeader>
                    {WEEKDAYS.map((day) => (
                        <CalendarGridHeaderCell key={day}>{day}</CalendarGridHeaderCell>
                    ))}
                </CalendarGridHeader>
                <CalendarGridBody>
                    {calendarDays.map((date) => (
                        <CalendarCell key={date.format("YYYY-MM-DD")}>
                            <CalendarCellButton
                                data-in-range={isInRange(date) ? "" : undefined}
                                data-outside-month={isOutsideMonth(date) ? "" : undefined}
                                data-range-end={isEnd(date) ? "" : undefined}
                                data-range-start={isStart(date) ? "" : undefined}
                                data-selected={isStart(date) || isEnd(date) ? "" : undefined}
                                data-today={isToday(date) ? "" : undefined}
                                disabled={isDisabled(date)}
                                onClick={() => handleDateClick(date)}
                                type="button"
                            >
                                {date.format("D")}
                            </CalendarCellButton>
                        </CalendarCell>
                    ))}
                </CalendarGridBody>
            </CalendarGrid>
        </Box>
    );
}, "calendar");

export interface DateRangePickerCalendarHeaderProps extends FlexProps {}

export const CalendarHeader = withContext(function DateRangePickerCalendarHeader(
    props: DateRangePickerCalendarHeaderProps
) {
    return <Flex {...props} />;
}, "calendarHeader");

export interface DateRangePickerCalendarTitleProps extends BoxProps {}

export const CalendarTitle = withContext(function DateRangePickerCalendarTitle(
    props: DateRangePickerCalendarTitleProps
) {
    return <Box {...props} />;
}, "calendarTitle");

export interface DateRangePickerCalendarNavProps extends FlexProps {}

export const CalendarNav = withContext(function DateRangePickerCalendarNav(
    props: DateRangePickerCalendarNavProps
) {
    return <Flex {...props} />;
}, "calendarNav");

export interface DateRangePickerCalendarNavButtonProps extends ButtonProps {}

export const CalendarNavButton = withContext(function DateRangePickerCalendarNavButton(
    props: DateRangePickerCalendarNavButtonProps
) {
    return (
        <Button
            size="sm"
            variant="ghost"
            {...props}
        />
    );
}, "calendarNavButton");

export interface DateRangePickerCalendarGridProps extends BoxProps {}

export const CalendarGrid = withContext(function DateRangePickerCalendarGrid(
    props: DateRangePickerCalendarGridProps
) {
    return <Box {...props} />;
}, "calendarGrid");

export interface DateRangePickerCalendarGridHeaderProps extends BoxProps {}

export const CalendarGridHeader = withContext(function DateRangePickerCalendarGridHeader(
    props: DateRangePickerCalendarGridHeaderProps
) {
    return <Box {...props} />;
}, "calendarGridHeader");

export interface DateRangePickerCalendarGridHeaderCellProps extends BoxProps {}

export const CalendarGridHeaderCell = withContext(function DateRangePickerCalendarGridHeaderCell(
    props: DateRangePickerCalendarGridHeaderCellProps
) {
    return <Box {...props} />;
}, "calendarGridHeaderCell");

export interface DateRangePickerCalendarGridBodyProps extends BoxProps {}

export const CalendarGridBody = withContext(function DateRangePickerCalendarGridBody(
    props: DateRangePickerCalendarGridBodyProps
) {
    return <Box {...props} />;
}, "calendarGridBody");

export interface DateRangePickerCalendarCellProps extends BoxProps {}

export const CalendarCell = withContext(function DateRangePickerCalendarCell(
    props: DateRangePickerCalendarCellProps
) {
    return <Box {...props} />;
}, "calendarCell");

export interface DateRangePickerCalendarCellButtonProps extends ButtonProps {}

export const CalendarCellButton = withContext(function DateRangePickerCalendarCellButton(
    props: DateRangePickerCalendarCellButtonProps
) {
    return (
        <Button
            size="sm"
            variant="ghost"
            {...props}
        />
    );
}, "calendarCellButton");

export interface DateRangePickerRangePresetProps extends BoxProps {}

export const RangePreset = withContext(function DateRangePickerRangePreset(
    props: DateRangePickerRangePresetProps
) {
    const context = useDateRangePickerContext();

    if (!context.presets) {
        return null;
    }

    return (
        <Box {...props}>
            {Object.values(context.presets).map((preset) => (
                <RangePresetButton
                    key={preset.label}
                    onClick={() => {
                        context.setValue(preset.value);
                        if (preset.value.start) {
                            context.setViewDate(dayjs(preset.value.start));
                        }
                        if (!context.showFooter) {
                            // Close popover - need to access it from context
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
    value: DateRange;
}

export const RangePresetButton = withContext(function DateRangePickerRangePresetButton(
    props: DateRangePickerRangePresetButtonProps
) {
    const { ref } = props;
    const context = useDateRangePickerContext();
    const { value: dateRangeValue, ...restProps } = props;
    const isSelected =
        context.value?.start &&
        context.value?.end &&
        dayjs(context.value.start).isSame(dayjs(dateRangeValue.start), "day") &&
        dayjs(context.value.end).isSame(dayjs(dateRangeValue.end), "day");

    const buttonProps: Omit<ButtonProps, "ref"> = restProps as Omit<ButtonProps, "ref">;

    return (
        <Button
            size="sm"
            variant={isSelected ? "solid" : "outline"}
            {...buttonProps}
        />
    );
}, "rangePresetButton");

export interface DateRangePickerFooterProps extends FlexProps {}

export const Footer = withContext(function DateRangePickerFooter(
    props: DateRangePickerFooterProps
) {
    const context = useDateRangePickerContext();

    if (!context.showFooter) {
        return null;
    }

    return (
        <Flex {...props}>
            <FooterButton
                onClick={context.onCancel}
                variant="outline"
            >
                Cancel
            </FooterButton>
            <FooterButton
                onClick={context.onApply}
                variant="solid"
            >
                Apply
            </FooterButton>
        </Flex>
    );
}, "footer");

export interface DateRangePickerFooterButtonProps extends ButtonProps {}

export const FooterButton = withContext(function DateRangePickerFooterButton(
    props: DateRangePickerFooterButtonProps
) {
    return <Button {...props} />;
}, "footerButton");
