"use client";

import { ChevronLeftIcon, ChevronRightIcon, dataAttr } from "@dreamy-ui/react";
import {
    CalendarDay as UiSdkCalendarDay,
    CalendarGrid as UiSdkCalendarGrid,
    CalendarHeading as UiSdkCalendarHeading,
    CalendarNext as UiSdkCalendarNext,
    CalendarPrevious as UiSdkCalendarPrevious,
    CalendarWeekday as UiSdkCalendarWeekday,
    CalendarWeekdays as UiSdkCalendarWeekdays,
    CalendarWeeks as UiSdkCalendarWeeks
} from "@ui-sdk/react/calendar";
import * as m from "motion/react-m";
import { Box, type BoxProps } from "./box";
import { Flex, type FlexProps } from "./flex";
import { Icon } from "./icon";
import { IconButton, type IconButtonProps } from "./icon-button";
import { useDatePickerUi } from "./date-picker-ui-context";

export interface UiSdkPickerHeaderProps extends Omit<FlexProps, "direction"> {
    previousButtonProps?: Partial<IconButtonProps>;
    nextButtonProps?: Partial<IconButtonProps>;
    titleProps?: BoxProps;
}

export function UiSdkPickerHeader(props: UiSdkPickerHeaderProps) {
    const { previousButtonProps, nextButtonProps, titleProps, ...rest } = props;

    return (
        <Flex {...rest}>
            <Flex
                alignItems="center"
                justifyContent="space-between"
                w="full"
            >
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
                <UiSdkCalendarHeading render={<Box {...titleProps} />} />
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
            </Flex>
        </Flex>
    );
}

export interface UiSdkPickerCalendarProps extends BoxProps {
    gridId?: string;
}

export function UiSdkPickerCalendar(props: UiSdkPickerCalendarProps) {
    const { id, hasFooter } = useDatePickerUi();
    const { gridId, ...boxProps } = props;

    return (
        <Box
            {...boxProps}
            data-no-footer={dataAttr(!hasFooter)}
        >
            <UiSdkCalendarGrid id={gridId}>
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
                            {(state) => (
                                <>
                                    {state.selected ? (
                                        <m.div
                                            data-part="indicator"
                                            initial={false}
                                            layout="position"
                                            layoutId={`${id}-date-picker-cell-button-indicator`}
                                        />
                                    ) : null}
                                    {state.label}
                                </>
                            )}
                        </UiSdkCalendarDay>
                    )}
                </UiSdkCalendarWeeks>
            </UiSdkCalendarGrid>
        </Box>
    );
}
