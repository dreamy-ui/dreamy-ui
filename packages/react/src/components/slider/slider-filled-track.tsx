import { Box } from "@/components/box";
import { useSliderContext } from "@/components/slider/use-slider";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface SliderFilledTrackProps extends HTMLDreamProps<"div"> {}

export const SliderFilledTrackBase = forwardRef<HTMLDivElement, SliderFilledTrackProps>(
    (props, ref) => {
        const { getInnerTrackProps } = useSliderContext();
        return <Box ref={ref} {...getInnerTrackProps(props, ref)} />;
    }
);
