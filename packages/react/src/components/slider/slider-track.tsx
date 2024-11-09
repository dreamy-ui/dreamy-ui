import { Box } from "@/components/box";
import { useSliderContext } from "@/components/slider/use-slider";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface SliderTrackProps extends HTMLDreamProps<"div"> { }

export const SliderTrackBase = forwardRef<HTMLDivElement, SliderTrackProps>(
    (props, ref) => {
        const { getTrackProps } = useSliderContext();

        return (
            <Box {...getTrackProps(props, ref)} />
        );
    }
);
