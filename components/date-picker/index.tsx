"use client";

import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    type PositioningProps,
    createContext,
    dataAttr,
    useControllableState,
    useFieldContext,
    useUpdateEffect
} from "@dreamy-ui/react";
import dayjs, { type Dayjs } from "dayjs";
import * as m from "motion/react-m";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createStyleContext, dreamy } from "styled-system/jsx";
import { type DatePickerVariantProps, datePicker } from "styled-system/recipes";
import { Box, type BoxProps } from "../box";
import { Button, type ButtonProps } from "../button";
import { Flex, type FlexProps } from "../flex";
import { Icon } from "../icon";
import { IconButton, type IconButtonProps } from "../icon-button";
import {
    Input as InputComponent,
    type InputEndAddonProps,
    type InputGroupProps,
    type InputProps
} from "../input";
import * as Popover from "../popover";

const { withProvider, withContext } = createStyleContext(datePicker, { forwardVariants: ["size"] });

const DatePickerCalendarIcon = withContext(CalendarIcon, "calendarIcon");

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type CalendarView = "day" | "month" | "year";

const MONTHS_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
] as const;

const YEARS_PER_PAGE = 9;

function getWeekdays(weekStartsOn: WeekStartsOn): string[] {
    return [...WEEKDAYS.slice(weekStartsOn), ...WEEKDAYS.slice(0, weekStartsOn)];
}

function getCalendarStartDate(viewDate: Dayjs, weekStartsOn: WeekStartsOn): Dayjs {
    const startOfMonth = viewDate.startOf("month");
    const startDay = startOfMonth.day();
    const daysToSubtract = (startDay - weekStartsOn + 7) % 7;
    return startOfMonth.subtract(daysToSubtract, "day");
}

function getCalendarEndDate(viewDate: Dayjs, weekStartsOn: WeekStartsOn): Dayjs {
    const endOfMonth = viewDate.endOf("month");
    const endDay = endOfMonth.day();
    const lastDayOfWeek = (weekStartsOn + 6) % 7;
    const daysToAdd = (lastDayOfWeek - endDay + 7) % 7;
    return endOfMonth.add(daysToAdd, "day");
}

function getInheritedButtonSize(
    size: DatePickerVariantProps["size"]
): "sm" | "md" | "lg" | undefined {
    if (typeof size === "string") {
        return size as "sm" | "md" | "lg";
    }

    if (typeof size === "object" && "base" in size) {
        return (size.base as "sm" | "md" | "lg" | undefined) ?? undefined;
    }

    return undefined;
}

interface DatePickerContextValue {
    id: string;
    focusCalendar(): void;
    value: Date | null;
    setValue: React.Dispatch<React.SetStateAction<Date | null>>;
    viewDate: Dayjs;
    setViewDate: React.Dispatch<React.SetStateAction<Dayjs>>;
    calendarView: CalendarView;
    setCalendarView: React.Dispatch<React.SetStateAction<CalendarView>>;
    size?: DatePickerVariantProps["size"];
    minDate?: Date;
    maxDate?: Date;
    dateFormat: string;
    placeholder: string;
    weekStartsOn: WeekStartsOn;
    hasFooter: boolean;
    setHasFooter: React.Dispatch<React.SetStateAction<boolean>>;
    yearPageStart: number;
    setYearPageStart: React.Dispatch<React.SetStateAction<number>>;
    onApply?: () => void;
    onCancel?: () => void;
    isOpen: boolean;
}

const [DatePickerProvider, useDatePickerContext] = createContext<DatePickerContextValue>({
    strict: true,
    name: "DatePickerContext"
});

function formatDateForInput(date: Date | null): string {
    if (!date) {
        return "";
    }

    return dayjs(date).format("YYYY-MM-DD");
}

function isDateWithinBounds(date: Dayjs, minDate?: Date, maxDate?: Date): boolean {
    if (minDate && date.isBefore(dayjs(minDate), "day")) {
        return false;
    }

    if (maxDate && date.isAfter(dayjs(maxDate), "day")) {
        return false;
    }

    return true;
}

function focusCalendarGridCell(gridRef: React.RefObject<HTMLDivElement | null>, selector: string) {
    requestAnimationFrame(function focusCell() {
        const el = gridRef.current?.querySelector(selector) as HTMLButtonElement | null;
        el?.focus({ preventScroll: true });
    });
}

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
     * First day of week (0 = Sunday, 1 = Monday, ... 6 = Saturday)
     * @default 1
     */
    weekStartsOn?: WeekStartsOn;
    /**
     * Positioning configuration for the date picker popover.
     */
    positioning?: PositioningProps;
    /**
     * Props forwarded to the internal `Popover.Root`.
     * Set `usePortal` to `false` to render the calendar in place.
     */
    popoverProps?: Omit<Popover.PopoverProps, "positioning">;
}

/**
 * DatePicker component — select a single date from a calendar.
 *
 * @see Docs https://dreamy-ui.com/docs/components/date-picker
 *
 * @example
 * ```tsx
 * <DatePicker.Root>
 *   <DatePicker.Control>
 *     <DatePicker.Input />
 *     <DatePicker.Trigger />
 *   </DatePicker.Control>
 *   <DatePicker.Content>
 *     <DatePicker.Calendar />
 *   </DatePicker.Content>
 * </DatePicker.Root>
 * ```
 */
