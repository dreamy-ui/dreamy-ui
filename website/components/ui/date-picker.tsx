"use client";

import {
    DatePicker as ArkDatePicker,
    type DatePickerRootProps as ArkDatePickerRootProps,
    type OpenChangeDetails,
    type ValueChangeDetails
} from "@ark-ui/react/date-picker";
import {
    CalendarIcon,
    type PositioningProps,
    useControllableState,
    useFieldContext,
    useUpdateEffect
} from "@dreamy-ui/react";
import dayjs, { type Dayjs } from "dayjs";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createStyleContext, dreamy } from "styled-system/jsx";
import { type DatePickerVariantProps, datePicker } from "styled-system/recipes";
import { Box, type BoxProps } from "./box";
import { Button, type ButtonProps } from "./button";
import { Flex, type FlexProps } from "./flex";
import { IconButton } from "./icon-button";
import {
    Input as InputComponent,
    type InputEndAddonProps,
    type InputGroupProps,
    type InputProps
} from "./input";
import * as Popover from "./popover";
import { ArkPickerCalendar, ArkPickerHeader, ArkPickerNav } from "./ark-calendar";
import {
    arkValueToJsDate,
    calendarDateToJsDate,
    jsDateToArkMinMax,
    jsDateToArkValue
} from "./date-adapters";
import { DatePickerUiProvider, useDatePickerUi } from "./date-picker-ui-context";

const { withProvider, withContext } = createStyleContext(datePicker, { forwardVariants: ["size"] });

const DatePickerCalendarIcon = withContext(CalendarIcon, "calendarIcon");

