import { Button, Field, Flex, HStack, RangeSlider, Text, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useId, useState } from "react";

export default {
    title: "Range Slider"
} satisfies Meta;

export function Base() {
    return (
        <RangeSlider.Root>
            <RangeSlider.Track maxW="xs">
                <RangeSlider.FilledTrack />
            </RangeSlider.Track>
            <RangeSlider.Thumb index={0} />
            <RangeSlider.Thumb index={1} />
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
                onValueChange={setValue}
                step={5}
                value={value}
            >
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
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
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
            <RangeSlider.Root size="md">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
            <RangeSlider.Root size="lg">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
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
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
            <RangeSlider.Root scheme="secondary">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
            <RangeSlider.Root scheme="info">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
            <RangeSlider.Root scheme="success">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
            <RangeSlider.Root scheme="warning">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
            <RangeSlider.Root scheme="error">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
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
            </RangeSlider.Track>
            <RangeSlider.Thumb index={0} />
            <RangeSlider.Thumb index={1} />
        </RangeSlider.Root>
    );
}

export function Reversed() {
    return (
        <RangeSlider.Root isReversed>
            <RangeSlider.Track maxW="xs">
                <RangeSlider.FilledTrack />
            </RangeSlider.Track>
            <RangeSlider.Thumb index={0} />
            <RangeSlider.Thumb index={1} />
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
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
            <RangeSlider.Root thumbSize={32}>
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
            <RangeSlider.Root
                scheme="info"
                thumbSize={48}
            >
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
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
                onValueChange={setValue}
                value={value}
            >
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
        </>
    );
}

export function WithValueAndFormat() {
    return (
        <Field.Root maxW="xs">
            <RangeSlider.Root
                defaultValue={[25, 50]}
                format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
                step={5}
            >
                <HStack justify="space-between">
                    <Field.Label>Price</Field.Label>
                    <RangeSlider.Value />
                </HStack>
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb
                        aria-label="Minimum price"
                        index={0}
                    />
                    <RangeSlider.Thumb
                        aria-label="Maximum price"
                        index={1}
                    />
                </RangeSlider.Track>
            </RangeSlider.Root>
        </Field.Root>
    );
}

export function MultipleThumbs() {
    const thumbs = ["Low", "Medium", "High"];

    return (
        <Field.Root maxW="xs">
            <RangeSlider.Root
                defaultValue={[10, 20, 70]}
                format={{ style: "unit", unit: "percent" }}
                step={10}
            >
                <HStack justify="space-between">
                    <Field.Label>Alert thresholds</Field.Label>
                    <RangeSlider.Value />
                </HStack>
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                    {thumbs.map((label, index) => (
                        <RangeSlider.Thumb
                            aria-label={label}
                            index={index}
                            key={label}
                        />
                    ))}
                </RangeSlider.Track>
            </RangeSlider.Root>
        </Field.Root>
    );
}

export function MinStepsBetweenThumbs() {
    const formatTime = (minutes: number) =>
        `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;

    return (
        <Field.Root maxW="xs">
            <RangeSlider.Root
                defaultValue={[540, 1020]}
                format={formatTime}
                max={1440}
                min={0}
                minStepsBetweenThumbs={16}
                step={15}
            >
                <HStack justify="space-between">
                    <Field.Label>Opening hours</Field.Label>
                    <RangeSlider.Value />
                </HStack>
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb
                        aria-label="Opens"
                        index={0}
                    />
                    <RangeSlider.Thumb
                        aria-label="Closes"
                        index={1}
                    />
                </RangeSlider.Track>
            </RangeSlider.Root>
        </Field.Root>
    );
}

export function FormIntegration() {
    const formId = useId();
    const [submitted, setSubmitted] = useState("");

    return (
        <VStack
            align="start"
            gap={4}
            maxW="xs"
            w="full"
        >
            <form
                id={formId}
                onSubmit={(e) => {
                    e.preventDefault();
                    const entries = [...new FormData(e.currentTarget)].map(
                        ([k, v]) => `${k}=${v}`
                    );
                    setSubmitted(entries.join(", "));
                }}
                style={{ width: "100%" }}
            >
                <Field.Root>
                    <RangeSlider.Root
                        defaultValue={[200, 800]}
                        max={1000}
                        name="price"
                        step={10}
                    >
                        <HStack justify="space-between">
                            <Field.Label>Price</Field.Label>
                            <RangeSlider.Value />
                        </HStack>
                        <RangeSlider.Track>
                            <RangeSlider.FilledTrack />
                            <RangeSlider.Thumb
                                aria-label="Minimum price"
                                index={0}
                            />
                            <RangeSlider.Thumb
                                aria-label="Maximum price"
                                index={1}
                            />
                        </RangeSlider.Track>
                    </RangeSlider.Root>
                </Field.Root>
            </form>
            <Flex gap={2}>
                <Button
                    form={formId}
                    size="xs"
                    type="submit"
                >
                    Save
                </Button>
                <Button
                    form={formId}
                    size="xs"
                    type="reset"
                    variant="outline"
                >
                    Reset
                </Button>
            </Flex>
            {submitted ? <Text fontSize="sm">Submitted: {submitted}</Text> : null}
        </VStack>
    );
}

export function CustomRendering() {
    return (
        <Field.Root maxW="xs">
            <RangeSlider.Root defaultValue={[25, 75]}>
                <HStack justify="space-between">
                    <Field.Label>Range</Field.Label>
                    <RangeSlider.Value>{(state) => `${state.text}%`}</RangeSlider.Value>
                </HStack>
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb
                        aria-label="Minimum"
                        index={0}
                    >
                        {(state) => (
                            <span
                                style={{
                                    position: "absolute",
                                    bottom: "calc(100% + 6px)",
                                    fontSize: "11px",
                                    fontWeight: 600
                                }}
                            >
                                {state.thumbValue}
                            </span>
                        )}
                    </RangeSlider.Thumb>
                    <RangeSlider.Thumb
                        aria-label="Maximum"
                        index={1}
                    >
                        {(state) => (
                            <span
                                style={{
                                    position: "absolute",
                                    bottom: "calc(100% + 6px)",
                                    fontSize: "11px",
                                    fontWeight: 600
                                }}
                            >
                                {state.thumbValue}
                            </span>
                        )}
                    </RangeSlider.Thumb>
                </RangeSlider.Track>
            </RangeSlider.Root>
        </Field.Root>
    );
}