export const Root = withProvider(
    function DatePickerRoot(props: DatePickerRootProps) {
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
            weekStartsOn = 1,
            children,
            positioning,
            popoverProps,
            ...rest
        } = props;
        const calendarSize = props.size;
        const id = useId();
        const focusCalendar = useCallback(
            function focusCalendar() {
                const grid = document.getElementById(`${id}-calendar-grid`);
                const activeCell = grid?.querySelector<HTMLButtonElement>(
                    'button[tabindex="0"]:not(:disabled)'
                );
                activeCell?.focus({ preventScroll: true });
            },
            [id]
        );
        const calendarInitialFocusRef = useMemo(
            function createCalendarInitialFocusRef() {
                return { current: { focus: focusCalendar } };
            },
            [focusCalendar]
        );

        const [value, setValue] = useControllableState({
            value: valueProp,
            defaultValue: defaultValue ?? null,
            onChange
        });

        const [isOpen, setIsOpen] = useState(false);
        const [hasFooter, setHasFooter] = useState(false);
        const [viewDate, setViewDate] = useState(() => (value ? dayjs(value) : dayjs()));
        const [calendarView, setCalendarView] = useState<CalendarView>("day");
        const [yearPageStart, setYearPageStart] = useState(() => {
            const y = value ? dayjs(value).year() : dayjs().year();
            return Math.floor(y / YEARS_PER_PAGE) * YEARS_PER_PAGE;
        });

        // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally excludes viewDate — we only want to reset yearPageStart when transitioning INTO "year" view, not on every viewDate change
        useEffect(
            function syncYearPageOnViewChange() {
                if (calendarView === "year") {
                    setYearPageStart(Math.floor(viewDate.year() / YEARS_PER_PAGE) * YEARS_PER_PAGE);
                }
            },
            [calendarView]
        );

        const handleApply = useCallback(
            function handleApply() {
                onApply?.();
                setIsOpen(false);
            },
            [onApply]
        );

        const handleCancel = useCallback(
            function handleCancel() {
                onCancel?.();
                setIsOpen(false);
            },
            [onCancel]
        );

        const handleValueChange = useCallback(
            function handleValueChange(date: React.SetStateAction<Date | null>) {
                setValue(date);
                if (!hasFooter && date) {
                    setIsOpen(false);
                }
            },
            [hasFooter, setValue]
        );

        const handleClose = useCallback(function handleClose() {
            setIsOpen(false);
        }, []);

        const handleOpen = useCallback(
            function handleOpen() {
                setViewDate(value ? dayjs(value) : dayjs());
                setIsOpen(true);
                setCalendarView("day");
            },
            [value]
        );

        const contextValue = useMemo<DatePickerContextValue>(
            function createContextValue() {
                return {
                    id,
                    focusCalendar,
                    value,
                    setValue: handleValueChange,
                    viewDate,
                    setViewDate,
                    calendarView,
                    setCalendarView,
                    size: calendarSize,
                    minDate,
                    maxDate,
                    dateFormat,
                    placeholder,
                    weekStartsOn,
                    hasFooter,
                    setHasFooter,
                    yearPageStart,
                    setYearPageStart,
                    onApply: handleApply,
                    onCancel: handleCancel,
                    isOpen
                };
            },
            [
                id,
                focusCalendar,
                value,
                handleValueChange,
                viewDate,
                calendarView,
                calendarSize,
                minDate,
                maxDate,
                dateFormat,
                placeholder,
                weekStartsOn,
                hasFooter,
                yearPageStart,
                handleApply,
                handleCancel,
                isOpen
            ]
        );

        return (
            <DatePickerProvider value={contextValue}>
                <Popover.Root
                    isOpen={isOpen}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    positioning={positioning}
                    {...popoverProps}
                    autoFocus
                    initialFocusRef={calendarInitialFocusRef}
                    portalProps={{
                        zIndex: "var(--z-index-popover)",
                        ...popoverProps?.portalProps
                    }}
                >
                    <Box {...rest}>{children}</Box>
                </Popover.Root>
            </DatePickerProvider>
        );
    },
    "root",
    {}
);

export interface DatePickerTriggerProps extends ButtonProps {}

/**
 * DatePicker Trigger — opens the calendar popover.
 */
export const Trigger = withContext(function DatePickerTrigger(props: DatePickerTriggerProps) {
    const context = useDatePickerContext();
    const size = getInheritedButtonSize(context.size);

    return (
        <Popover.Trigger>
            <Button
                size={size}
                variant="outline"
                {...props}
            />
        </Popover.Trigger>
    );
}, "trigger");

export interface DatePickerInputProps extends InputProps {
    /**
     * Props forwarded to the wrapping `Input.Group`.
     */
    inputGroupProps?: InputGroupProps;
    /**
     * Props forwarded to the calendar `Input.EndAddon`.
     * Pass `children` to replace the default calendar icon.
     */
    endAddonProps?: InputEndAddonProps;
}

/**
 * DatePicker Input — typed date field.
 */
