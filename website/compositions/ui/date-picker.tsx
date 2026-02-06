"use client";

import { createContext } from "@dreamy-ui/react";
import { useControllableState } from "@dreamy-ui/react";
import dayjs, { type Dayjs } from "dayjs";
import { forwardRef, useMemo, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { LuCalendar } from "react-icons/lu";
import { createStyleContext } from "styled-system/jsx";
import { type DatePickerVariantProps, datePicker } from "styled-system/recipes";
import { Box, type BoxProps } from "./box";
import { Button, type ButtonProps } from "./button";
import { Flex, type FlexProps } from "./flex";
import { Icon } from "./icon";
import { IconButton, type IconButtonProps } from "./icon-button";
import {
    Input as InputComponent,
    InputGroup,
    type InputGroupProps,
    InputRightAddon
} from "./input";
import * as Popover from "./popover";

const { withProvider, withContext } = createStyleContext(datePicker);

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DatePickerContextValue {
    value: Date | null;
    setValue: (date: Date | null) => void;
    viewDate: Dayjs;
    setViewDate: (date: Dayjs) => void;
    minDate?: Date;
    maxDate?: Date;
    dateFormat: string;
    placeholder: string;
    showFooter: boolean;
    onApply?: () => void;
    onCancel?: () => void;
}

const [DatePickerProvider, useDatePickerContext] = createContext<DatePickerContextValue>({
    strict: true,
    name: "DatePickerContext"
});

export interface DatePickerRootProps
    extends Omit<BoxProps, "defaultValue" | "onChange" | "value">,
        DatePickerVariantProps {
    /**
     * The selected date value
     */
    value?: Date | null;
    /**
     * The default selected date value
     */
    defaultValue?: Date | null;
    /**
     * Callback fired when the date changes
     */
    onChange?: (date: Date | null) => void;
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
     * @default "Select date"
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
}

export const Root = withProvider(
    forwardRef<HTMLDivElement, DatePickerRootProps>(function DatePickerRoot(props, ref) {
        const {
            value: valueProp,
            defaultValue,
            onChange,
            onApply,
            onCancel,
            dateFormat = "MMM D, YYYY",
            placeholder = "Select date",
            minDate,
            maxDate,
            showFooter = false,
            children,
            ...rest
        } = props;

        const [value, setValue] = useControllableState({
            value: valueProp,
            defaultValue: defaultValue ?? null,
            onChange
        });

        const [isOpen, setIsOpen] = useState(false);
        const [viewDate, setViewDate] = useState(() => (value ? dayjs(value) : dayjs()));

        const handleApply = () => {
            onApply?.();
            setIsOpen(false);
        };

        const handleCancel = () => {
            onCancel?.();
            setIsOpen(false);
        };

        return (
            <DatePickerProvider
                value={{
                    value,
                    setValue: (date) => {
                        setValue(date);
                        if (!showFooter && date) {
                            setIsOpen(false);
                        }
                    },
                    viewDate,
                    setViewDate,
                    minDate,
                    maxDate,
                    dateFormat,
                    placeholder,
                    showFooter,
                    onApply: handleApply,
                    onCancel: handleCancel
                }}
            >
                <Popover.Root
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onOpen={() => setIsOpen(true)}
                >
                    <Box
                        ref={ref}
                        {...rest}
                    >
                        {children}
                    </Box>
                </Popover.Root>
            </DatePickerProvider>
        );
    }),
    "root"
);

export interface DatePickerTriggerProps extends ButtonProps {}

export const Trigger = withContext(
    forwardRef<HTMLButtonElement, DatePickerTriggerProps>(function DatePickerTrigger(props, ref) {
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

export interface DatePickerInputProps extends InputGroupProps {}

export const Input = withContext(
    forwardRef<HTMLDivElement, DatePickerInputProps>(function DatePickerInput(props, ref) {
        const context = useDatePickerContext();
        const formattedDate = context.value ? dayjs(context.value).format(context.dateFormat) : "";

        return (
            <Popover.Trigger>
                <InputGroup ref={ref}>
                    <InputComponent
                        placeholder={context.placeholder}
                        readOnly
                        value={formattedDate}
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

export interface DatePickerPopoverProps extends Popover.PopoverContentProps {}

export const PopoverContent = withContext(
    forwardRef<HTMLElement, DatePickerPopoverProps>(function DatePickerPopover(props, ref) {
        const { transition: _, ...restProps } = props;
        return (
            <Popover.Content
                ref={ref}
                {...restProps}
            />
        );
    }),
    "popover"
);

export interface DatePickerCalendarProps extends BoxProps {}

export const Calendar = withContext(
    forwardRef<HTMLDivElement, DatePickerCalendarProps>(function DatePickerCalendar(props, ref) {
        const context = useDatePickerContext();
        const { value, setValue, viewDate, setViewDate, minDate, maxDate } = context;

        const selectedDate = value ? dayjs(value) : null;

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
            setValue(date.toDate());
        };

        const isToday = (date: Dayjs) => date.isSame(dayjs(), "day");
        const isSelected = (date: Dayjs) => selectedDate?.isSame(date, "day");
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
                            aria-label="Previous month"
                            onClick={handlePreviousMonth}
                            type="button"
                        >
                            <Icon as={BiChevronLeft} />
                        </CalendarNavButton>
                        <CalendarTitle>{viewDate.format("MMMM YYYY")}</CalendarTitle>
                        <CalendarNavButton
                            aria-label="Next month"
                            onClick={handleNextMonth}
                            type="button"
                        >
                            <Icon as={BiChevronRight} />
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
                                    data-outside-month={isOutsideMonth(date) ? "" : undefined}
                                    data-selected={isSelected(date) ? "" : undefined}
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

export interface DatePickerCalendarHeaderProps extends FlexProps {}

export const CalendarHeader = withContext(
    forwardRef<HTMLDivElement, DatePickerCalendarHeaderProps>(
        function DatePickerCalendarHeader(props, ref) {
            return (
                <Flex
                    ref={ref}
                    {...props}
                />
            );
        }
    ),
    "calendarHeader"
);

export interface DatePickerCalendarTitleProps extends BoxProps {}

export const CalendarTitle = withContext(
    forwardRef<HTMLDivElement, DatePickerCalendarTitleProps>(
        function DatePickerCalendarTitle(props, ref) {
            return (
                <Box
                    ref={ref}
                    {...props}
                />
            );
        }
    ),
    "calendarTitle"
);

export interface DatePickerCalendarNavProps extends FlexProps {}

export const CalendarNav = withContext(
    forwardRef<HTMLDivElement, DatePickerCalendarNavProps>(
        function DatePickerCalendarNav(props, ref) {
            return (
                <Flex
                    ref={ref}
                    {...props}
                />
            );
        }
    ),
    "calendarNav"
);

export interface DatePickerCalendarNavButtonProps extends IconButtonProps {}

export const CalendarNavButton = withContext(
    forwardRef<HTMLButtonElement, DatePickerCalendarNavButtonProps>(
        function DatePickerCalendarNavButton(props, ref) {
            return (
                <IconButton
                    ref={ref}
                    size="sm"
                    variant="ghost"
                    {...props}
                />
            );
        }
    ),
    "calendarNavButton"
);

export interface DatePickerCalendarGridProps extends BoxProps {}

export const CalendarGrid = withContext(
    forwardRef<HTMLDivElement, DatePickerCalendarGridProps>(
        function DatePickerCalendarGrid(props, ref) {
            return (
                <Box
                    ref={ref}
                    {...props}
                />
            );
        }
    ),
    "calendarGrid"
);

export interface DatePickerCalendarGridHeaderProps extends BoxProps {}

export const CalendarGridHeader = withContext(
    forwardRef<HTMLDivElement, DatePickerCalendarGridHeaderProps>(
        function DatePickerCalendarGridHeader(props, ref) {
            return (
                <Box
                    ref={ref}
                    {...props}
                />
            );
        }
    ),
    "calendarGridHeader"
);

export interface DatePickerCalendarGridHeaderCellProps extends BoxProps {}

export const CalendarGridHeaderCell = withContext(
    forwardRef<HTMLDivElement, DatePickerCalendarGridHeaderCellProps>(
        function DatePickerCalendarGridHeaderCell(props, ref) {
            return (
                <Box
                    ref={ref}
                    {...props}
                />
            );
        }
    ),
    "calendarGridHeaderCell"
);

export interface DatePickerCalendarGridBodyProps extends BoxProps {}

export const CalendarGridBody = withContext(
    forwardRef<HTMLDivElement, DatePickerCalendarGridBodyProps>(
        function DatePickerCalendarGridBody(props, ref) {
            return (
                <Box
                    ref={ref}
                    {...props}
                />
            );
        }
    ),
    "calendarGridBody"
);

export interface DatePickerCalendarCellProps extends BoxProps {}

export const CalendarCell = withContext(
    forwardRef<HTMLDivElement, DatePickerCalendarCellProps>(
        function DatePickerCalendarCell(props, ref) {
            return (
                <Box
                    ref={ref}
                    {...props}
                />
            );
        }
    ),
    "calendarCell"
);

export interface DatePickerCalendarCellButtonProps extends ButtonProps {}

export const CalendarCellButton = withContext(
    forwardRef<HTMLButtonElement, DatePickerCalendarCellButtonProps>(
        function DatePickerCalendarCellButton(props, ref) {
            return (
                <Button
                    ref={ref}
                    size="md"
                    variant="ghost"
                    {...props}
                />
            );
        }
    ),
    "calendarCellButton"
);

export interface DatePickerFooterProps extends FlexProps {}

export const Footer = withContext(
    forwardRef<HTMLDivElement, DatePickerFooterProps>(function DatePickerFooter(props, ref) {
        const context = useDatePickerContext();

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

export interface DatePickerFooterButtonProps extends ButtonProps {}

export const FooterButton = withContext(
    forwardRef<HTMLButtonElement, DatePickerFooterButtonProps>(
        function DatePickerFooterButton(props, ref) {
            return (
                <Button
                    ref={ref}
                    {...props}
                />
            );
        }
    ),
    "footerButton"
);
