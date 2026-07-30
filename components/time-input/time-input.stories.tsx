import { Field, Flex, Text, TimeInput, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Time Input"
} satisfies Meta;

export function Base() {
    return <TimeInput.AIO />;
}

export function Hour12() {
    return <TimeInput.AIO hour12 />;
}

export function WithSeconds() {
    return (
        <TimeInput.AIO
            defaultValue="14:30:45"
            fields={["hour", "minute", "second"]}
            hour12
        />
    );
}

export function WithMilliseconds() {
    return (
        <TimeInput.AIO
            defaultValue="14:30:45.100"
            fields={["hour", "minute", "second", "millisecond"]}
            millisecondStep={100}
        />
    );
}

export function SecondsOnly() {
    return (
        <TimeInput.AIO
            defaultValue="45.250"
            fields={["second", "millisecond"]}
            millisecondStep={50}
        />
    );
}

export function MinutesAndSeconds() {
    return (
        <TimeInput.AIO
            defaultValue="05:30"
            fields={["minute", "second"]}
        />
    );
}

export function Sizes() {
    return (
        <Flex
            alignItems="flex-start"
            gap={4}
            wrap="wrap"
        >
            {(["sm", "md", "lg"] as const).map((size) => (
                <TimeInput.AIO
                    hour12
                    key={size}
                    size={size}
                />
            ))}
        </Flex>
    );
}

export function Variants() {
    return (
        <VStack alignItems="flex-start">
            {(["outline", "solid", "filledOutline"] as const).map((variant) => (
                <TimeInput.AIO
                    hour12
                    key={variant}
                    variant={variant}
                />
            ))}
        </VStack>
    );
}

export function Controlled() {
    const [value, setValue] = useState("14:30");

    return (
        <VStack alignItems="flex-start">
            <Text>Value: {value || "(empty)"}</Text>
            <TimeInput.AIO
                hour12
                onChange={setValue}
                value={value}
            />
        </VStack>
    );
}

export function MinuteStep() {
    return (
        <TimeInput.AIO
            defaultValue="09:00"
            hour12
            minuteStep={5}
        />
    );
}

export function WithField() {
    return (
        <Field.Root>
            <Field.Label>Appointment time</Field.Label>
            <TimeInput.AIO hour12 />
            <Field.Hint>Use arrows or scroll the wheels</Field.Hint>
        </Field.Root>
    );
}

export function Invalid() {
    return (
        <TimeInput.AIO
            hour12
            isInvalid
        />
    );
}

export function Disabled() {
    return (
        <TimeInput.AIO
            defaultValue="08:15"
            hour12
            isDisabled
        />
    );
}

export function Compound() {
    return (
        <TimeInput.Root
            defaultValue="16:45:00"
            fields={["hour", "minute", "second"]}
            hour12
        >
            <TimeInput.Trigger />
            <TimeInput.Content>
                <TimeInput.Columns />
            </TimeInput.Content>
        </TimeInput.Root>
    );
}
