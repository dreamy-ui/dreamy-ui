"use client";

import {
    RangeSliderProvider,
    type UseRangeSliderProps,
    useRangeSlider,
    useRangeSliderContext
} from "@dreamy-ui/react";

import { type HTMLDreamyProps, createStyleContext } from "styled-system/jsx";
import { rangeSlider } from "styled-system/recipes";
import { Box } from "./box";
import { VisuallyHiddenInput } from "./visually-hidden";

const { withProvider, withContext } = createStyleContext(rangeSlider);

export interface RangeSliderProps
    extends UseRangeSliderProps,
        Omit<HTMLDreamyProps<"div">, keyof UseRangeSliderProps> {
    /**
     * The size of the slider
     * @default "md"
     */
    size?: "sm" | "md" | "lg";
}

const SIZE_CONFIG = {
    sm: {
        thumbSize: 20,
        trackSize: "8px"
    },
    md: {
        thumbSize: 22,
        trackSize: "16px"
    },
    lg: {
        thumbSize: 24,
        trackSize: "24px"
    }
} as const;

/**
 * RangeSlider component
 *
 * @See Docs https://dreamy-ui.com/docs/components/range-slider
 */
export const Root = withProvider(function Component(props: RangeSliderProps) {
    const { ref } = props;
    const { size = "md", orientation = "horizontal", focusThumbOnChange, ...restProps } = props;
    const config = SIZE_CONFIG[size];
    const { getRootProps, getInputProps, ...rest } = useRangeSlider({
        ...restProps,
        orientation,
        thumbSize: config.thumbSize,
        focusThumbOnChange
    });

    const rootProps = getRootProps({ ref });

    return (
        <RangeSliderProvider value={rest}>
            <VisuallyHiddenInput {...getInputProps(0)({ ref })} />
            <VisuallyHiddenInput {...getInputProps(1)({ ref })} />
            <Box
                {...rootProps}
                style={
                    {
                        ...rootProps.style,
                        // @ts-expect-error
                        "--range-slider-thumb-size": `${config.thumbSize}px`,
                        ...(orientation === "horizontal"
                            ? { height: config.trackSize }
                            : { width: config.trackSize })
                    } as React.CSSProperties
                }
            />
        </RangeSliderProvider>
    );
}, "root");

export interface RangeSliderTrackProps extends HTMLDreamyProps<"div"> {}

export const Track = withContext(function Component(props: RangeSliderTrackProps) {
    const { getTrackProps } = useRangeSliderContext();

    return <Box {...getTrackProps(props)} />;
}, "track");

export interface RangeSliderFilledTrackProps extends HTMLDreamyProps<"div"> {}

export const FilledTrack = withContext(function Component(props: RangeSliderFilledTrackProps) {
    const { getInnerTrackProps } = useRangeSliderContext();
    return <Box {...getInnerTrackProps(props)} />;
}, "trackFilled");

export interface RangeSliderThumbProps extends HTMLDreamyProps<"div"> {
    /**
     * The index of the thumb (0 or 1)
     */
    index: 0 | 1;
}

export const Thumb = withContext(function Component(props: RangeSliderThumbProps) {
    const { index, ...rest } = props;
    const { getThumbProps } = useRangeSliderContext();

    return <Box {...getThumbProps(index)(rest)} />;
}, "thumb");

export interface RangeSliderMarkProps extends HTMLDreamyProps<"div"> {
    value: number;
}

export const Mark = withContext(function Component(props: RangeSliderMarkProps) {
    const { getMarkerProps } = useRangeSliderContext();

    return <Box {...getMarkerProps(props)} />;
}, "marker");