export const Input = withContext(function DatePickerInput(props: DatePickerInputProps) {
    const { ref: _ref, inputGroupProps, endAddonProps, ...inputProps } = props;
    const context = useDatePickerContext();
    const field = useFieldContext();
    const formattedDate = useMemo(
        function formatDate() {
            return context.value ? dayjs(context.value).format(context.dateFormat) : "";
        },
        [context.value, context.dateFormat]
    );

    const size = getInheritedButtonSize(context.size);
    const { children: endAddonChildren, ...restEndAddonProps } = endAddonProps ?? {};

    return (
        <InputComponent.Group
            size={size}
            {...inputGroupProps}
        >
            <Popover.Trigger>
                <InputComponent
                    id={field?.id}
                    placeholder={context.placeholder}
                    readOnly
                    value={formattedDate}
                    {...inputProps}
                />
            </Popover.Trigger>
            <InputComponent.EndAddon {...restEndAddonProps}>
                {endAddonChildren ?? <DatePickerCalendarIcon />}
            </InputComponent.EndAddon>
        </InputComponent.Group>
    );
}, "trigger");

export interface DatePickerContentProps extends Omit<Popover.PopoverContentProps, "transition"> {}

/**
 * DatePicker Content — popover panel for the calendar.
 */
export const Content = withContext(function DatePickerContent(props: DatePickerContentProps) {
    const { onAnimationComplete, ...rest } = props;
    const context = useDatePickerContext();

    return (
        <Popover.Content
            {...rest}
            onAnimationComplete={function handleAnimationComplete(definition) {
                if (context.isOpen) {
                    context.focusCalendar();
                }
                onAnimationComplete?.(definition);
            }}
        />
    );
}, "popover");

export interface DatePickerControlProps extends FlexProps {
    inputProps?: InputProps;
    todayButtonProps?: ButtonProps;
}

/**
 * DatePicker Control — input + trigger wrapper.
 */
export const Control = withContext(function DatePickerControl(props: DatePickerControlProps) {
    const { inputProps, todayButtonProps, ...rest } = props;
    const context = useDatePickerContext();
    const minValue = useMemo(
        function getMinValue() {
            return formatDateForInput(context.minDate ?? null);
        },
        [context.minDate]
    );
    const maxValue = useMemo(
        function getMaxValue() {
            return formatDateForInput(context.maxDate ?? null);
        },
        [context.maxDate]
    );

    const [inputValue, setInputValue] = useState(formatDateForInput(context.value));

    const applyInputValue = useCallback(
        function applyInputValue(nextValue: string) {
            if (!nextValue) {
                context.setValue(null);
                setInputValue("");
                return;
            }

            const nextDate = dayjs(nextValue);
            if (
                !nextDate.isValid() ||
                !isDateWithinBounds(nextDate, context.minDate, context.maxDate)
            ) {
                return;
            }

            context.setValue(nextDate.toDate());
            context.setViewDate(nextDate);
            setInputValue(nextValue);
        },
        [context]
    );

    const handleInputChange = useCallback(
        function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
            applyInputValue(event.target.value);
        },
        [applyInputValue]
    );

    const handleInputValueChange = useCallback(function handleInputValueChange(value: string) {
        setInputValue(value);
    }, []);

    const handleInputKeyDown = useCallback(
        function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
            if (event.key === "Enter") {
                event.preventDefault();
                applyInputValue(event.currentTarget.value);
            }
        },
        [applyInputValue]
    );

    useUpdateEffect(() => {
        setInputValue(formatDateForInput(context.value));
    }, [context.value]);

    const handleSetToday = useCallback(
        function handleSetToday() {
            const today = dayjs();
            if (!isDateWithinBounds(today, context.minDate, context.maxDate)) {
                return;
            }

            context.setValue(today.toDate());
            context.setViewDate(today);
        },
        [context]
    );

    const isTodayDisabled = useMemo(
        function getIsTodayDisabled() {
            return !isDateWithinBounds(dayjs(), context.minDate, context.maxDate);
        },
        [context.minDate, context.maxDate]
    );

    const size = getInheritedButtonSize(context.size);

    return (
        <Flex {...rest}>
            <InputComponent
                max={maxValue ?? undefined}
                min={minValue ?? undefined}
                onBlur={handleInputChange}
                onChangeValue={handleInputValueChange}
                onKeyDown={handleInputKeyDown}
                size={size}
                type="date"
                value={inputValue}
                {...inputProps}
            />
            <Button
                isDisabled={isTodayDisabled}
                onClick={handleSetToday}
                size={size}
                type="button"
                variant="outline"
                {...todayButtonProps}
            >
                {todayButtonProps?.children ?? "Today"}
            </Button>
        </Flex>
    );
}, "control");

export interface DatePickerNavProps extends FlexProps {}

/**
 * DatePicker Nav — month/year navigation controls.
 */
