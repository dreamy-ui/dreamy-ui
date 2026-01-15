import { Slider, Text, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Slider"
} satisfies Meta;

export function Base() {
    return (
        <Slider.Root>
            <Slider.Track maxW="xs">
                <Slider.FilledTrack />
                <Slider.Thumb />
            </Slider.Track>
        </Slider.Root>
    );
}

export function MaxMinStep() {
    const [value, setValue] = useState(0);

    return (
        <>
            <Text>
                Slider value: {value}
            </Text>

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

export function Size() {
    return (
        <VStack
            gap={10}
            w="full"
        >
            <Slider.Root size="sm">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root size="md">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root size="lg">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        </VStack>
    );
}

export function Scheme() {
    return (
        <VStack
            gap={10}
            w="full"
        >
            <Slider.Root scheme="primary">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root scheme="secondary">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root scheme="info">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root scheme="success">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root scheme="warning">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root scheme="error">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        </VStack>
    );
}

export function Orientation() {
    return (
        <Slider.Root
            h="200px"
            orientation="vertical"
        >
            <Slider.Track maxW="xs">
                <Slider.FilledTrack />
                <Slider.Thumb />
            </Slider.Track>
        </Slider.Root>
    );
}

export function Reversed() {
    return (
        <Slider.Root isReversed>
            <Slider.Track maxW="xs">
                <Slider.FilledTrack />
                <Slider.Thumb />
            </Slider.Track>
        </Slider.Root>
    );
}

export function CustomThumbSize() {
    return (
        <VStack
            gap={10}
            w="full"
        >
            <Slider.Root thumbSize={16}>
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root thumbSize={32}>
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root
                scheme="info"
                thumbSize={48}
            >
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        </VStack>
    );
}

export function HideThumb() {
    return (
        <VStack
            gap={10}
            w="full"
        >
            <Slider.Root hideThumb>
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root
                defaultValue={70}
                hideThumb
                scheme="success"
            >
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                </Slider.Track>
            </Slider.Root>
        </VStack>
    );
}

export function Controlled() {
    const [value, setValue] = useState(0);

    return (
        <>
            <Text>
                Slider value: {value}
            </Text>

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
