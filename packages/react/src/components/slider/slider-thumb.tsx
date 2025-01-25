import { Box } from "@/components/box/box";
import { useSliderContext } from "@/components/slider/use-slider";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface SliderThumbProps extends HTMLDreamProps<"div"> {}

/**
 * Slider component that acts as the handle used to select predefined
 * values by dragging its handle along the track
 */
export const SliderThumbBase = forwardRef<HTMLDivElement, SliderThumbProps>(
	(props, ref) => {
		const { getThumbProps } = useSliderContext();

		return <Box {...getThumbProps(props, ref)} />;
	}
);
