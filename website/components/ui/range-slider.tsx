"use client";

import { RangeSliderProvider, type UseRangeSliderProps, useRangeSlider, useRangeSliderContext } from "@dreamy-ui/react";
import { forwardRef } from "react";
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

// Map size variants to thumb sizes and track dimensions
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
const RangeSliderRoot = withProvider(
	forwardRef<HTMLDivElement, RangeSliderProps>((props, ref) => {
		const { size = "md", orientation = "horizontal", focusThumbOnChange, ...restProps } = props;
		const config = SIZE_CONFIG[size];
		const { getRootProps, getInputProps, ...rest } = useRangeSlider({
			...restProps,
			orientation,
			thumbSize: config.thumbSize,
			focusThumbOnChange
		});

		const rootProps = getRootProps(undefined, ref) as any;

		return (
			<RangeSliderProvider value={rest}>
				<VisuallyHiddenInput {...(getInputProps(0)(undefined, ref) as any)} />
				<VisuallyHiddenInput {...(getInputProps(1)(undefined, ref) as any)} />
				<Box
					{...rootProps}
					style={{
						...rootProps.style,
						"--range-slider-thumb-size": `${config.thumbSize}px`,
						...(orientation === "horizontal"
							? { height: config.trackSize }
							: { width: config.trackSize }
						)
					} as React.CSSProperties}
				/>
			</RangeSliderProvider>
		);
	}),
	"root"
);

export interface RangeSliderTrackProps extends HTMLDreamyProps<"div"> { }

const RangeSliderTrack = withContext(
	forwardRef<HTMLDivElement, RangeSliderTrackProps>((props, ref) => {
		const { getTrackProps } = useRangeSliderContext();

		return <Box {...getTrackProps(props, ref)} />;
	}),
	"track"
);

export interface RangeSliderFilledTrackProps extends HTMLDreamyProps<"div"> { }

const RangeSliderFilledTrack = withContext(
	forwardRef<HTMLDivElement, RangeSliderFilledTrackProps>((props, ref) => {
		const { getInnerTrackProps } = useRangeSliderContext();
		return (
			<Box
				ref={ref}
				{...getInnerTrackProps(props, ref)}
			/>
		);
	}),
	"trackFilled"
);

export interface RangeSliderThumbProps extends HTMLDreamyProps<"div"> {
	/**
	 * The index of the thumb (0 or 1)
	 */
	index: 0 | 1;
}

const RangeSliderThumb = withContext(
	forwardRef<HTMLDivElement, RangeSliderThumbProps>((props, ref) => {
		const { index, ...rest } = props;
		const { getThumbProps } = useRangeSliderContext();

		return <Box {...getThumbProps(index)(rest, ref)} />;
	}),
	"thumb"
);

export interface RangeSliderMarkProps extends HTMLDreamyProps<"div"> {
	value: number;
}

const RangeSliderMark = withContext(
	forwardRef<HTMLDivElement, RangeSliderMarkProps>((props, ref) => {
		const { getMarkerProps } = useRangeSliderContext();

		return <Box {...getMarkerProps(props, ref)} />;
	}),
	"marker"
);

export namespace RangeSlider {
	export const Root = RangeSliderRoot;
	export const Track = RangeSliderTrack;
	export const FilledTrack = RangeSliderFilledTrack;
	export const Thumb = RangeSliderThumb;
	export const Mark = RangeSliderMark;
}
