import { Slider } from "@/slider";
import { Text } from "@/text";
import { useState } from "react";

export function MaxMinSlider() {
    const [value, setValue] = useState(0);

    return (
        <>
            <Text>Slider value: {value}</Text>

            <Slider.Root
                min={0}
                max={50}
                step={10}
                value={value}
                onChangeValue={setValue}
            >
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        </>
    );
}

export function ControlledSlider() {
    const [value, setValue] = useState(0);

    return (
        <>
            <Text>Slider value: {value}</Text>

            <Slider.Root
                value={value}
                onChangeValue={setValue}
            >
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        </>
    );
}
