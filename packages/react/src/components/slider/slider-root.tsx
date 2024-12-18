import { Box } from "@/components/box";
import { SliderProvider, type UseSliderProps, useSlider } from "@/components/slider/use-slider";
import { forwardRef } from "react";
import { VisuallyHiddenInput } from "../visually-hidden";

export interface SliderProps extends UseSliderProps {}

export const SliderRoot = forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
    const { getRootProps, getInputProps, ...rest } = useSlider(props);

    return (
        <SliderProvider value={rest}>
            <VisuallyHiddenInput {...(getInputProps(undefined, ref) as any)} />
            <Box {...(getRootProps(undefined, ref) as any)} />
        </SliderProvider>
    );
});
