import { RangeSlider, Text, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Range Slider"
} satisfies Meta;

export function Base() {
    return (
        <RangeSlider.Root>
            <RangeSlider.Track maxW="xs">
                <RangeSlider.FilledTrack />
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Track>
        </RangeSlider.Root>
    );
}

export function MaxMinStep() {
    const [value, setValue] = useState<[number, number]>([0, 25]);

    return (
        <>
            <Text>
                Range: {value[0]} - {value[1]}
            </Text>

            <RangeSlider.Root
                max={50}
                min={0}
                onChangeValue={setValue}
                step={5}
                value={value}
            >
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        </>
    );
}

export function Size() {
    return (
        <VStack
            gap={10}
            w="full"
        >
            <RangeSlider.Root size="sm">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root size="md">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root size="lg">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        </VStack>
    );
}

export function Scheme() {
    return (
        <VStack
            gap={10}
            w="full"
        >
            <RangeSlider.Root scheme="primary">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root scheme="secondary">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root scheme="info">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root scheme="success">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root scheme="warning">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root scheme="error">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        </VStack>
    );
}

export function Orientation() {
    return (
        <RangeSlider.Root
            h="200px"
            orientation="vertical"
        >
            <RangeSlider.Track maxW="xs">
                <RangeSlider.FilledTrack />
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Track>
        </RangeSlider.Root>
    );
}

export function Reversed() {
    return (
        <RangeSlider.Root isReversed>
            <RangeSlider.Track maxW="xs">
                <RangeSlider.FilledTrack />
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Track>
        </RangeSlider.Root>
    );
}

export function CustomThumbSize() {
    return (
        <VStack
            gap={10}
            w="full"
        >
            <RangeSlider.Root thumbSize={16}>
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root thumbSize={32}>
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root
                scheme="info"
                thumbSize={48}
            >
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        </VStack>
    );
}

export function Controlled() {
    const [value, setValue] = useState<[number, number]>([25, 75]);

    return (
        <>
            <Text>
                Range: {value[0]} - {value[1]}
            </Text>

            <RangeSlider.Root
                onChangeValue={setValue}
                value={value}
            >
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        </>
    );
}
