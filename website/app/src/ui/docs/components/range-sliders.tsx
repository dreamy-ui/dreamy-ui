import { Button, Field, Flex, HStack, RangeSlider, Text, VStack } from "@/ui";
import { useId, useState } from "react";
import { DemoLog, useDemoLog } from "./demo-log";

export function MaxMinRangeSlider() {
    const [value, setValue] = useState<[number, number]>([0, 25]);

    return (
        <VStack
            align="start"
            gap={3}
            maxW="xs"
            w="full"
        >
            <Text>
                Range: {value[0]} - {value[1]}
            </Text>
            <RangeSlider.Root
                max={50}
                min={0}
                onValueChange={(next) => setValue(next as [number, number])}
                step={5}
                value={value}
            >
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        </VStack>
    );
}

export function PriceRangeSlider() {
    return (
        <Field.Root
            maxW="xs"
            w="full"
        >
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

export function MultipleThumbsSlider() {
    const thumbs = ["Low", "Medium", "High"];

    return (
        <Field.Root
            maxW="xs"
            w="full"
        >
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

export function MinStepsRangeSlider() {
    const formatTime = (minutes: number) =>
        `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;

    return (
        <Field.Root
            maxW="xs"
            w="full"
        >
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

export function ControlledRangeSlider() {
    const { entries, log, clear } = useDemoLog();
    const [value, setValue] = useState<[number, number]>([0.3, 0.7]);

    return (
        <VStack
            align="start"
            gap={4}
            maxW="sm"
            w="full"
        >
            <Button
                onClick={() => setValue([0.3, 0.7])}
                size="xs"
                variant="outline"
            >
                Reset
            </Button>
            <Field.Root w="full">
                <RangeSlider.Root
                    max={1}
                    min={0}
                    onValueChange={(next, details) => {
                        setValue(next);
                        log(`${next.join(" – ")} (${details.reason})`);
                    }}
                    step={0.1}
                    value={value}
                >
                    <HStack justify="space-between">
                        <Field.Label>Temperature</Field.Label>
                        <RangeSlider.Value />
                    </HStack>
                    <RangeSlider.Track>
                        <RangeSlider.FilledTrack />
                        <RangeSlider.Thumb
                            aria-label="Minimum temperature"
                            index={0}
                        />
                        <RangeSlider.Thumb
                            aria-label="Maximum temperature"
                            index={1}
                        />
                    </RangeSlider.Track>
                </RangeSlider.Root>
            </Field.Root>
            <DemoLog
                entries={entries}
                onClear={clear}
            />
        </VStack>
    );
}

export function CommitRangeSlider() {
    const { entries, log, clear } = useDemoLog();

    return (
        <VStack
            align="start"
            gap={4}
            maxW="sm"
            w="full"
        >
            <Field.Root w="full">
                <RangeSlider.Root
                    defaultValue={[20, 80]}
                    onValueCommit={(value, details) =>
                        log(`Saved ${value.join(" – ")} (${details.reason})`)
                    }
                >
                    <HStack justify="space-between">
                        <Field.Label>Price filter</Field.Label>
                        <RangeSlider.Value />
                    </HStack>
                    <RangeSlider.Track>
                        <RangeSlider.FilledTrack />
                        <RangeSlider.Thumb
                            aria-label="Minimum"
                            index={0}
                        />
                        <RangeSlider.Thumb
                            aria-label="Maximum"
                            index={1}
                        />
                    </RangeSlider.Track>
                </RangeSlider.Root>
            </Field.Root>
            <DemoLog
                emptyText="Drag and release either thumb to commit."
                entries={entries}
                onClear={clear}
            />
        </VStack>
    );
}

export function ControllerRangeSlider() {
    const { entries, log, clear } = useDemoLog();
    const [controller] = useState(() => RangeSlider.createSliderController<[number, number]>());

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
                    onClick={() => controller.setValue([25, 75])}
                    size="xs"
                    variant="outline"
                >
                    Reset
                </Button>
                <Button
                    onClick={() => controller.setValue([0, 100])}
                    size="xs"
                    variant="outline"
                >
                    Expand
                </Button>
                <Button
                    onClick={() => log(`Range is ${controller.getValue().join(" – ")}`)}
                    size="xs"
                    variant="outline"
                >
                    Read
                </Button>
                <Button
                    onClick={() => controller.focus(0)}
                    size="xs"
                    variant="outline"
                >
                    Focus Min
                </Button>
                <Button
                    onClick={() => controller.focus(1)}
                    size="xs"
                    variant="outline"
                >
                    Focus Max
                </Button>
            </Flex>
            <Field.Root w="full">
                <RangeSlider.Root
                    controller={controller}
                    defaultValue={[25, 75]}
                    onValueChange={(value, details) =>
                        log(`Range ${value.join(" – ")} (${details.reason})`)
                    }
                >
                    <HStack justify="space-between">
                        <Field.Label>Price range</Field.Label>
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
            <DemoLog
                entries={entries}
                onClear={clear}
            />
        </VStack>
    );
}

export function FormRangeSlider() {
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
            <Field.Root w="full">
                <RangeSlider.Root
                    defaultValue={[10, 50]}
                    form={formId}
                    format={{ style: "unit", unit: "kilometer" }}
                    max={100}
                    name="radius"
                    step={5}
                >
                    <HStack justify="space-between">
                        <Field.Label>Radius (outside form)</Field.Label>
                        <RangeSlider.Value />
                    </HStack>
                    <RangeSlider.Track>
                        <RangeSlider.FilledTrack />
                        <RangeSlider.Thumb
                            aria-label="Minimum radius"
                            index={0}
                        />
                        <RangeSlider.Thumb
                            aria-label="Maximum radius"
                            index={1}
                        />
                    </RangeSlider.Track>
                </RangeSlider.Root>
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

export function CustomRenderingRangeSlider() {
    return (
        <Field.Root
            maxW="xs"
            pt={6}
            w="full"
        >
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
                    </RangeSlider.Thumb>
                    <RangeSlider.Thumb
                        aria-label="Maximum"
                        index={1}
                    >
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
                    </RangeSlider.Thumb>
                </RangeSlider.Track>
            </RangeSlider.Root>
        </Field.Root>
    );
}
