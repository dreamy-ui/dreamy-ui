"use client";

import { SliderProvider, type UseSliderProps, useSlider, useSliderContext } from "@dreamy-ui/react";

import { type HTMLDreamyProps, createStyleContext } from "styled-system/jsx";
import { slider } from "styled-system/recipes";
import { Box } from "../box";
import { VisuallyHiddenInput } from "../visually-hidden";

const { withProvider, withContext } = createStyleContext(slider);

export interface SliderProps
    extends UseSliderProps,
        Omit<HTMLDreamyProps<"div">, keyof UseSliderProps> {
    /**
     * The size of the slider
     * @default "md"
     */
    size?: "sm" | "md" | "lg";
    /**
     * If `true`, the thumb will be hidden
     * @default false
     */
    hideThumb?: boolean;
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
 * Slider component — select a single numeric value on a track.
 *
 * @see Docs https://dreamy-ui.com/docs/components/slider
 *
 * @example
 * ```tsx
 * <Slider.Root defaultValue={50}>
 *   <Slider.Track>
 *     <Slider.FilledTrack />
 *   </Slider.Track>
 *   <Slider.Thumb />
 * </Slider.Root>
 * ```
 */
export const Root = withProvider(function Component(props: SliderProps) {
    const {
        size = "md",
        orientation = "horizontal",
        hideThumb = false,
        focusThumbOnChange,
        ref,
        ...restProps
    } = props;
    const config = SIZE_CONFIG[size];
    const thumbSize = hideThumb ? 0 : config.thumbSize;
    const { getRootProps, getInputProps, ...rest } = useSlider({
        ...restProps,
        orientation,
        thumbSize,
        focusThumbOnChange: hideThumb ? false : focusThumbOnChange
    });

    const rootProps = getRootProps({ ref });

    return (
        <SliderProvider value={rest}>
            <VisuallyHiddenInput {...getInputProps({ ref })} />
            <Box
                {...rootProps}
                data-hide-thumb={hideThumb ? "" : undefined}
                style={
                    {
                        ...rootProps.style,
                        // @ts-expect-error
                        "--slider-thumb-size": `${thumbSize}px`,
                        ...(orientation === "horizontal"
                            ? { height: config.trackSize }
                            : { width: config.trackSize })
                    } as React.CSSProperties
                }
            />
        </SliderProvider>
    );
}, "root");

export interface SliderTrackProps extends HTMLDreamyProps<"div"> {}

/**
 * Slider Track — the full track behind the filled value.
 */
export const Track = withContext(function Component(props: SliderTrackProps) {
    const { getTrackProps } = useSliderContext();

    return <Box {...getTrackProps(props)} />;
}, "track");

export interface SliderFilledTrackProps extends HTMLDreamyProps<"div"> {}

/**
 * Slider Filled Track — the selected portion of the track.
 */
export const FilledTrack = withContext(function Component(props: SliderFilledTrackProps) {
    const { getInnerTrackProps } = useSliderContext();
    return <Box {...getInnerTrackProps(props)} />;
}, "trackFilled");

export interface SliderThumbProps extends HTMLDreamyProps<"div"> {}

/**
 * Slider Thumb — draggable handle for the current value.
 */
export const Thumb = withContext(function Component(props: SliderThumbProps) {
    const { getThumbProps } = useSliderContext();

    return <Box {...getThumbProps(props)} />;
}, "thumb");

export interface SliderMarkProps extends HTMLDreamyProps<"div"> {
    value: number;
}

/**
 * Slider Mark — label at a specific value on the track.
 */
export const Mark = withContext(function Component(props: SliderMarkProps) {
    const { getMarkerProps } = useSliderContext();

    return <Box {...getMarkerProps(props)} />;
}, "marker");
