"use client";

import { SliderProvider, type UseSliderProps, useSlider, useSliderContext } from "@dreamy-ui/react";
import { forwardRef } from "react";
import { type HTMLDreamyProps, createStyleContext } from "styled-system/jsx";
import { slider } from "styled-system/recipes";
import { Box } from "./box";
import { VisuallyHiddenInput } from "./visually-hidden";

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
 * Slider component
 *
 * @See Docs https://dreamy-ui.com/docs/components/slider
 */
const SliderRoot = withProvider(
    forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
        const { size = "md", orientation = "horizontal", hideThumb = false, focusThumbOnChange, ...restProps } = props;
        const config = SIZE_CONFIG[size];
        const thumbSize = hideThumb ? 0 : config.thumbSize;
        const { getRootProps, getInputProps, ...rest } = useSlider({
            ...restProps,
            orientation,
            thumbSize,
            focusThumbOnChange: hideThumb ? false : focusThumbOnChange
        });

        const rootProps = getRootProps(undefined, ref) as any;

        return (
            <SliderProvider value={rest}>
                <VisuallyHiddenInput {...(getInputProps(undefined, ref) as any)} />
                <Box
                    {...rootProps}
                    data-hide-thumb={hideThumb ? "" : undefined}
                    style={{
                        ...rootProps.style,
                        "--slider-thumb-size": `${thumbSize}px`,
                        ...(orientation === "horizontal"
                            ? { height: config.trackSize }
                            : { width: config.trackSize }
                        )
                    } as React.CSSProperties}
                />
            </SliderProvider>
        );
    }),
    "root"
);

export interface SliderTrackProps extends HTMLDreamyProps<"div"> { }

const SliderTrack = withContext(
    forwardRef<HTMLDivElement, SliderTrackProps>((props, ref) => {
        const { getTrackProps } = useSliderContext();

        return <Box {...getTrackProps(props, ref)} />;
    }),
    "track"
);

export interface SliderFilledTrackProps extends HTMLDreamyProps<"div"> { }

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

export interface SliderThumbProps extends HTMLDreamyProps<"div"> { }

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