export const Nav = withContext(function DatePickerNav(props: DatePickerNavProps) {
    const { calendarView, setCalendarView, size: ctxSize } = useDatePickerContext();
    const inheritedSize = getInheritedButtonSize(ctxSize);
    const size = sizeMap[inheritedSize ?? "md"];

    return (
        <Flex {...props}>
            {(["day", "month", "year"] as const).map(function renderNavItem(view) {
                return (
                    <Button
                        key={view}
                        onClick={function handleNavClick() {
                            setCalendarView(view);
                        }}
                        size={size}
                        type="button"
                        variant={calendarView === view ? "solid" : "ghost"}
                    >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                    </Button>
                );
            })}
        </Flex>
    );
}, "nav");

export interface DatePickerHeaderProps extends Omit<FlexProps, "direction"> {
    previousButtonProps?: DatePickerCalendarNavButtonProps;
    nextButtonProps?: DatePickerCalendarNavButtonProps;
    titleProps?: DatePickerCalendarTitleProps;
}

/**
 * DatePicker Header — calendar header area.
 */
export const Header = withContext(function DatePickerHeader(props: DatePickerHeaderProps) {
    const { previousButtonProps, nextButtonProps, titleProps, ...rest } = props;
    const context = useDatePickerContext();
    const isYearView = context.calendarView === "year";

    const handlePrevious = useCallback(
        function handlePrevious() {
            if (isYearView) {
                context.setYearPageStart((prev) => prev - YEARS_PER_PAGE);
            } else {
                context.setViewDate(context.viewDate.subtract(1, "month"));
            }
        },
        [isYearView, context]
    );

    const handleNext = useCallback(
        function handleNext() {
            if (isYearView) {
                context.setYearPageStart((prev) => prev + YEARS_PER_PAGE);
            } else {
                context.setViewDate(context.viewDate.add(1, "month"));
            }
        },
        [isYearView, context]
    );

    const title = isYearView
        ? `${context.yearPageStart} – ${context.yearPageStart + YEARS_PER_PAGE - 1}`
        : context.viewDate.format("MMMM YYYY");

    return (
        <CalendarHeader {...rest}>
            <CalendarNav>
                <CalendarNavButton
                    aria-label={isYearView ? "Previous years" : "Previous month"}
                    onClick={handlePrevious}
                    type="button"
                    {...previousButtonProps}
                >
                    <Icon as={ChevronLeftIcon} />
                </CalendarNavButton>
                <CalendarTitle {...titleProps}>{title}</CalendarTitle>
                <CalendarNavButton
                    aria-label={isYearView ? "Next years" : "Next month"}
                    onClick={handleNext}
                    type="button"
                    {...nextButtonProps}
                >
                    <Icon as={ChevronRightIcon} />
                </CalendarNavButton>
            </CalendarNav>
        </CalendarHeader>
    );
}, "calendarHeader");

