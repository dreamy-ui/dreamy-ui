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
    return <TimeInput.AIO hourCycle={12} />;
}

export function WithSeconds() {
    return (
        <TimeInput.AIO
            defaultValue="14:30:45"
            granularity="second"
            hourCycle={12}
        />
    );
}

export function HourOnly() {
    return (
        <TimeInput.AIO
            defaultValue="09:00"
            granularity="hour"
            hourCycle={24}
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
                    hourCycle={12}
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
                    hourCycle={12}
                    key={variant}
                    variant={variant}
                />
            ))}
        </VStack>
    );
}

export function Controlled() {
    const [value, setValue] = useState<string | null>("14:30");

    return (
        <VStack alignItems="flex-start">
            <Text>Value: {value || "(empty)"}</Text>
            <TimeInput.AIO
                hourCycle={12}
                onValueChange={(next) => setValue(next)}
                value={value}
            />
        </VStack>
    );
}

export function MinuteStep() {
    return (
        <TimeInput.AIO
            defaultValue="09:00"
            hourCycle={12}
            minuteStep={5}
        />
    );
}

export function WithField() {
    return (
        <Field.Root>
            <Field.Label>Appointment time</Field.Label>
            <TimeInput.AIO hourCycle={12} />
            <Field.Hint>Use arrows or scroll the wheels</Field.Hint>
        </Field.Root>
    );
}

export function Invalid() {
    return (
        <TimeInput.AIO
            hourCycle={12}
            invalid
        />
    );
}

export function Disabled() {
    return (
        <TimeInput.AIO
            defaultValue="08:15"
            disabled
            hourCycle={12}
        />
    );
}

export function Compound() {
    return (
        <TimeInput.Root
            defaultValue="16:45:00"
            granularity="second"
            hourCycle={12}
        >
            <TimeInput.Trigger />
            <TimeInput.Content>
                <TimeInput.Columns />
            </TimeInput.Content>
        </TimeInput.Root>
    );
}
