import { Button, Field, Flex, HStack, Slider, Text, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useId, useState } from "react";

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
                onValueChange={setValue}
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
                onValueChange={setValue}
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

export function WithValueAndFormat() {
    return (
        <VStack
            align="start"
            gap={6}
            maxW="xs"
            w="full"
        >
            <Field.Root>
                <Slider.Root
                    defaultValue={0.35}
                    format={{ style: "percent" }}
                    max={1}
                    min={0}
                    step={0.01}
                >
                    <HStack justify="space-between">
                        <Field.Label>Volume</Field.Label>
                        <Slider.Value />
                    </HStack>
                    <Slider.Track>
                        <Slider.FilledTrack />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Root>
                <Field.Hint>How loud notifications play.</Field.Hint>
            </Field.Root>

            <Field.Root>
                <Slider.Root
                    defaultValue={40}
                    format={{ style: "currency", currency: "EUR" }}
                    locale="de-DE"
                >
                    <HStack justify="space-between">
                        <Field.Label>Preis</Field.Label>
                        <Slider.Value />
                    </HStack>
                    <Slider.Track>
                        <Slider.FilledTrack />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Root>
            </Field.Root>
        </VStack>
    );
}

export function LargeStep() {
    return (
        <Field.Root maxW="xs">
            <Slider.Root
                defaultValue={100}
                format={{ style: "unit", unit: "percent" }}
                largeStep={25}
                max={400}
                min={25}
            >
                <HStack justify="space-between">
                    <Field.Label>Zoom</Field.Label>
                    <Slider.Value />
                </HStack>
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        </Field.Root>
    );
}

export function CommitAndController() {
    const [controller] = useState(() => Slider.createSliderController<number>());
    const [committed, setCommitted] = useState(40);

    return (
        <VStack
            align="start"
            gap={4}
            maxW="xs"
            w="full"
        >
            <HStack gap={2}>
                <Button
                    onClick={() => controller.setValue(0)}
                    size="xs"
                >
                    Mute
                </Button>
                <Button
                    onClick={() => controller.setValue(controller.getValue() + 10)}
                    size="xs"
                >
                    Louder
                </Button>
                <Button
                    onClick={() => controller.focus()}
                    size="xs"
                    variant="outline"
                >
                    Focus
                </Button>
            </HStack>
            <Field.Root>
                <Slider.Root
                    controller={controller}
                    defaultValue={40}
                    onValueCommit={(val) => setCommitted(val)}
                >
                    <HStack justify="space-between">
                        <Field.Label>Volume</Field.Label>
                        <Slider.Value />
                    </HStack>
                    <Slider.Track>
                        <Slider.FilledTrack />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Root>
            </Field.Root>
            <Text fontSize="sm">Last committed: {committed}</Text>
        </VStack>
    );
}

export function FormIntegration() {
    const formId = useId();
    const [submitted, setSubmitted] = useState<string>("");

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
                    <Slider.Root
                        defaultValue={3}
                        max={5}
                        min={1}
                        name="rating"
                    >
                        <HStack justify="space-between">
                            <Field.Label>Minimum rating</Field.Label>
                            <Slider.Value />
                        </HStack>
                        <Slider.Track>
                            <Slider.FilledTrack />
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider.Root>
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

export function CustomThumbRendering() {
    return (
        <Field.Root maxW="xs">
            <Slider.Root defaultValue={60}>
                <HStack justify="space-between">
                    <Field.Label>Brightness</Field.Label>
                    <Slider.Value>{(state) => `${state.text}%`}</Slider.Value>
                </HStack>
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb>
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
                    </Slider.Thumb>
                </Slider.Track>
            </Slider.Root>
        </Field.Root>
    );
}

export function ReadOnlyAndDisabled() {
    return (
        <VStack
            align="start"
            gap={6}
            maxW="xs"
            w="full"
        >
            <Field.Root>
                <Slider.Root
                    defaultValue={50}
                    disabled
                >
                    <HStack justify="space-between">
                        <Field.Label>Brightness (disabled)</Field.Label>
                        <Slider.Value />
                    </HStack>
                    <Slider.Track>
                        <Slider.FilledTrack />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Root>
            </Field.Root>
            <Field.Root>
                <Slider.Root
                    defaultValue={50}
                    readOnly
                >
                    <HStack justify="space-between">
                        <Field.Label>Storage (read-only)</Field.Label>
                        <Slider.Value />
                    </HStack>
                    <Slider.Track>
                        <Slider.FilledTrack />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Root>
            </Field.Root>
        </VStack>
    );
}
