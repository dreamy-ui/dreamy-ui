"use client";

import { SliderProvider, type UseSliderProps, useSlider, useSliderContext } from "@dreamy-ui/react";
import { forwardRef } from "react";
import { createStyleContext } from "styled-system/jsx";
import { slider } from "styled-system/recipes";
import { Box } from "./box";
import type { HTMLDreamyProps } from "./factory";
import { VisuallyHiddenInput } from "./visually-hidden";

const { withProvider, withContext } = createStyleContext(slider);

export interface SliderProps
    extends UseSliderProps,
        Omit<HTMLDreamyProps<"div">, keyof UseSliderProps> {}

/**
 * Slider component
 *
 * @See Docs https://dreamy-ui.com/docs/components/slider
 */
const SliderRoot = withProvider(
    forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
        const { getRootProps, getInputProps, ...rest } = useSlider(props);

        return (
            <SliderProvider value={rest}>
                <VisuallyHiddenInput {...(getInputProps(undefined, ref) as any)} />
                <Box {...(getRootProps(undefined, ref) as any)} />
            </SliderProvider>
        );
    }),
    "root"
);

export interface SliderTrackProps extends HTMLDreamyProps<"div"> {}

const SliderTrack = withContext(
    forwardRef<HTMLDivElement, SliderTrackProps>((props, ref) => {
        const { getTrackProps } = useSliderContext();

        return <Box {...getTrackProps(props, ref)} />;
    }),
    "track"
);

export interface SliderFilledTrackProps extends HTMLDreamyProps<"div"> {}

const SliderFilledTrack = withContext(
    forwardRef<HTMLDivElement, SliderFilledTrackProps>((props, ref) => {
        const { getInnerTrackProps } = useSliderContext();
        return (
            <Box
                ref={ref}
                {...getInnerTrackProps(props, ref)}
            />
        );
    }),
    "trackFilled"
);

export interface SliderThumbProps extends HTMLDreamyProps<"div"> {}

const SliderThumb = withContext(
    forwardRef<HTMLDivElement, SliderThumbProps>((props, ref) => {
        const { getThumbProps } = useSliderContext();

        return <Box {...getThumbProps(props, ref)} />;
    }),
    "thumb"
);

export interface SliderMarkProps extends HTMLDreamyProps<"div"> {
    value: number;
}

const SliderMark = withContext(
    forwardRef<HTMLDivElement, SliderMarkProps>((props, ref) => {
        const { getMarkerProps } = useSliderContext();

        return <Box {...getMarkerProps(props, ref)} />;
    }),
    "marker"
);

export namespace Slider {
    export const Root = SliderRoot;
    export const Track = SliderTrack;
    export const FilledTrack = SliderFilledTrack;
    export const Thumb = SliderThumb;
    export const Mark = SliderMark;
}
