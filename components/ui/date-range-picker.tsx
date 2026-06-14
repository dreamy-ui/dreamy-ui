"use client";

import { createContext } from "@dreamy-ui/react";
import { useControllableState } from "@dreamy-ui/react";
import dayjs, { type Dayjs } from "dayjs";
import { forwardRef, useMemo, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { LuCalendar } from "react-icons/lu";
import { createStyleContext } from "styled-system/jsx";
import { type DateRangePickerVariantProps, dateRangePicker } from "styled-system/recipes";
import { Box, type BoxProps } from "./box";
import { Button, type ButtonProps } from "./button";
import { Flex, type FlexProps } from "./flex";
import { Input as InputComponent, InputGroup, type InputGroupProps, InputRightAddon } from "./input";
import * as Popover from "./popover";

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

export interface DateRangePickerRootProps extends Omit<BoxProps, "defaultValue" | "onChange" | "value">, DateRangePickerVariantProps {
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
}

export const Root = withProvider(
    forwardRef<HTMLDivElement, DateRangePickerRootProps>(function DateRangePickerRoot(props, ref) {
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
                onOpen={handleApply}
                onClose={handleCancel}
            >
                <Box
                    ref={ref}
                    {...rest}
                >
                    {children}
                </Box>
            </Popover.Root>
        </DateRangePickerProvider>
    );
    }),
    "root"
);

export interface DateRangePickerTriggerProps extends ButtonProps {}

export const Trigger = withContext(
    forwardRef<HTMLButtonElement, DateRangePickerTriggerProps>(function DateRangePickerTrigger(props, ref) {
        return (
            <Popover.Trigger>
                <Button
                    ref={ref}
                    variant="outline"
                    {...props}
                />
            </Popover.Trigger>
        );
    }),
    "trigger"
);

export interface DateRangePickerInputProps extends InputGroupProps {}

export const Input = withContext(
    forwardRef<HTMLDivElement, DateRangePickerInputProps>(function DateRangePickerInput(props, ref) {
        const context = useDateRangePickerContext();
        const formattedRange =
            context.value?.start && context.value?.end
                ? `${dayjs(context.value.start).format(context.dateFormat)} – ${dayjs(context.value.end).format(context.dateFormat)}`
                : context.placeholder;

        return (
            <Popover.Trigger>
                <InputGroup ref={ref}>
                    <InputComponent
                        placeholder={context.placeholder}
                        readOnly
                        value={formattedRange}
                        {...props}
                    />
                    <InputRightAddon>
                        <LuCalendar />
                    </InputRightAddon>
                </InputGroup>
            </Popover.Trigger>
        );
    }),
    "trigger"
);

export interface DateRangePickerPopoverProps extends Omit<Popover.PopoverContentProps, "transition"> {}

export const PopoverContent = withContext(
    forwardRef<HTMLElement, DateRangePickerPopoverProps>(function DateRangePickerPopover(props, ref) {
        const { transition, ...restProps } = props;
        return (
            <Popover.Content
                ref={ref}
                {...restProps}
            />
        );
    }),
    "popover"
);

export interface DateRangePickerCalendarProps extends BoxProps {}

export const Calendar = withContext(
    forwardRef<HTMLDivElement, DateRangePickerCalendarProps>(function DateRangePickerCalendar(props, ref) {
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
            <Box
                ref={ref}
                {...props}
            >
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
    }),
    "calendar"
);

export interface DateRangePickerCalendarHeaderProps extends FlexProps {}

export const CalendarHeader = withContext(
    forwardRef<HTMLDivElement, DateRangePickerCalendarHeaderProps>(function DateRangePickerCalendarHeader(props, ref) {
        return (
            <Flex
                ref={ref}
                {...props}
            />
        );
    }),
    "calendarHeader"
);

export interface DateRangePickerCalendarTitleProps extends BoxProps {}

export const CalendarTitle = withContext(
    forwardRef<HTMLDivElement, DateRangePickerCalendarTitleProps>(function DateRangePickerCalendarTitle(props, ref) {
        return (
            <Box
                ref={ref}
                {...props}
            />
        );
    }),
    "calendarTitle"
);

export interface DateRangePickerCalendarNavProps extends FlexProps {}

export const CalendarNav = withContext(
    forwardRef<HTMLDivElement, DateRangePickerCalendarNavProps>(function DateRangePickerCalendarNav(props, ref) {
        return (
            <Flex
                ref={ref}
                {...props}
            />
        );
    }),
    "calendarNav"
);

