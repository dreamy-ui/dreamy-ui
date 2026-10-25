"use client";

import {
    DatePicker as ArkDatePicker,
    useDatePickerContext as useArkDatePickerContext
} from "@ark-ui/react/date-picker";
import { ChevronLeftIcon, ChevronRightIcon, dataAttr } from "@dreamy-ui/react";
import type { DateValue } from "@internationalized/date";
import * as m from "motion/react-m";
import { useMemo } from "react";
import { dreamy } from "styled-system/jsx";
import { Box, type BoxProps } from "./box";
import { Button, type ButtonProps } from "./button";
import { Flex, type FlexProps } from "./flex";
import { Icon } from "./icon";
import { IconButton, type IconButtonProps } from "./icon-button";
import {
    type DatePickerUiContextValue,
    useDatePickerUi
} from "./date-picker-ui-context";

const sizeMap = {
    sm: "xs",
    md: "sm",
    lg: "md"
} as const;

function getInheritedButtonSize(
    size: DatePickerUiContextValue["size"]
): "sm" | "md" | "lg" | undefined {
    if (typeof size === "string") {
        return size as "sm" | "md" | "lg";
    }

    if (typeof size === "object" && size && "base" in size) {
        return (size.base as "sm" | "md" | "lg" | undefined) ?? undefined;
    }

    return undefined;
}

export interface ArkPickerHeaderProps extends Omit<FlexProps, "direction"> {
    previousButtonProps?: IconButtonProps;
    nextButtonProps?: IconButtonProps;
    titleProps?: BoxProps;
}

export function ArkPickerHeader(props: ArkPickerHeaderProps) {
    const { previousButtonProps, nextButtonProps, titleProps, ...rest } = props;
    const ark = useArkDatePickerContext();
    const isYearView = ark.view === "year";

    return (
        <Flex {...rest}>
            <Flex>
                <ArkDatePicker.PrevTrigger asChild>
                    <IconButton
                        aria-label={isYearView ? "Previous years" : "Previous month"}
                        size="sm"
                        type="button"
                        variant="ghost"
                        {...previousButtonProps}
                    >
                        <Icon as={ChevronLeftIcon} />
                    </IconButton>
                </ArkDatePicker.PrevTrigger>
                <ArkDatePicker.ViewTrigger asChild>
                    <Box {...titleProps}>
                        <ArkDatePicker.RangeText />
                    </Box>
                </ArkDatePicker.ViewTrigger>
                <ArkDatePicker.NextTrigger asChild>
                    <IconButton
                        aria-label={isYearView ? "Next years" : "Next month"}
                        size="sm"
                        type="button"
                        variant="ghost"
                        {...nextButtonProps}
                    >
                        <Icon as={ChevronRightIcon} />
                    </IconButton>
                </ArkDatePicker.NextTrigger>
            </Flex>
        </Flex>
    );
}

export interface ArkPickerNavProps extends FlexProps {}

export function ArkPickerNav(props: ArkPickerNavProps) {
    const ark = useArkDatePickerContext();
    const { size: ctxSize } = useDatePickerUi();
    const inheritedSize = getInheritedButtonSize(ctxSize);
    const size = sizeMap[inheritedSize ?? "md"];

    return (
        <Flex {...props}>
            {(["day", "month", "year"] as const).map(function renderNavItem(view) {
                return (
                    <Button
                        key={view}
                        onClick={function handleNavClick() {
                            ark.setView(view);
                        }}
                        size={size}
                        type="button"
                        variant={ark.view === view ? "solid" : "ghost"}
                    >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                    </Button>
                );
            })}
        </Flex>
    );
}

interface DayCellProps {
    value: DateValue;
}

function DayCell({ value }: DayCellProps) {
    const ui = useDatePickerUi();
    const ark = useArkDatePickerContext();
    const viewMonthKey = useMemo(
        function getViewMonthKey() {
            return String(ark.visibleRange.start.month);
        },
        [ark.visibleRange.start.month]
    );

    const isSelected = ark.value.some((selected) => selected.compare(value) === 0);

    return (
        <ArkDatePicker.TableCell value={value}>
            <ArkDatePicker.TableCellTrigger asChild>
                <dreamy.button type="button">
                    {isSelected ? (
                        <m.div
                            data-part="indicator"
                            initial={false}
                            layout="position"
                            layoutId={`${ui.id}-date-picker-cell-button-indicator-${viewMonthKey}`}
                        />
                    ) : null}
                    {value.day}
                </dreamy.button>
            </ArkDatePicker.TableCellTrigger>
        </ArkDatePicker.TableCell>
    );
}