function DayCalendarView() {
    const { id, value, setValue, viewDate, setViewDate, minDate, maxDate, weekStartsOn, isOpen } =
        useDatePickerContext();

    const selectedDate = useMemo(
        function getSelectedDate() {
            return value ? dayjs(value) : null;
        },
        [value]
    );
    const minBound = useMemo(
        function getMinBound() {
            return minDate ? dayjs(minDate) : null;
        },
        [minDate]
    );
    const maxBound = useMemo(
        function getMaxBound() {
            return maxDate ? dayjs(maxDate) : null;
        },
        [maxDate]
    );
    const today = useMemo(function getToday() {
        return dayjs();
    }, []);
    const viewMonthKey = useMemo(
        function getViewMonthKey() {
            return viewDate.format("MM");
        },
        [viewDate]
    );

    const weekdays = useMemo(
        function getOrderedWeekdays() {
            return getWeekdays(weekStartsOn);
        },
        [weekStartsOn]
    );

    const calendarDays = useMemo(
        function getCalendarDays() {
            const startOfCalendar = getCalendarStartDate(viewDate, weekStartsOn);
            const endOfCalendar = getCalendarEndDate(viewDate, weekStartsOn);

            const days: Dayjs[] = [];
            let current = startOfCalendar;

            while (current.isBefore(endOfCalendar) || current.isSame(endOfCalendar, "day")) {
                days.push(current);
                current = current.add(1, "day");
            }

            return days;
        },
        [viewDate, weekStartsOn]
    );

    const handleDateClick = useCallback(
        function handleDateClick(date: Dayjs) {
            if (minBound && date.isBefore(minBound, "day")) return;
            if (maxBound && date.isAfter(maxBound, "day")) return;
            setValue(date.toDate());
        },
        [minBound, maxBound, setValue]
    );

    const getIsToday = useCallback(
        function getIsToday(date: Dayjs) {
            return date.isSame(today, "day");
        },
        [today]
    );
    const getIsSelected = useCallback(
        function getIsSelected(date: Dayjs) {
            return Boolean(selectedDate?.isSame(date, "day"));
        },
        [selectedDate]
    );
    const getIsOutsideMonth = useCallback(
        function getIsOutsideMonth(date: Dayjs) {
            return !date.isSame(viewDate, "month");
        },
        [viewDate]
    );
    const getIsDisabled = useCallback(
        function getIsDisabled(date: Dayjs) {
            if (minBound && date.isBefore(minBound, "day")) return true;
            if (maxBound && date.isAfter(maxBound, "day")) return true;
            return false;
        },
        [minBound, maxBound]
    );

    // --- Keyboard navigation ---
    const getDefaultFocusedDate = useCallback(
        function getDefaultFocusedDate(vd: Dayjs, sel: Dayjs | null): Dayjs {
            if (sel?.isSame(vd, "month")) return sel;
            if (today.isSame(vd, "month")) return today;
            return vd.startOf("month");
        },
        [today]
    );

    const [focusedDate, setFocusedDate] = useState<Dayjs>(() => selectedDate ?? today);

    const gridRef = useRef<HTMLDivElement>(null);
    const shouldMoveFocusRef = useRef(false);
    const isKeyboardNavRef = useRef(false);

    useEffect(
        function resetFocusedDateWhenOpen() {
            if (!isOpen) return;
            setFocusedDate(selectedDate ?? today);
        },
        [isOpen, selectedDate, today]
    );

    useEffect(
        function syncFocusedDateOnViewChange() {
            if (isKeyboardNavRef.current) {
                isKeyboardNavRef.current = false;
                return;
            }
            if (!focusedDate.isSame(viewDate, "month")) {
                setFocusedDate(getDefaultFocusedDate(viewDate, selectedDate));
            }
        },
        [viewDate, selectedDate, getDefaultFocusedDate, focusedDate]
    );

    useEffect(
        function moveFocusAfterNavigation() {
            if (!shouldMoveFocusRef.current) return;
            shouldMoveFocusRef.current = false;
            const dateKey = focusedDate.format("YYYY-MM-DD");
            const el = gridRef.current?.querySelector(
                `[data-date="${dateKey}"]`
            ) as HTMLButtonElement | null;
            el?.focus();
        },
        [focusedDate]
    );

    useEffect(
        function focusDefaultCellWhenOpen() {
            if (!isOpen) return;
            focusCalendarGridCell(gridRef, `[data-date="${focusedDate.format("YYYY-MM-DD")}"]`);
        },
        [isOpen, focusedDate]
    );

    const handleGridKeyDown = useCallback(
        function handleGridKeyDown(event: React.KeyboardEvent) {
            let next: Dayjs | null = null;

            switch (event.key) {
                case "ArrowLeft":
                    next = focusedDate.subtract(1, "day");
                    break;
                case "ArrowRight":
                    next = focusedDate.add(1, "day");
                    break;
                case "ArrowUp":
                    next = focusedDate.subtract(7, "day");
                    break;
                case "ArrowDown":
                    next = focusedDate.add(7, "day");
                    break;
                case "Enter":
                case " ":
                    if (!getIsDisabled(focusedDate)) {
                        handleDateClick(focusedDate);
                    }
                    event.preventDefault();
                    return;
                default:
                    return;
            }

            event.preventDefault();

            if (!next.isSame(viewDate, "month")) {
                isKeyboardNavRef.current = true;
                setViewDate(next);
            }
            shouldMoveFocusRef.current = true;
            setFocusedDate(next);
        },
        [focusedDate, viewDate, setViewDate, getIsDisabled, handleDateClick]
    );

    const calendarCells = useMemo(
        function getCalendarCells() {
            return calendarDays.map(function mapCalendarDay(date) {
                const dateKey = date.format("YYYY-MM-DD");
                return {
                    date,
                    key: `${dateKey}-${viewMonthKey}`,
                    dateKey,
                    label: date.format("D"),
                    isOutsideMonth: getIsOutsideMonth(date),
                    isSelected: getIsSelected(date),
                    isToday: getIsToday(date),
                    isDisabled: getIsDisabled(date),
                    isFocused: focusedDate.isSame(date, "day")
                };
            });
        },
        [
            calendarDays,
            viewMonthKey,
            getIsOutsideMonth,
            getIsSelected,
            getIsToday,
            getIsDisabled,
            focusedDate
        ]
    );

    return (
        <CalendarGrid
            id={`${id}-calendar-grid`}
            onKeyDown={handleGridKeyDown}
            ref={gridRef}
            role="grid"
        >
            <CalendarGridHeader>
                {weekdays.map((day) => (
                    <CalendarGridHeaderCell key={day}>{day}</CalendarGridHeaderCell>
                ))}
            </CalendarGridHeader>
            <CalendarGridBody>
                {calendarCells.map((cell) => (
                    <CalendarCell key={cell.key}>
                        <CalendarCellButton
                            aria-label={cell.date.format("dddd, MMMM D, YYYY")}
                            data-date={cell.dateKey}
                            data-outside-month={cell.isOutsideMonth ? "" : undefined}
                            data-selected={cell.isSelected ? "" : undefined}
                            data-today={cell.isToday ? "" : undefined}
                            isDisabled={cell.isDisabled}
                            isSelected={cell.isSelected}
                            onClick={function handleCellClick() {
                                handleDateClick(cell.date);
                            }}
                            onFocus={function handleCellFocus() {
                                setFocusedDate(cell.date);
                            }}
                            tabIndex={cell.isFocused ? 0 : -1}
                            type="button"
                        >
                            {cell.label}
                        </CalendarCellButton>
                    </CalendarCell>
                ))}
            </CalendarGridBody>
        </CalendarGrid>
    );
}

