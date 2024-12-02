import { Box } from "@/components/box";
import { SliderProvider, type UseSliderProps, useSlider } from "@/components/slider/use-slider";
import { forwardRef } from "react";

export interface SliderProps extends UseSliderProps {}

export const SliderRoot = forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
    const { getRootProps, ...rest } = useSlider(props);

    return (
        <SliderProvider value={rest}>
            <Box {...(getRootProps(undefined, ref) as any)} />
        </SliderProvider>
    );
});
