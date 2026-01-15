import { Accordion, HStack, Icon, Text } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { PiConfetti } from "react-icons/pi";

export default {
    title: "Accordion"
} satisfies Meta;

export function Base() {
    return (
        <Accordion.Root>
            {Array.from({ length: 3 }).map((_, index) => (
                <Accordion.Item key={index}>
                    <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                    <Accordion.Content>Hi!</Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}

export function AllowMultiple() {
    return (
        <Accordion.Root allowMultiple>
            {Array.from({ length: 3 }).map((_, index) => (
                <Accordion.Item key={index}>
                    <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                    <Accordion.Content>Hi!</Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}

export function AllowToggle() {
    return (
        <Accordion.Root allowToggle>
            {Array.from({ length: 3 }).map((_, index) => (
                <Accordion.Item key={index}>
                    <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                    <Accordion.Content>Hi!</Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}

export function Controlled() {
    const [value, setValue] = useState<number | number[]>(0);

    return (
        <Accordion.Root
            index={value}
            onChange={(i) => setValue(i)}
        >
            {Array.from({ length: 3 }).map((_, index) => (
                <Accordion.Item key={index}>
                    <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                    <Accordion.Content>Hi!</Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}

export function WithIcon() {
    return (
        <Accordion.Root>
            {Array.from({ length: 3 }).map((_, index) => (
                <Accordion.Item key={index}>
                    <Accordion.Trigger>
                        <HStack>
                            <Icon
                                as={PiConfetti}
                                color="fg.medium"
                            />
                            <Text>Item {index + 1}</Text>
                        </HStack>
                    </Accordion.Trigger>
                    <Accordion.Content>Hi!</Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}

export function Variants() {
    return (
        <>
            <Text bold>Outline</Text>
            <Accordion.Root variant="outline">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Accordion.Item key={index}>
                        <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                        <Accordion.Content>Hi!</Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion.Root>

            <Text bold>Solid</Text>
            <Accordion.Root variant="solid">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Accordion.Item key={index}>
                        <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                        <Accordion.Content>Hi!</Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion.Root>

            <Text bold>Subtle</Text>
            <Accordion.Root variant="subtle">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Accordion.Item key={index}>
                        <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                        <Accordion.Content>Hi!</Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </>
    );
}

export function Sizes() {
    return (
        <>
            <Text
                bold
                mt={4}
            >
                Small
            </Text>
            <Accordion.Root size="sm">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Accordion.Item key={index}>
                        <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                        <Accordion.Content>Hi!</Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion.Root>

            <Text
                bold
                mt={4}
            >
                Medium
            </Text>
            <Accordion.Root size="md">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Accordion.Item key={index}>
                        <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                        <Accordion.Content>Hi!</Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion.Root>

            <Text
                bold
                mt={4}
            >
                Large
            </Text>
            <Accordion.Root size="lg">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Accordion.Item key={index}>
                        <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                        <Accordion.Content>Hi!</Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </>
    );
}
