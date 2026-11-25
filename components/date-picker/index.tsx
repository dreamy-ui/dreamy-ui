"use client";

import {
    CalendarIcon,
    type PositioningProps,
    useControllableState,
    useFieldContext,
    useUpdateEffect
} from "@dreamy-ui/react";
import { Calendar as UiSdkCalendar } from "@ui-sdk/react/calendar";
import dayjs, { type Dayjs } from "dayjs";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { createStyleContext, dreamy } from "styled-system/jsx";
import { type DatePickerVariantProps, datePicker } from "styled-system/recipes";
import { Box, type BoxProps } from "../box";
import { Button, type ButtonProps } from "../button";
import { Flex, type FlexProps } from "../flex";
import { IconButton, type IconButtonProps } from "../icon-button";
import {
    Input as InputComponent,
    type InputEndAddonProps,
    type InputGroupProps,
    type InputProps
} from "../input";
import * as Popover from "../popover";
import { isoDateToJsDate, jsDateToIsoDate } from "./date-adapters";
import {
    DatePickerUiProvider,
    type WeekStartsOn,
    useDatePickerUi
} from "./date-picker-ui-context";
import { UiSdkPickerCalendar, UiSdkPickerHeader } from "./ui-sdk-calendar";

const { withProvider, withContext } = createStyleContext(datePicker, { forwardVariants: ["size"] });

const DatePickerCalendarIcon = withContext(CalendarIcon, "calendarIcon");

type PopoverOpenChangeHandler = NonNullable<Popover.PopoverProps["onOpenChange"]>;

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
    if (!date) return "";
    return dayjs(date).format("YYYY-MM-DD");
}

function isDateWithinBounds(date: Dayjs, minDate?: Date, maxDate?: Date): boolean {
    if (minDate && date.isBefore(dayjs(minDate), "day")) return false;
    if (maxDate && date.isAfter(dayjs(maxDate), "day")) return false;
    return true;
}

export interface DatePickerRootProps
    extends Omit<BoxProps, "defaultValue" | "onChange" | "value">,
        DatePickerVariantProps {
    value?: Date | null;
    defaultValue?: Date | null;
    onValueChange?: (date: Date | null) => void;
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
    positioning?: PositioningProps;
    reduceMotion?: boolean;
}

