import { Box } from "@/components/box";
import { useSliderContext } from "@/components/slider/use-slider";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface SliderMarkProps extends HTMLDreamProps<"div"> {
    value: number;
}

export const SliderMarkBase = forwardRef<HTMLDivElement, SliderMarkProps>((props, ref) => {
    const { getMarkerProps } = useSliderContext();

    return <Box {...getMarkerProps(props, ref)} />;
});
