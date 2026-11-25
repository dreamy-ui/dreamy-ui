"use client";

import { ChevronLeftIcon, ChevronRightIcon, dataAttr } from "@dreamy-ui/react";
import {
    CalendarDay as UiSdkCalendarDay,
    type CalendarDayState,
    CalendarGrid as UiSdkCalendarGrid,
    CalendarHeading as UiSdkCalendarHeading,
    CalendarMonthSelect as UiSdkCalendarMonthSelect,
    CalendarNext as UiSdkCalendarNext,
    CalendarPrevious as UiSdkCalendarPrevious,
    CalendarWeekday as UiSdkCalendarWeekday,
    CalendarWeekdays as UiSdkCalendarWeekdays,
    CalendarWeeks as UiSdkCalendarWeeks,
    CalendarYearSelect as UiSdkCalendarYearSelect
} from "@ui-sdk/react/calendar";
import * as m from "motion/react-m";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { css, cx } from "styled-system/css";
import { type HTMLDreamyProps, splitCssProps } from "styled-system/jsx";
import { Box, type BoxProps } from "../box";
import { Flex, type FlexProps } from "../flex";
import { Icon } from "../icon";
import { IconButton, type IconButtonProps } from "../icon-button";
import { useDatePickerUi } from "./date-picker-ui-context";

type UiSdkSelectBaseProps = ComponentProps<typeof UiSdkCalendarMonthSelect>;

export interface PickerSelectProps
    extends Omit<HTMLDreamyProps<"select">, "value" | "defaultValue" | "children">,
        Pick<UiSdkSelectBaseProps, "children" | "render"> {}

export function UiSdkPickerMonthSelect(props: PickerSelectProps) {
    const { className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkCalendarMonthSelect
            {...(domProps as unknown as UiSdkSelectBaseProps)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        />
    );
}

export function UiSdkPickerYearSelect(props: PickerSelectProps) {
    const { className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkCalendarYearSelect
            {...(domProps as unknown as ComponentProps<typeof UiSdkCalendarYearSelect>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        />
    );
}

export interface UiSdkPickerHeaderProps extends Omit<FlexProps, "direction"> {
    previousButtonProps?: Partial<IconButtonProps>;
    nextButtonProps?: Partial<IconButtonProps>;
    titleProps?: BoxProps;
    showMonthSelect?: boolean;
    showYearSelect?: boolean;
    monthSelectProps?: PickerSelectProps;
    yearSelectProps?: PickerSelectProps;
    children?: ReactNode;
}

export function UiSdkPickerHeader(props: UiSdkPickerHeaderProps) {
    const {
        previousButtonProps,
        nextButtonProps,
        titleProps,
        showMonthSelect,
        showYearSelect,
        monthSelectProps,
        yearSelectProps,
        children,
        ...rest
    } = props;

    return (
        <Flex {...rest}>
            <Flex
                alignItems="center"
                justifyContent="space-between"
                w="full"
            >
                {children !== undefined ? (
                    children
                ) : (
                    <>
                        <UiSdkCalendarPrevious
                            aria-label="Previous month"
                            render={
                                <IconButton
                                    aria-label="Previous month"
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                    {...previousButtonProps}
                                />
                            }
                        >
                            <Icon as={ChevronLeftIcon} />
                        </UiSdkCalendarPrevious>
                        {showMonthSelect || showYearSelect ? (
                            <Flex
                                alignItems="center"
                                gap={1.5}
                            >
                                <UiSdkCalendarHeading
                                    render={
                                        <Box
                                            srOnly
                                            {...titleProps}
                                        />
                                    }
                                />
                                {showMonthSelect ? (
                                    <UiSdkPickerMonthSelect {...monthSelectProps} />
                                ) : null}
                                {showYearSelect ? (
                                    <UiSdkPickerYearSelect {...yearSelectProps} />
                                ) : null}
                            </Flex>
                        ) : (
                            <UiSdkCalendarHeading render={<Box {...titleProps} />} />
                        )}
                        <UiSdkCalendarNext
                            aria-label="Next month"
                            render={
                                <IconButton
                                    aria-label="Next month"
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                    {...nextButtonProps}
                                />
                            }
                        >
                            <Icon as={ChevronRightIcon} />
                        </UiSdkCalendarNext>
                    </>
                )}
            </Flex>
        </Flex>
    );
}

export interface UiSdkPickerCalendarProps extends BoxProps {
    gridId?: string;
    offset?: number;
    renderDay?: (state: CalendarDayState) => ReactNode;
    showSelectionIndicator?: boolean;
}

function CalendarMonthGrid({
    gridId,
    offset,
    indicatorId,
    renderDay,
    showSelectionIndicator
}: {
    gridId?: string;
    offset: number;
    indicatorId: string;
    renderDay?: (state: CalendarDayState) => ReactNode;
    showSelectionIndicator: boolean;
}) {
    return (
        <UiSdkCalendarGrid
            id={gridId}
            offset={offset}
        >
            <UiSdkCalendarWeekdays>
                {(index) => (
                    <UiSdkCalendarWeekday
                        index={index}
                        key={index}
                    />
                )}
            </UiSdkCalendarWeekdays>
            <UiSdkCalendarWeeks>
                {(cell) => (
                    <UiSdkCalendarDay
                        key={cell.date}
                        value={cell.date}
                    >
                        {(state) =>
                            renderDay ? (
                                renderDay(state)
                            ) : (
                                <>
                                    {showSelectionIndicator && state.selected ? (
                                        <m.div
                                            data-part="indicator"
                                            initial={false}
                                            layout="position"
                                            layoutId={indicatorId}
                                        />
                                    ) : null}
                                    {state.label}
                                </>
                            )
                        }
                    </UiSdkCalendarDay>
                )}
            </UiSdkCalendarWeeks>
        </UiSdkCalendarGrid>
    );
}

export function UiSdkPickerCalendar(props: UiSdkPickerCalendarProps) {
    const { id, hasFooter, months } = useDatePickerUi();
    const {
        gridId,
        offset,
        renderDay,
        showSelectionIndicator = true,
        ...boxProps
    } = props;

    const monthCount = Math.max(1, Math.floor(months ?? 1) || 1);
    const indicatorId = `${id}-date-picker-cell-button-indicator`;

    return (
        <Box
            {...boxProps}
            data-months={monthCount > 1 ? monthCount : undefined}
            data-no-footer={dataAttr(!hasFooter)}
        >
            {offset !== undefined ? (
                <CalendarMonthGrid
                    gridId={gridId}
                    indicatorId={indicatorId}
                    offset={offset}
                    renderDay={renderDay}
                    showSelectionIndicator={showSelectionIndicator}
                />
            ) : monthCount > 1 ? (
                <div
                    data-months={monthCount}
                    data-slot="calendar-grids"
                >
                    {Array.from({ length: monthCount }, (_, index) => (
                        <CalendarMonthGrid
                            gridId={index === 0 ? gridId : gridId ? `${gridId}-${index}` : undefined}
                            indicatorId={indicatorId}
                            key={index}
                            offset={index}
                            renderDay={renderDay}
                            showSelectionIndicator={showSelectionIndicator}
                        />
                    ))}
                </div>
            ) : (
                <CalendarMonthGrid
                    gridId={gridId}
                    indicatorId={indicatorId}
                    offset={0}
                    renderDay={renderDay}
                    showSelectionIndicator={showSelectionIndicator}
                />
            )}
        </Box>
    );
}
