import { Slider } from "@/ui";
import { Text } from "@/ui";
import { useState } from "react";

export function MaxMinSlider() {
    const [value, setValue] = useState(0);

    return (
        <>
            <Text>Slider value: {value}</Text>

            <Slider.Root
                max={50}
                min={0}
                onChangeValue={setValue}
                step={10}
                value={value}
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
                onChangeValue={setValue}
                value={value}
            >
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        </>
    );
}