type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function getInheritedButtonSize(
    size: DatePickerVariantProps["size"]
): "sm" | "md" | "lg" | undefined {
    if (typeof size === "string") {
        return size as "sm" | "md" | "lg";
    }

    if (typeof size === "object" && size && "base" in size) {
        return (size.base as "sm" | "md" | "lg" | undefined) ?? undefined;
    }

    return undefined;
}

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
    value?: Date | null;
    defaultValue?: Date | null;
    onChange?: (date: Date | null) => void;
    onApply?: () => void;
    onCancel?: () => void;
    dateFormat?: string;
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
    weekStartsOn?: WeekStartsOn;
    positioning?: PositioningProps;
    popoverProps?: Omit<Popover.PopoverProps, "positioning">;
}

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
        size,
        ...rest
    } = props;

    const id = useId();
    const gridRef = useRef<HTMLDivElement | null>(null);

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

    const [value, setValue] = useControllableState({
        value: valueProp,
        defaultValue: defaultValue ?? null,
        onChange
    });

    const [hasFooter, setHasFooter] = useState(false);
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
            return jsDateToArkValue(value);
        },
        [value]
    );

    const handleArkValueChange = useCallback(
        function handleArkValueChange(details: ValueChangeDetails) {
            setValue(arkValueToJsDate(details.value));
        },
        [setValue]
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
            setOpen(false);
            popoverProps?.onOpenChange?.({ open: false });
        },
        [onApply, popoverProps]
    );

    const handleCancel = useCallback(
        function handleCancel() {
            onCancel?.();
            setOpen(false);
            popoverProps?.onOpenChange?.({ open: false });
        },
        [onCancel, popoverProps]
    );

    const uiValue = useMemo(
        function createUiValue() {
            return {
                id,
                value,
                setValue,
                dateFormat,
                placeholder,
                size,
                minDate,
                maxDate,
                hasFooter,
                setHasFooter,
                onApply: handleApply,
                onCancel: handleCancel,
                focusCalendar
            };
        },
        [
            id,
            value,
            setValue,
            dateFormat,
            placeholder,
            size,
            minDate,
            maxDate,
            hasFooter,
            handleApply,
            handleCancel,
            focusCalendar
        ]
    );

    const arkRootProps: ArkDatePickerRootProps = {
        id,
        value: arkValue,
        onValueChange: handleArkValueChange,
        open,
        onOpenChange: handleOpenChange,
        openOnClick: false,
        closeOnSelect: !hasFooter,
        startOfWeek: weekStartsOn,
        min: jsDateToArkMinMax(minDate),
        max: jsDateToArkMinMax(maxDate),
        selectionMode: "single",
        format: function formatArkDate(date) {
            return dayjs(calendarDateToJsDate(date)).format(dateFormat);
        }
    };

    return (
        <ArkDatePicker.Root {...arkRootProps}>
            <DatePickerUiProvider value={uiValue}>
                <Popover.Root
                    autoFocus
                    open={open}
                    onOpenChange={(details) => {
                        setOpen(details.open);
                        popoverProps?.onOpenChange?.(details);
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
            </DatePickerUiProvider>
        </ArkDatePicker.Root>
    );
}

export const Root = withProvider(DatePickerRoot, "root", {});

export interface DatePickerTriggerProps extends ButtonProps {}

export const Trigger = withContext(function DatePickerTrigger(props: DatePickerTriggerProps) {
    const { size: ctxSize } = useDatePickerUi();
    const size = getInheritedButtonSize(ctxSize);

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
    inputGroupProps?: InputGroupProps;
    endAddonProps?: InputEndAddonProps;
}

export const Input = withContext(function DatePickerInput(props: DatePickerInputProps) {
    const { ref: _ref, inputGroupProps, endAddonProps, ...inputProps } = props;
    const ui = useDatePickerUi();
    const field = useFieldContext();
    const formattedDate = useMemo(
        function formatDate() {
            return ui.value ? dayjs(ui.value).format(ui.dateFormat) : "";
        },
        [ui.value, ui.dateFormat]
    );

    const size = getInheritedButtonSize(ui.size);
    const { children: endAddonChildren, ...restEndAddonProps } = endAddonProps ?? {};

    return (
        <InputComponent.Group
            size={size}
            {...inputGroupProps}
        >
            <Popover.Trigger>
                <InputComponent
                    aria-labelledby={field?.labelId}
                    id={field?.id}
                    placeholder={ui.placeholder}
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

export const Content = withContext(function DatePickerContent(props: DatePickerContentProps) {
    const { onAnimationComplete, children, ...rest } = props;
    const ui = useDatePickerUi();

    return (
        <Popover.Content
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

export interface DatePickerControlProps extends FlexProps {
    inputProps?: InputProps;
    todayButtonProps?: ButtonProps;
}

export const Control = withContext(function DatePickerControl(props: DatePickerControlProps) {
    const { inputProps, todayButtonProps, ...rest } = props;
    const context = useDatePickerUi();
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

export const Nav = withContext(function DatePickerNav(props: DatePickerNavProps) {
    return <ArkPickerNav {...props} />;
}, "nav");

export interface DatePickerHeaderProps extends Omit<FlexProps, "direction"> {
    previousButtonProps?: ButtonProps;
    nextButtonProps?: ButtonProps;
    titleProps?: BoxProps;
}

export const Header = withContext(function DatePickerHeader(props: DatePickerHeaderProps) {
    return <ArkPickerHeader {...props} />;
}, "calendarHeader");

export interface DatePickerCalendarProps extends BoxProps {}

export const Calendar = withContext(function DatePickerCalendar(props: DatePickerCalendarProps) {
    const ui = useDatePickerUi();

    return (
        <ArkPickerCalendar
            gridId={`${ui.id}-calendar-grid`}
            {...props}
        />
    );
}, "calendar");

export const CalendarHeader = withContext(Flex, "calendarHeader");
export const CalendarTitle = withContext(Box, "calendarTitle");
export const CalendarNav = withContext(Flex, "calendarNav");
export const CalendarNavButton = withContext(IconButton, "calendarNavButton");
export const CalendarGrid = withContext(Box, "calendarGrid");
export const CalendarGridHeader = withContext(Box, "calendarGridHeader");
export const CalendarGridHeaderCell = withContext(Box, "calendarGridHeaderCell");
export const CalendarGridBody = withContext(Box, "calendarGridBody");
export const SelectionGrid = withContext(function DatePickerSelectionGrid(props: BoxProps) {
    return <dreamy.div {...props} />;
}, "selectionGrid");
export const CalendarCell = withContext(Box, "calendarCell");
export const CalendarCellButton = withContext(dreamy.button, "calendarCellButton");

export interface DatePickerFooterProps extends Omit<FlexProps, "direction"> {
    cancelButtonProps?: ButtonProps;
    submitButtonProps?: ButtonProps;
}

export const Footer = withContext(function DatePickerFooter(props: DatePickerFooterProps) {
    const { cancelButtonProps, submitButtonProps, ...rest } = props;
    const ui = useDatePickerUi();

    useEffect(
        function registerFooter() {
            ui.setHasFooter(true);
            return function unregisterFooter() {
                ui.setHasFooter(false);
            };
        },
        [ui.setHasFooter]
    );

    const inheritedSize = getInheritedButtonSize(ui.size);

    return (
        <Flex {...rest}>
            <Button
                onClick={ui.onCancel}
                size={inheritedSize}
                variant="outline"
                {...cancelButtonProps}
            >
                {cancelButtonProps?.children ?? "Cancel"}
            </Button>
            <Button
                onClick={ui.onApply}
                size={inheritedSize}
                variant="primary"
                {...submitButtonProps}
            >
                {submitButtonProps?.children ?? "Apply"}
            </Button>
        </Flex>
    );
}, "footer");

export const FooterButton = withContext(Button, "footerButton");

export interface DatePickerAIOProps extends DatePickerRootProps {
    inputProps?: DatePickerInputProps;
    contentProps?: DatePickerContentProps;
    headerProps?: DatePickerHeaderProps;
    calendarProps?: DatePickerCalendarProps;
    footerProps?: DatePickerFooterProps;
}

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
