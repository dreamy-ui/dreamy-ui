import { SliderProvider, type UseSliderProps, useSlider, useSliderContext } from "@dreamy-ui/react";
import { forwardRef } from "react";
import { slider } from "styled-system/recipes";
import { Box } from "./box";
import type { HTMLDreamyProps } from "./factory";
import { createStyleContext } from "./style-context";
import { VisuallyHiddenInput } from "./visually-hidden";

const { withProvider, withContext } = createStyleContext(slider);

export interface SliderProps extends UseSliderProps {}

/**
 * Slider component
 *
 * @See Docs https://dreamy-ui.com/docs/components/slider
 */
export const Slider = withProvider(
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

export const SliderTrack = withContext(
    forwardRef<HTMLDivElement, SliderTrackProps>((props, ref) => {
        const { getTrackProps } = useSliderContext();

        return <Box {...getTrackProps(props, ref)} />;
    }),
    "track"
);

export interface SliderFilledTrackProps extends HTMLDreamyProps<"div"> {}

export const SliderFilledTrack = withContext(
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

export const SliderThumb = withContext(
    forwardRef<HTMLDivElement, SliderThumbProps>((props, ref) => {
        const { getThumbProps } = useSliderContext();

        return <Box {...getThumbProps(props, ref)} />;
    }),
    "thumb"
);

export interface SliderMarkProps extends HTMLDreamyProps<"div"> {
    value: number;
}

export const SliderMark = withContext(
    forwardRef<HTMLDivElement, SliderMarkProps>((props, ref) => {
        const { getMarkerProps } = useSliderContext();

        return <Box {...getMarkerProps(props, ref)} />;
    }),
    "marker"
);
