import { Button, Field, Flex, HStack, Slider, Text, VStack } from "@/ui";
import { useId, useState } from "react";
import { DemoLog, useDemoLog } from "./demo-log";

export function FieldSlider() {
    return (
        <Field.Root
            maxW="xs"
            w="full"
        >
            <Slider.Root
                defaultValue={0.3}
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
    );
}

export function DisabledSlider() {
    return (
        <Field.Root
            maxW="xs"
            w="full"
        >
            <Slider.Root
                defaultValue={50}
                disabled
            >
                <HStack justify="space-between">
                    <Field.Label>Brightness</Field.Label>
                    <Slider.Value />
                </HStack>
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Field.Hint>Managed by your organization.</Field.Hint>
        </Field.Root>
    );
}

export function ReadOnlySlider() {
    return (
        <Field.Root
            maxW="xs"
            w="full"
        >
            <Slider.Root
                defaultValue={50}
                name="storage"
                readOnly
            >
                <HStack justify="space-between">
                    <Field.Label>Storage</Field.Label>
                    <Slider.Value />
                </HStack>
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Field.Hint>Set by your plan.</Field.Hint>
        </Field.Root>
    );
}

export function MaxMinSlider() {
    const [value, setValue] = useState(0);

    return (
        <VStack
            align="start"
            gap={3}
            maxW="xs"
            w="full"
        >
            <Text>Slider value: {value}</Text>
            <Slider.Root
                max={50}
                min={0}
                onValueChange={(nextValue) => setValue(nextValue)}
                step={10}
                value={value}
            >
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        </VStack>
    );
}