export interface DateRangePickerCalendarNavButtonProps extends ButtonProps {}

export const CalendarNavButton = withContext(
    forwardRef<HTMLButtonElement, DateRangePickerCalendarNavButtonProps>(function DateRangePickerCalendarNavButton(props, ref) {
        return (
            <Button
                ref={ref}
                size="sm"
                variant="ghost"
                {...props}
            />
        );
    }),
    "calendarNavButton"
);

export interface DateRangePickerCalendarGridProps extends BoxProps {}

export const CalendarGrid = withContext(
    forwardRef<HTMLDivElement, DateRangePickerCalendarGridProps>(function DateRangePickerCalendarGrid(props, ref) {
        return (
            <Box
                ref={ref}
                {...props}
            />
        );
    }),
    "calendarGrid"
);

export interface DateRangePickerCalendarGridHeaderProps extends BoxProps {}

export const CalendarGridHeader = withContext(
    forwardRef<HTMLDivElement, DateRangePickerCalendarGridHeaderProps>(function DateRangePickerCalendarGridHeader(props, ref) {
        return (
            <Box
                ref={ref}
                {...props}
            />
        );
    }),
    "calendarGridHeader"
);

export interface DateRangePickerCalendarGridHeaderCellProps extends BoxProps {}

export const CalendarGridHeaderCell = withContext(
    forwardRef<HTMLDivElement, DateRangePickerCalendarGridHeaderCellProps>(function DateRangePickerCalendarGridHeaderCell(props, ref) {
    return (
        <Box
            ref={ref}
            {...props}
            />
        );
    }),
    "calendarGridHeaderCell"
);

export interface DateRangePickerCalendarGridBodyProps extends BoxProps {}

export const CalendarGridBody = withContext(
    forwardRef<HTMLDivElement, DateRangePickerCalendarGridBodyProps>(function DateRangePickerCalendarGridBody(props, ref) {
        return (
            <Box
                ref={ref}
                {...props}
            />
        );
    }),
    "calendarGridBody"
);

export interface DateRangePickerCalendarCellProps extends BoxProps {}

export const CalendarCell = withContext(
    forwardRef<HTMLDivElement, DateRangePickerCalendarCellProps>(function DateRangePickerCalendarCell(props, ref) {
        return (
            <Box
                ref={ref}
                {...props}
            />
        );
    }),
    "calendarCell"
);

export interface DateRangePickerCalendarCellButtonProps extends ButtonProps {}

export const CalendarCellButton = withContext(
    forwardRef<HTMLButtonElement, DateRangePickerCalendarCellButtonProps>(function DateRangePickerCalendarCellButton(props, ref) {
    return (
        <Button
            ref={ref}
            size="sm"
            variant="ghost"
            {...props}
        />
    );
    }),
    "calendarCellButton"
);

export interface DateRangePickerRangePresetProps extends BoxProps {}

export const RangePreset = withContext(
    forwardRef<HTMLDivElement, DateRangePickerRangePresetProps>(function DateRangePickerRangePreset(props, ref) {
        const context = useDateRangePickerContext();

        if (!context.presets) {
            return null;
        }

        return (
            <Box
                ref={ref}
                {...props}
            >
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
    }),
    "rangePreset"
);

export interface DateRangePickerRangePresetButtonProps extends Omit<ButtonProps, "value"> {
    value: DateRange;
}

export const RangePresetButton = withContext(
    forwardRef<HTMLButtonElement, DateRangePickerRangePresetButtonProps>(function DateRangePickerRangePresetButton(props, ref) {
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
                ref={ref}
                size="sm"
                variant={isSelected ? "solid" : "outline"}
                {...buttonProps}
            />
        );
    }),
    "rangePresetButton"
);

export interface DateRangePickerFooterProps extends FlexProps {}

export const Footer = withContext(
    forwardRef<HTMLDivElement, DateRangePickerFooterProps>(function DateRangePickerFooter(props, ref) {
        const context = useDateRangePickerContext();

        if (!context.showFooter) {
            return null;
        }

        return (
            <Flex
                ref={ref}
                {...props}
            >
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
    }),
    "footer"
);

export interface DateRangePickerFooterButtonProps extends ButtonProps {}

export const FooterButton = withContext(
    forwardRef<HTMLButtonElement, DateRangePickerFooterButtonProps>(function DateRangePickerFooterButton(props, ref) {
        return (
            <Button
                ref={ref}
                {...props}
            />
        );
    }),
    "footerButton"
);