function MonthCalendarView() {
    const {
        id,
        viewDate,
        setViewDate,
        setCalendarView,
        value,
        setValue,
        size: ctxSize,
        isOpen
    } = useDatePickerContext();
    const inheritedSize = getInheritedButtonSize(ctxSize);
    const size = sizeMap[inheritedSize ?? "md"];

    const selectedMonth = value ? dayjs(value).month() : -1;
    const selectedYear = value ? dayjs(value).year() : -1;
    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();
    const viewYear = viewDate.year();

    const handleMonthClick = useCallback(
        function handleMonthClick(monthIndex: number) {
            const newViewDate = viewDate.month(monthIndex);
            setViewDate(newViewDate);
            if (value) {
                setValue(dayjs(value).year(viewDate.year()).month(monthIndex).toDate());
            }
            setCalendarView("day");
        },
        [viewDate, value, setViewDate, setValue, setCalendarView]
    );

    // --- Keyboard navigation ---
    const [focusedMonthIndex, setFocusedMonthIndex] = useState<number>(() =>
        selectedMonth >= 0 && selectedYear === viewYear ? selectedMonth : currentMonth
    );

    const gridRef = useRef<HTMLDivElement>(null);
    const shouldMoveFocusRef = useRef(false);

    useEffect(
        function moveFocusAfterNavigation() {
            if (!shouldMoveFocusRef.current) return;
            shouldMoveFocusRef.current = false;
            const el = gridRef.current?.querySelector(
                `[data-month-index="${focusedMonthIndex}"]`
            ) as HTMLButtonElement | null;
            el?.focus();
        },
        [focusedMonthIndex]
    );

    useEffect(
        function focusDefaultCellWhenOpen() {
            if (!isOpen) return;
            focusCalendarGridCell(gridRef, `[data-month-index="${focusedMonthIndex}"]`);
        },
        [isOpen, focusedMonthIndex]
    );

    const handleKeyDown = useCallback(
        function handleKeyDown(event: React.KeyboardEvent) {
            let next = focusedMonthIndex;

            switch (event.key) {
                case "ArrowLeft":
                    next = Math.max(0, focusedMonthIndex - 1);
                    break;
                case "ArrowRight":
                    next = Math.min(11, focusedMonthIndex + 1);
                    break;
                case "ArrowUp":
                    next = Math.max(0, focusedMonthIndex - 3);
                    break;
                case "ArrowDown":
                    next = Math.min(11, focusedMonthIndex + 3);
                    break;
                case "Enter":
                case " ":
                    handleMonthClick(focusedMonthIndex);
                    event.preventDefault();
                    return;
                default:
                    return;
            }

            event.preventDefault();
            if (next !== focusedMonthIndex) {
                shouldMoveFocusRef.current = true;
                setFocusedMonthIndex(next);
            }
        },
        [focusedMonthIndex, handleMonthClick]
    );

    return (
        <SelectionGrid
            id={`${id}-calendar-grid`}
            onKeyDown={handleKeyDown}
            ref={gridRef}
        >
            {MONTHS_SHORT.map(function renderMonth(month, index) {
                const isSelected = selectedMonth === index && selectedYear === viewYear;
                const isCurrentMonth = currentMonth === index && viewYear === currentYear;

                return (
                    <Button
                        data-month-index={index}
                        key={month}
                        onClick={function handleClick() {
                            handleMonthClick(index);
                        }}
                        onFocus={function handleFocus() {
                            setFocusedMonthIndex(index);
                        }}
                        size={size}
                        tabIndex={index === focusedMonthIndex ? 0 : -1}
                        type="button"
                        variant={isSelected ? "primary" : isCurrentMonth ? "outline" : "ghost"}
                    >
                        {month}
                    </Button>
                );
            })}
        </SelectionGrid>
    );
}