export function StepAndBoundsSlider() {
    return (
        <VStack
            align="start"
            gap={6}
            maxW="xs"
            w="full"
        >
            <Field.Root w="full">
                <Slider.Root
                    defaultValue={2010}
                    format={{ useGrouping: false }}
                    max={2030}
                    min={1990}
                    step={5}
                >
                    <HStack justify="space-between">
                        <Field.Label>Year</Field.Label>
                        <Slider.Value />
                    </HStack>
                    <Slider.Track>
                        <Slider.FilledTrack />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Root>
            </Field.Root>
            <Field.Root w="full">
                <Slider.Root
                    defaultValue={0.5}
                    max={1}
                    min={0}
                    step={0.05}
                >
                    <HStack justify="space-between">
                        <Field.Label>Opacity</Field.Label>
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

export function LargeStepSlider() {
    return (
        <Field.Root
            maxW="xs"
            w="full"
        >
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

export function FormatAndLocaleSliders() {
    const sliders = [
        {
            label: "Budget",
            defaultValue: 40,
            max: 100,
            step: 1,
            format: { style: "currency", currency: "USD", maximumFractionDigits: 0 }
        },
        {
            label: "Opacity",
            defaultValue: 0.6,
            max: 1,
            step: 0.01,
            format: { style: "percent" }
        },
        {
            label: "Weight",
            defaultValue: 20,
            max: 50,
            step: 0.5,
            format: { style: "unit", unit: "kilogram" }
        },
        {
            label: "Duration",
            defaultValue: 90,
            max: 600,
            step: 15,
            format: (seconds: number) => `${Math.floor(seconds / 60)} min ${seconds % 60} s`
        },
        {
            label: "Preis",
            defaultValue: 40,
            max: 100,
            step: 1,
            format: { style: "currency", currency: "EUR" },
            locale: "de-DE"
        }
    ] satisfies {
        label: string;
        defaultValue: number;
        max: number;
        step: number;
        format: Intl.NumberFormatOptions | ((value: number) => string);
        locale?: string;
    }[];

    return (
        <VStack
            align="start"
            gap={5}
            maxW="xs"
            w="full"
        >
            {sliders.map(({ label, ...options }) => (
                <Field.Root
                    key={label}
                    w="full"
                >
                    <Slider.Root {...options}>
                        <HStack justify="space-between">
                            <Field.Label>{label}</Field.Label>
                            <Slider.Value />
                        </HStack>
                        <Slider.Track>
                            <Slider.FilledTrack />
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider.Root>
                </Field.Root>
            ))}
        </VStack>
    );
}

export function ControlledSlider() {
    const { entries, log, clear } = useDemoLog();
    const [value, setValue] = useState(40);

    return (
        <VStack
            align="start"
            gap={4}
            maxW="sm"
            w="full"
        >
            <Button
                onClick={() => setValue(40)}
                size="xs"
                variant="outline"
            >
                Reset
            </Button>
            <Field.Root w="full">
                <Slider.Root
                    onValueChange={(nextValue, details) => {
                        setValue(nextValue);
                        log(`${nextValue} (${details.reason})`);
                    }}
                    value={value}
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
            <DemoLog
                entries={entries}
                onClear={clear}
            />
        </VStack>
    );
}

export function CommitSlider() {
    const { entries, log, clear } = useDemoLog();

    return (
        <VStack
            align="start"
            gap={4}
            maxW="sm"
            w="full"
        >
            <Field.Root w="full">
                <Slider.Root
                    defaultValue={50}
                    onValueCommit={(value, details) => log(`Saved ${value} (${details.reason})`)}
                >
                    <HStack justify="space-between">
                        <Field.Label>Brightness</Field.Label>
                        <Slider.Value />
                    </HStack>
                    <Slider.Track>
                        <Slider.FilledTrack />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Root>
            </Field.Root>
            <DemoLog
                emptyText="Drag and release Brightness, or press an arrow key."
                entries={entries}
                onClear={clear}
            />
        </VStack>
    );
}

export function ControllerSlider() {
    const { entries, log, clear } = useDemoLog();
    const [volume] = useState(() => Slider.createSliderController<number>());

    return (
        <VStack
            align="start"
            gap={4}
            maxW="sm"
            w="full"
        >
            <Flex
                gap={2}
                wrap="wrap"
            >
                <Button
                    onClick={() => volume.setValue(0)}
                    size="xs"
                    variant="outline"
                >
                    Mute
                </Button>
                <Button
                    onClick={() => volume.setValue(volume.getValue() + 10)}
                    size="xs"
                    variant="outline"
                >
                    Louder
                </Button>
                <Button
                    onClick={() => log(`Volume is ${volume.getValue()}`)}
                    size="xs"
                    variant="outline"
                >
                    Read
                </Button>
                <Button
                    onClick={() => volume.focus()}
                    size="xs"
                    variant="outline"
                >
                    Focus
                </Button>
            </Flex>
            <Field.Root w="full">
                <Slider.Root
                    controller={volume}
                    defaultValue={40}
                    onValueChange={(value, details) => log(`Volume ${value} (${details.reason})`)}
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
            <DemoLog
                entries={entries}
                onClear={clear}
            />
        </VStack>
    );
}

export function FormSlider() {
    const { entries, log, clear } = useDemoLog();
    const formId = useId();

    return (
        <VStack
            align="start"
            gap={4}
            maxW="sm"
            w="full"
        >
            <form
                id={formId}
                onSubmit={(event) => {
                    event.preventDefault();
                    const data = [...new FormData(event.currentTarget)].map(
                        ([name, value]) => `${name}=${value}`
                    );
                    log(`Submitted ${data.join(", ")}`);
                }}
                style={{ width: "100%" }}
            >
                <Field.Root w="full">
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
            <Field.Root w="full">
                <Slider.Root
                    defaultValue={25}
                    form={formId}
                    format={{ style: "unit", unit: "kilometer" }}
                    max={100}
                    name="distance"
                    step={5}
                >
                    <HStack justify="space-between">
                        <Field.Label>Distance (outside form)</Field.Label>
                        <Slider.Value />
                    </HStack>
                    <Slider.Track>
                        <Slider.FilledTrack />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Root>
            </Field.Root>
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
            <DemoLog
                entries={entries}
                onClear={clear}
            />
        </VStack>
    );
}

export function VerticalSliders() {
    const channels = [
        { label: "Bass", value: 50 },
        { label: "Treble", value: 25 }
    ];

    return (
        <HStack
            align="end"
            gap={8}
        >
            {channels.map((channel) => (
                <Field.Root
                    align="center"
                    key={channel.label}
                    w="auto"
                >
                    <Slider.Root
                        defaultValue={channel.value}
                        h="180px"
                        orientation="vertical"
                    >
                        <Slider.Track>
                            <Slider.FilledTrack />
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider.Root>
                    <Field.Label>{channel.label}</Field.Label>
                </Field.Root>
            ))}
        </HStack>
    );
}

export function CustomRenderingSlider() {
    return (
        <Field.Root
            maxW="xs"
            pt={6}
            w="full"
        >
            <Slider.Root defaultValue={60}>
                <HStack justify="space-between">
                    <Field.Label>Brightness</Field.Label>
                    <Slider.Value>{(state) => `${state.text}%`}</Slider.Value>
                </HStack>
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb>
                        {(state) => (
                            <Text
                                bg="bg.panel"
                                border="1px solid"
                                borderColor="border"
                                bottom="calc(100% + 8px)"
                                fontSize="xs"
                                fontWeight="semibold"
                                position="absolute"
                                px={1.5}
                                py={0.5}
                                rounded="sm"
                                shadow="xs"
                            >
                                {state.thumbValue}
                            </Text>
                        )}
                    </Slider.Thumb>
                </Slider.Track>
            </Slider.Root>
        </Field.Root>
    );
}
