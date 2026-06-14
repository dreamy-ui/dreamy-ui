"use client";

import { createContext, cx, dataAttr, useUpdateEffect } from "@dreamy-ui/react";
import { useControllableState } from "@dreamy-ui/react";
import dayjs, { type Dayjs } from "dayjs";
import * as m from "motion/react-m";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { LuCalendar } from "react-icons/lu";
import { createStyleContext, dreamy } from "styled-system/jsx";
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
    type InputProps,
    InputRightAddon
} from "./input";
import * as Popover from "./popover";

const { withProvider, withContext } = createStyleContext(datePicker, { forwardVariants: ["size"] });

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
            weekStartsOn = 1,
            children,
            ...rest
        } = props;
        const calendarSize = props.size;

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

        const handleOpen = useCallback(function handleOpen() {
            setIsOpen(true);
            setCalendarView("day");
        }, []);

        const contextValue = useMemo<DatePickerContextValue>(
            function createContextValue() {
                return {
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
                    onCancel: handleCancel
                };
            },
            [
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
                handleCancel
            ]
        );

        return (
            <DatePickerProvider value={contextValue}>
                <Popover.Root
                    isOpen={isOpen}
                    onClose={handleClose}
                    onOpen={handleOpen}
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
    "root",
    {}
);

export interface DatePickerTriggerProps extends ButtonProps {}