function YearCalendarView() {
    const {
        id,
        viewDate,
        setViewDate,
        setCalendarView,
        value,
        setValue,
        size: ctxSize,
        yearPageStart,
        setYearPageStart,
        isOpen
    } = useDatePickerContext();
    const inheritedSize = getInheritedButtonSize(ctxSize);
    const size = sizeMap[inheritedSize ?? "md"];

    const currentYear = dayjs().year();
    const selectedYear = value ? dayjs(value).year() : -1;

    const years = useMemo(
        function getYears() {
            return Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i);
        },
        [yearPageStart]
    );

    const handleYearClick = useCallback(
        function handleYearClick(year: number) {
            setViewDate(viewDate.year(year));
            if (value) {
                setValue(dayjs(value).year(year).toDate());
            }
            setCalendarView("month");
        },
        [viewDate, value, setViewDate, setValue, setCalendarView]
    );

    // --- Keyboard navigation ---
    const [focusedYear, setFocusedYear] = useState<number>(() =>
        selectedYear >= 0 ? selectedYear : viewDate.year()
    );

    const gridRef = useRef<HTMLDivElement>(null);
    const shouldMoveFocusRef = useRef(false);
    const isKeyboardNavRef = useRef(false);

    // When yearPageStart changes via header nav (not keyboard), reset focused year to page start
    useEffect(
        function syncFocusedYearOnPageChange() {
            if (isKeyboardNavRef.current) {
                isKeyboardNavRef.current = false;
                return;
            }
            if (focusedYear < yearPageStart || focusedYear >= yearPageStart + YEARS_PER_PAGE) {
                setFocusedYear(yearPageStart);
            }
        },
        [yearPageStart, focusedYear]
    );

    useEffect(
        function moveFocusAfterNavigation() {
            if (!shouldMoveFocusRef.current) return;
            shouldMoveFocusRef.current = false;
            const el = gridRef.current?.querySelector(
                `[data-year="${focusedYear}"]`
            ) as HTMLButtonElement | null;
            el?.focus();
        },
        [focusedYear]
    );

    useEffect(
        function focusDefaultCellWhenOpen() {
            if (!isOpen) return;
            focusCalendarGridCell(gridRef, `[data-year="${focusedYear}"]`);
        },
        [isOpen, focusedYear]
    );

    const handleKeyDown = useCallback(
        function handleKeyDown(event: React.KeyboardEvent) {
            let nextYear = focusedYear;

            switch (event.key) {
                case "ArrowLeft":
                    nextYear = focusedYear - 1;
                    break;
                case "ArrowRight":
                    nextYear = focusedYear + 1;
                    break;
                case "ArrowUp":
                    nextYear = focusedYear - 3;
                    break;
                case "ArrowDown":
                    nextYear = focusedYear + 3;
                    break;
                case "Enter":
                case " ":
                    handleYearClick(focusedYear);
                    event.preventDefault();
                    return;
                default:
                    return;
            }

            event.preventDefault();

            // Navigate to a different page if necessary
            if (nextYear < yearPageStart || nextYear >= yearPageStart + YEARS_PER_PAGE) {
                isKeyboardNavRef.current = true;
                setYearPageStart(Math.floor(nextYear / YEARS_PER_PAGE) * YEARS_PER_PAGE);
            }

            shouldMoveFocusRef.current = true;
            setFocusedYear(nextYear);
        },
        [focusedYear, yearPageStart, setYearPageStart, handleYearClick]
    );

    return (
        <SelectionGrid
            id={`${id}-calendar-grid`}
            onKeyDown={handleKeyDown}
            ref={gridRef}
        >
            {years.map(function renderYear(year) {
                const isSelected = selectedYear === year;
                const isCurrent = currentYear === year;

                return (
                    <Button
                        data-year={year}
                        key={year}
                        onClick={function handleClick() {
                            handleYearClick(year);
                        }}
                        onFocus={function handleFocus() {
                            setFocusedYear(year);
                        }}
                        size={size}
                        tabIndex={year === focusedYear ? 0 : -1}
                        type="button"
                        variant={isSelected ? "primary" : isCurrent ? "outline" : "ghost"}
                    >
                        {year}
                    </Button>
                );
            })}
        </SelectionGrid>
    );
}

export interface DatePickerCalendarProps extends BoxProps {}

/**
 * DatePicker Calendar — month grid and selection UI.
 */
export const Calendar = withContext(function DatePickerCalendar(props: DatePickerCalendarProps) {
    const { calendarView, hasFooter } = useDatePickerContext();

    return (
        <Box
            {...props}
            data-no-footer={dataAttr(!hasFooter)}
        >
            {calendarView === "day" && <DayCalendarView />}
            {calendarView === "month" && <MonthCalendarView />}
            {calendarView === "year" && <YearCalendarView />}
        </Box>
    );
}, "calendar");

export interface DatePickerCalendarHeaderProps extends Omit<FlexProps, "direction"> {}

/**
 * DatePicker CalendarHeader — header inside the calendar.
 */
export const CalendarHeader = withContext(function DatePickerCalendarHeader(
    props: DatePickerCalendarHeaderProps
) {
    return <Flex {...props} />;
}, "calendarHeader");

export interface DatePickerCalendarTitleProps extends BoxProps {}

/**
 * DatePicker CalendarTitle — current month/year label.
 */
export const CalendarTitle = withContext(function DatePickerCalendarTitle(
    props: DatePickerCalendarTitleProps
) {
    return <Box {...props} />;
}, "calendarTitle");

export interface DatePickerCalendarNavProps extends FlexProps {}

/**
 * DatePicker CalendarNav — previous/next navigation group.
 */
export const CalendarNav = withContext(function DatePickerCalendarNav(
    props: DatePickerCalendarNavProps
) {
    return <Flex {...props} />;
}, "calendarNav");

export interface DatePickerCalendarNavButtonProps extends IconButtonProps {}

const sizeMap = {
    sm: "xs",
    md: "sm",
    lg: "md"
} as const;

/**
 * DatePicker CalendarNavButton — previous or next period button.
 */
export const CalendarNavButton = withContext(function DatePickerCalendarNavButton(
    props: DatePickerCalendarNavButtonProps
) {
    const context = useDatePickerContext();
    const inheritedSize = getInheritedButtonSize(context.size);

    return (
        <IconButton
            size={sizeMap[inheritedSize ?? "md"]}
            variant="ghost"
            {...props}
        />
    );
}, "calendarNavButton");

export interface DatePickerCalendarGridProps extends BoxProps {}

/**
 * DatePicker CalendarGrid — day-of-week and date grid.
 */
