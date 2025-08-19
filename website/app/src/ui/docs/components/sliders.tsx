import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@/slider";
import { Text } from "@/text";
import { useState } from "react";

export function MaxMinSlider() {
    const [value, setValue] = useState(0);

    return (
        <>
            <Text>Slider value: {value}</Text>

            <Slider
                min={0}
                max={50}
                step={10}
                value={value}
                onChangeValue={setValue}
            >
                <SliderTrack maxW="xs">
                    <SliderFilledTrack />
                    <SliderThumb />
                </SliderTrack>
            </Slider>
        </>
    );
}

export function ControlledSlider() {
    const [value, setValue] = useState(0);

    return (
        <>
            <Text>Slider value: {value}</Text>

            <Slider
                value={value}
                onChangeValue={setValue}
            >
                <SliderTrack maxW="xs">
                    <SliderFilledTrack />
                    <SliderThumb />
                </SliderTrack>
            </Slider>
        </>
    );
}