export const Trigger = withContext(
    forwardRef<HTMLButtonElement, DatePickerTriggerProps>(function DatePickerTrigger(props, ref) {
        const context = useDatePickerContext();
        const size = getInheritedButtonSize(context.size);

        return (
            <Popover.Trigger>
                <Button
                    ref={ref}
                    size={size}
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
        const formattedDate = useMemo(
            function formatDate() {
                return context.value ? dayjs(context.value).format(context.dateFormat) : "";
            },
            [context.value, context.dateFormat]
        );

        const size = getInheritedButtonSize(context.size);

        return (
            <Popover.Trigger>
                <InputGroup
                    ref={ref}
                    size={size}
                >
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

export interface DatePickerControlProps extends FlexProps {
    inputProps?: InputProps;
    todayButtonProps?: ButtonProps;
}

export const Control = withContext(
    forwardRef<HTMLDivElement, DatePickerControlProps>(function DatePickerControl(props, ref) {
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
            <Flex
                ref={ref}
                {...rest}
            >
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
    }),
    "control"
);

export interface DatePickerNavProps extends FlexProps {}

export const Nav = withContext(
    forwardRef<HTMLDivElement, DatePickerNavProps>(function DatePickerNav(props, ref) {
        const { calendarView, setCalendarView, size: ctxSize } = useDatePickerContext();
        const inheritedSize = getInheritedButtonSize(ctxSize);
        const size = sizeMap[inheritedSize ?? "md"];

        return (
            <Flex
                ref={ref}
                {...props}
            >
                {(["day", "month", "year"] as const).map(function renderNavItem(view) {
                    return (
                        <Button
                            flex={1}
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
    }),
    "nav"
);

export interface DatePickerHeaderProps extends FlexProps {
    previousButtonProps?: DatePickerCalendarNavButtonProps;
    nextButtonProps?: DatePickerCalendarNavButtonProps;
    titleProps?: DatePickerCalendarTitleProps;
}

export const Header = withContext(
    forwardRef<HTMLDivElement, DatePickerHeaderProps>(function DatePickerHeader(props, ref) {
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
            <CalendarHeader
                ref={ref}
                {...rest}
            >
                <CalendarNav>
                    <CalendarNavButton
                        aria-label={isYearView ? "Previous years" : "Previous month"}
                        onClick={handlePrevious}
                        type="button"
                        {...previousButtonProps}
                    >
                        <Icon as={BiChevronLeft} />
                    </CalendarNavButton>
                    <CalendarTitle {...titleProps}>{title}</CalendarTitle>
                    <CalendarNavButton
                        aria-label={isYearView ? "Next years" : "Next month"}
                        onClick={handleNext}
                        type="button"
                        {...nextButtonProps}
                    >
                        <Icon as={BiChevronRight} />
                    </CalendarNavButton>
                </CalendarNav>
            </CalendarHeader>
        );
    }),
    "calendarHeader"
);

function DayCalendarView() {
    const { value, setValue, viewDate, minDate, maxDate, weekStartsOn } = useDatePickerContext();

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

    const calendarCells = useMemo(
        function getCalendarCells() {
            return calendarDays.map(function mapCalendarDay(date) {
                return {
                    date,
                    key: `${date.format("YYYY-MM-DD")}-${viewMonthKey}`,
                    label: date.format("D"),
                    isOutsideMonth: getIsOutsideMonth(date),
                    isSelected: getIsSelected(date),
                    isToday: getIsToday(date),
                    isDisabled: getIsDisabled(date)
                };
            });
        },
        [calendarDays, viewMonthKey, getIsOutsideMonth, getIsSelected, getIsToday, getIsDisabled]
    );

    return (
        <CalendarGrid>
            <CalendarGridHeader>
                {weekdays.map((day) => (
                    <CalendarGridHeaderCell key={day}>{day}</CalendarGridHeaderCell>
                ))}
            </CalendarGridHeader>
            <CalendarGridBody>
                {calendarCells.map((cell) => (
                    <CalendarCell key={cell.key}>
                        <CalendarCellButton
                            data-outside-month={cell.isOutsideMonth ? "" : undefined}
                            data-selected={cell.isSelected ? "" : undefined}
                            data-today={cell.isToday ? "" : undefined}
                            isDisabled={cell.isDisabled}
                            isSelected={cell.isSelected}
                            onClick={function handleCellClick() {
                                handleDateClick(cell.date);
                            }}
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
        viewDate,
        setViewDate,
        setCalendarView,
        value,
        setValue,
        size: ctxSize
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

    return (
        <Box
            display="grid"
            gap={2}
            gridTemplateColumns="repeat(3, 1fr)"
        >
            {MONTHS_SHORT.map(function renderMonth(month, index) {
                const isSelected = selectedMonth === index && selectedYear === viewYear;
                const isCurrentMonth = currentMonth === index && viewYear === currentYear;

                return (
                    <Button
                        key={month}
                        onClick={function handleClick() {
                            handleMonthClick(index);
                        }}
                        size={size}
                        type="button"
                        variant={isSelected ? "primary" : isCurrentMonth ? "outline" : "ghost"}
                    >
                        {month}
                    </Button>
                );
            })}
        </Box>
    );
}

function YearCalendarView() {
    const {
        viewDate,
        setViewDate,
        setCalendarView,
        value,
        setValue,
        size: ctxSize,
        yearPageStart
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

    return (
        <Box
            display="grid"
            gap={2}
            gridTemplateColumns="repeat(3, 1fr)"
        >
            {years.map(function renderYear(year) {
                const isSelected = selectedYear === year;
                const isCurrent = currentYear === year;

                return (
                    <Button
                        key={year}
                        onClick={function handleClick() {
                            handleYearClick(year);
                        }}
                        size={size}
                        type="button"
                        variant={isSelected ? "primary" : isCurrent ? "outline" : "ghost"}
                    >
                        {year}
                    </Button>
                );
            })}
        </Box>
    );
}

export interface DatePickerCalendarProps extends BoxProps {}

export const Calendar = withContext(
    forwardRef<HTMLDivElement, DatePickerCalendarProps>(function DatePickerCalendar(props, ref) {
        const { calendarView, hasFooter } = useDatePickerContext();

        return (
            <Box
                ref={ref}
                {...props}
                data-no-footer={dataAttr(!hasFooter)}
            >
                {calendarView === "day" && <DayCalendarView />}
                {calendarView === "month" && <MonthCalendarView />}
                {calendarView === "year" && <YearCalendarView />}
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

const sizeMap = {
    sm: "xs",
    md: "sm",
    lg: "md"
} as const;

export const CalendarNavButton = withContext(
    forwardRef<HTMLButtonElement, DatePickerCalendarNavButtonProps>(
        function DatePickerCalendarNavButton(props, ref) {
            const context = useDatePickerContext();
            const inheritedSize = getInheritedButtonSize(context.size);

            return (
                <IconButton
                    ref={ref}
                    size={sizeMap[inheritedSize ?? "md"]}
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

export interface DatePickerCalendarCellButtonProps extends ButtonProps {
    isSelected?: boolean;
}

export const CalendarCellButton = withContext(
    forwardRef<HTMLButtonElement, DatePickerCalendarCellButtonProps>(
        function DatePickerCalendarCellButton(props, ref) {
            const context = useDatePickerContext();
            const viewMonthKey = useMemo(
                function getViewMonthKey() {
                    return context.viewDate.format("MM");
                },
                [context.viewDate]
            );
            return (
                <dreamy.button
                    ref={ref}
                    {...props}
                >
                    {props.isSelected && (
                        <m.div
                            data-part="indicator"
                            layout={"position"}
                            layoutId={`date-picker-cell-button-indicator-${viewMonthKey}`}
                        />
                    )}
                    {props.children}
                </dreamy.button>
            );
        }
    ),
    "calendarCellButton"
);

export interface DatePickerFooterProps extends FlexProps {
    cancelButtonProps?: DatePickerFooterButtonProps;
    submitButtonProps?: DatePickerFooterButtonProps;
}

export const Footer = withContext(
    forwardRef<HTMLDivElement, DatePickerFooterProps>(function DatePickerFooter(props, ref) {
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
            <Flex
                ref={ref}
                {...rest}
            >
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
    }),
    "footer"
);

export interface DatePickerFooterButtonProps extends ButtonProps {}

export const FooterButton = withContext(
    forwardRef<HTMLButtonElement, DatePickerFooterButtonProps>(
        function DatePickerFooterButton(props, ref) {
            const context = useDatePickerContext();
            const inheritedSize = getInheritedButtonSize(context.size);
            return (
                <Button
                    ref={ref}
                    size={inheritedSize}
                    {...props}
                />
            );
        }
    ),
    "footerButton"
);

export interface DatePickerAIOProps extends DatePickerRootProps {
    inputProps?: DatePickerInputProps;
    popoverContentProps?: DatePickerPopoverProps;
    headerProps?: DatePickerHeaderProps;
    calendarProps?: DatePickerCalendarProps;
    footerProps?: DatePickerFooterProps;
}

export const AIO = forwardRef<HTMLDivElement, DatePickerAIOProps>(
    function DatePickerAIO(props, ref) {
        const {
            inputProps,
            popoverContentProps,
            headerProps,
            calendarProps,
            footerProps,
            ...rootProps
        } = props;

        return (
            <Root
                ref={ref}
                {...rootProps}
            >
                <Input {...inputProps} />
                <PopoverContent {...popoverContentProps}>
                    <Header {...headerProps} />
                    <Calendar {...calendarProps} />
                    <Footer {...footerProps} />
                </PopoverContent>
            </Root>
        );
    }
);