export const CalendarGrid = withContext(function DatePickerCalendarGrid(
    props: DatePickerCalendarGridProps
) {
    return <Box {...props} />;
}, "calendarGrid");

export interface DatePickerCalendarGridHeaderProps extends BoxProps {}

/**
 * DatePicker CalendarGridHeader — weekday labels row.
 */
export const CalendarGridHeader = withContext(function DatePickerCalendarGridHeader(
    props: DatePickerCalendarGridHeaderProps
) {
    return <Box {...props} />;
}, "calendarGridHeader");

export interface DatePickerCalendarGridHeaderCellProps extends BoxProps {}

/**
 * DatePicker CalendarGridHeaderCell — a weekday label cell.
 */
export const CalendarGridHeaderCell = withContext(function DatePickerCalendarGridHeaderCell(
    props: DatePickerCalendarGridHeaderCellProps
) {
    return <Box {...props} />;
}, "calendarGridHeaderCell");

export interface DatePickerCalendarGridBodyProps extends BoxProps {}

/**
 * DatePicker CalendarGridBody — date cells container.
 */
export const CalendarGridBody = withContext(function DatePickerCalendarGridBody(
    props: DatePickerCalendarGridBodyProps
) {
    return <Box {...props} />;
}, "calendarGridBody");

/**
 * DatePicker SelectionGrid — year/month selection grid.
 */
export const SelectionGrid = withContext(function DatePickerSelectionGrid(props: BoxProps) {
    return <dreamy.div {...props} />;
}, "selectionGrid");

export interface DatePickerCalendarCellProps extends BoxProps {}

/**
 * DatePicker CalendarCell — wrapper for a calendar day.
 */
export const CalendarCell = withContext(function DatePickerCalendarCell(
    props: DatePickerCalendarCellProps
) {
    return <Box {...props} />;
}, "calendarCell");

export interface DatePickerCalendarCellButtonProps extends ButtonProps {
    isSelected?: boolean;
}

/**
 * DatePicker CalendarCellButton — selectable day button.
 */
export const CalendarCellButton = withContext(function DatePickerCalendarCellButton(
    props: DatePickerCalendarCellButtonProps
) {
    const { isSelected, isDisabled, disabled, children, ...rest } = props;
    const context = useDatePickerContext();
    const viewMonthKey = useMemo(
        function getViewMonthKey() {
            return context.viewDate.format("MM");
        },
        [context.viewDate]
    );
    return (
        <dreamy.button
            {...rest}
            disabled={disabled ?? isDisabled}
        >
            {isSelected && (
                <m.div
                    data-part="indicator"
                    initial={false}
                    layout={"position"}
                    layoutId={`${context.id}-date-picker-cell-button-indicator-${viewMonthKey}`}
                />
            )}
            {children}
        </dreamy.button>
    );
}, "calendarCellButton");

export interface DatePickerFooterProps extends Omit<FlexProps, "direction"> {
    cancelButtonProps?: DatePickerFooterButtonProps;
    submitButtonProps?: DatePickerFooterButtonProps;
}

/**
 * DatePicker Footer — actions below the calendar.
 */
export const Footer = withContext(function DatePickerFooter(props: DatePickerFooterProps) {
    const { cancelButtonProps, submitButtonProps, ...rest } = props;
    const context = useDatePickerContext();
    const setHasFooter = context.setHasFooter;

    useEffect(
        function registerFooter() {
            setHasFooter(true);
            return function unregisterFooter() {
                setHasFooter(false);
            };
        },
        [setHasFooter]
    );

    return (
        <Flex {...rest}>
            <FooterButton
                onClick={context.onCancel}
                variant="outline"
                {...cancelButtonProps}
            >
                {cancelButtonProps?.children ?? "Cancel"}
            </FooterButton>
            <FooterButton
                onClick={context.onApply}
                variant="primary"
                {...submitButtonProps}
            >
                {submitButtonProps?.children ?? "Apply"}
            </FooterButton>
        </Flex>
    );
}, "footer");

export interface DatePickerFooterButtonProps extends ButtonProps {}

/**
 * DatePicker FooterButton — footer action button.
 */
export const FooterButton = withContext(function DatePickerFooterButton(
    props: DatePickerFooterButtonProps
) {
    const context = useDatePickerContext();
    const inheritedSize = getInheritedButtonSize(context.size);
    return (
        <Button
            size={inheritedSize}
            {...props}
        />
    );
}, "footerButton");

export interface DatePickerAIOProps extends DatePickerRootProps {
    inputProps?: DatePickerInputProps;
    contentProps?: DatePickerContentProps;
    headerProps?: DatePickerHeaderProps;
    calendarProps?: DatePickerCalendarProps;
    footerProps?: DatePickerFooterProps;
}

/**
 * DatePicker AIO — all-in-one composed date picker.
 */
export function AIO(props: DatePickerAIOProps) {
    const { inputProps, contentProps, headerProps, calendarProps, footerProps, ...rootProps } =
        props;

    return (
        <Root {...rootProps}>
            <Input {...inputProps} />
            <Content {...contentProps}>
                <Header {...headerProps} />
                <Calendar {...calendarProps} />
                <Footer {...footerProps} />
            </Content>
        </Root>
    );
}