interface GridCellProps {
    value: DateValue;
    label: string;
    variant: ButtonProps["variant"];
}

function GridCell({ value, label, variant }: GridCellProps) {
    const { size: ctxSize } = useDatePickerUi();
    const inheritedSize = getInheritedButtonSize(ctxSize);
    const size = sizeMap[inheritedSize ?? "md"];

    return (
        <ArkDatePicker.TableCell value={value}>
            <ArkDatePicker.TableCellTrigger asChild>
                <Button
                    size={size}
                    type="button"
                    variant={variant}
                >
                    {label}
                </Button>
            </ArkDatePicker.TableCellTrigger>
        </ArkDatePicker.TableCell>
    );
}

export interface ArkPickerCalendarProps extends BoxProps {
    gridId?: string;
}

export function ArkPickerCalendar(props: ArkPickerCalendarProps) {
    const { hasFooter } = useDatePickerUi();
    const { gridId, ...boxProps } = props;

    return (
        <Box
            {...boxProps}
            data-no-footer={dataAttr(!hasFooter)}
        >
            <ArkDatePicker.View view="day">
                <ArkDatePicker.Context>
                    {(api) => (
                        <ArkDatePicker.Table id={gridId}>
                            <ArkDatePicker.TableHead>
                                <ArkDatePicker.TableRow>
                                    {api.weekDays.map((weekDay) => (
                                        <ArkDatePicker.TableHeader key={weekDay.long}>
                                            {weekDay.short}
                                        </ArkDatePicker.TableHeader>
                                    ))}
                                </ArkDatePicker.TableRow>
                            </ArkDatePicker.TableHead>
                            <ArkDatePicker.TableBody>
                                {api.weeks.map((week, weekIndex) => (
                                    <ArkDatePicker.TableRow key={weekIndex}>
                                        {week.map((day) => (
                                            <DayCell
                                                key={day.toString()}
                                                value={day}
                                            />
                                        ))}
                                    </ArkDatePicker.TableRow>
                                ))}
                            </ArkDatePicker.TableBody>
                        </ArkDatePicker.Table>
                    )}
                </ArkDatePicker.Context>
            </ArkDatePicker.View>
            <ArkDatePicker.View view="month">
                <ArkDatePicker.Context>
                    {(api) => (
                        <dreamy.div>
                            <ArkDatePicker.Table>
                                <ArkDatePicker.TableBody>
                                    {api.getMonthsGrid({ columns: 3, format: "short" }).map(
                                        (months, rowIndex) => (
                                            <ArkDatePicker.TableRow key={rowIndex}>
                                                {months.map((month) => (
                                                    <GridCell
                                                        key={month.value.toString()}
                                                        label={month.label}
                                                        value={month.value}
                                                        variant={
                                                            api.value.some(
                                                                (v) =>
                                                                    v.month === month.value.month &&
                                                                    v.year === month.value.year
                                                            )
                                                                ? "primary"
                                                                : "ghost"
                                                        }
                                                    />
                                                ))}
                                            </ArkDatePicker.TableRow>
                                        )
                                    )}
                                </ArkDatePicker.TableBody>
                            </ArkDatePicker.Table>
                        </dreamy.div>
                    )}
                </ArkDatePicker.Context>
            </ArkDatePicker.View>
            <ArkDatePicker.View view="year">
                <ArkDatePicker.Context>
                    {(api) => (
                        <dreamy.div>
                            <ArkDatePicker.Table>
                                <ArkDatePicker.TableBody>
                                    {api.getYearsGrid({ columns: 3 }).map((years, rowIndex) => (
                                        <ArkDatePicker.TableRow key={rowIndex}>
                                            {years.map((year) => (
                                                <GridCell
                                                    key={year.value.toString()}
                                                    label={year.label}
                                                    value={year.value}
                                                    variant={
                                                        api.value.some(
                                                            (v) => v.year === year.value.year
                                                        )
                                                            ? "primary"
                                                            : "ghost"
                                                    }
                                                />
                                            ))}
                                        </ArkDatePicker.TableRow>
                                    ))}
                                </ArkDatePicker.TableBody>
                            </ArkDatePicker.Table>
                        </dreamy.div>
                    )}
                </ArkDatePicker.Context>
            </ArkDatePicker.View>
        </Box>
    );
}