function DatePickerRoot(props: DatePickerRootProps) {
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
        placeholder = "Select date",
        minDate,
        maxDate,
        weekStartsOn = 1,
        children,
        positioning,
        reduceMotion,
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

    const [value, setValue] = useControllableState<Date | null>({
        value: valueProp,
        defaultValue: defaultValue ?? null,
        onChange: onValueChange
    });

    const [hasFooter, setHasFooter] = useState(false);
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
    const open = openProp ?? uncontrolledOpen;

    const handleOpenChange = useCallback<PopoverOpenChangeHandler>(
        (nextOpen, details) => {
            if (openProp === undefined) {
                setUncontrolledOpen(nextOpen);
            }
            onOpenChange?.(nextOpen, details);
        },
        [onOpenChange, openProp]
    );

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

    const handleApply = useCallback(() => {
        onApply?.();
        closePopover();
    }, [closePopover, onApply]);

    const handleCancel = useCallback(() => {
        onCancel?.();
        closePopover();
    }, [closePopover, onCancel]);

    const uiValue = useMemo(
        () => ({
            id,
            value,
            setValue,
            dateFormat,
            placeholder,
            size,
            minDate,
            maxDate,
            weekStartsOn,
            disabled,
            readOnly,
            hasFooter,
            setHasFooter,
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
            hasFooter,
            id,
            maxDate,
            minDate,
            placeholder,
            readOnly,
            setValue,
            size,
            value,
            weekStartsOn
        ]
    );

    return (
        <DatePickerUiProvider value={uiValue}>
            <Popover.Root
                autoFocus
                onOpenChange={handleOpenChange}
                open={open}
                positioning={positioning}
                reduceMotion={reduceMotion}
            >
                <Box {...rest}>{children}</Box>
            </Popover.Root>
        </DatePickerUiProvider>
    );
}

/**
 * Date Picker component — calendar popover for selecting a single date.
 *
 * @see Docs https://dreamy-ui.com/docs/components/date-picker
 */
export const Root = withProvider(DatePickerRoot, "root", {});

export interface DatePickerTriggerProps extends ButtonProps {}

export const Trigger = withContext(function DatePickerTrigger(props: DatePickerTriggerProps) {
    const { size: ctxSize, disabled } = useDatePickerUi();
    const size = getInheritedButtonSize(ctxSize);

    return (
        <Popover.Trigger>
            <Button
                disabled={disabled}
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
        () => (ui.value ? dayjs(ui.value).format(ui.dateFormat) : ""),
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
                    cursor="pointer"
                    disabled={ui.disabled}
                    id={field?.id}
                    placeholder={ui.placeholder}
                    readOnly
                    type="text"
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

export interface DatePickerContentProps extends Popover.PopoverContentProps {}

export const Content: (props: DatePickerContentProps) => React.JSX.Element = withContext(
    function DatePickerContent(props: DatePickerContentProps) {
    const { onAnimationComplete, children, ...rest } = props;
    const ui = useDatePickerUi();
    const isoValue = useMemo(() => jsDateToIsoDate(ui.value), [ui.value]);
    const minIso = useMemo(() => jsDateToIsoDate(ui.minDate) ?? undefined, [ui.minDate]);
    const maxIso = useMemo(() => jsDateToIsoDate(ui.maxDate) ?? undefined, [ui.maxDate]);

    return (
        <Popover.Content
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
                mode="single"
                onValueChange={(next) => {
                    const nextDate = typeof next === "string" ? isoDateToJsDate(next) : null;
                    ui.setValue(nextDate);
                    if (!ui.hasFooter && nextDate) {
                        ui.closePopover();
                    }
                }}
                readOnly={ui.readOnly}
                value={isoValue}
                weekStartsOn={ui.weekStartsOn}
            >
                {children}
            </UiSdkCalendar>
        </Popover.Content>
    );
}, "popover", { forwardProps: ["container"] } as never) as (
    props: DatePickerContentProps
) => React.JSX.Element;

export interface DatePickerControlProps extends FlexProps {
    inputProps?: InputProps;
    todayButtonProps?: ButtonProps;
}

export const Control = withContext(function DatePickerControl(props: DatePickerControlProps) {
    const { inputProps, todayButtonProps, ...rest } = props;
    const context = useDatePickerUi();
    const minValue = useMemo(
        () => formatDateForInput(context.minDate ?? null),
        [context.minDate]
    );
    const maxValue = useMemo(
        () => formatDateForInput(context.maxDate ?? null),
        [context.maxDate]
    );

    const [inputValue, setInputValue] = useState(formatDateForInput(context.value));

    const applyInputValue = useCallback(
        (nextValue: string) => {
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

    useUpdateEffect(() => {
        setInputValue(formatDateForInput(context.value));
    }, [context.value]);

    const handleSetToday = useCallback(() => {
        const today = dayjs();
        if (!isDateWithinBounds(today, context.minDate, context.maxDate)) return;
        context.setValue(today.toDate());
    }, [context]);

    const isTodayDisabled = useMemo(
        () => !isDateWithinBounds(dayjs(), context.minDate, context.maxDate),
        [context.minDate, context.maxDate]
    );

    const size = getInheritedButtonSize(context.size);

    return (
        <Flex {...rest}>
            <InputComponent
                max={maxValue || undefined}
                min={minValue || undefined}
                onBlur={(event) => applyInputValue(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        applyInputValue(event.currentTarget.value);
                    }
                }}
                onValueChange={(next) => setInputValue(next)}
                size={size}
                type="date"
                value={inputValue}
                {...inputProps}
            />
            <Button
                disabled={isTodayDisabled}
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

export interface DatePickerHeaderProps extends Omit<FlexProps, "direction"> {
    previousButtonProps?: Partial<IconButtonProps>;
    nextButtonProps?: Partial<IconButtonProps>;
    titleProps?: BoxProps;
}

export const Header = withContext(function DatePickerHeader(props: DatePickerHeaderProps) {
    return <UiSdkPickerHeader {...props} />;
}, "calendarHeader");

export interface DatePickerCalendarProps extends BoxProps {}

export const Calendar = withContext(function DatePickerCalendar(props: DatePickerCalendarProps) {
    const ui = useDatePickerUi();

    return (
        <UiSdkPickerCalendar
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
export const SelectionGrid = withContext(dreamy.div, "selectionGrid");
export const CalendarCell = withContext(Box, "calendarCell");
export const CalendarCellButton = withContext(dreamy.button, "calendarCellButton");

export interface DatePickerFooterProps extends Omit<FlexProps, "direction"> {
    cancelButtonProps?: ButtonProps;
    submitButtonProps?: ButtonProps;
}

export const Footer = withContext(function DatePickerFooter(props: DatePickerFooterProps) {
    const { cancelButtonProps, submitButtonProps, ...rest } = props;
    const ui = useDatePickerUi();

    useEffect(() => {
        ui.setHasFooter(true);
        return () => {
            ui.setHasFooter(false);
        };
    }, [ui.setHasFooter]);

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
