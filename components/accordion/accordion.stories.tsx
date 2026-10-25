import { Accordion, HStack, Icon, Text } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { PiConfetti } from "react-icons/pi";

export default {
    title: "Accordion"
} satisfies Meta;

const items = ["item-1", "item-2", "item-3"];

export function Base() {
    return (
        <Accordion.Root multiple>
            {items.map((value, index) => (
                <Accordion.Item
                    key={value}
                    value={value}
                >
                    <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                    <Accordion.Content>Hi!</Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}

export function AllowSingle() {
    return (
        <Accordion.Root>
            {items.map((value, index) => (
                <Accordion.Item
                    key={value}
                    value={value}
                >
                    <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                    <Accordion.Content>Hi!</Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}

export function Collapsible() {
    return (
        <Accordion.Root collapsible>
            {items.map((value, index) => (
                <Accordion.Item
                    key={value}
                    value={value}
                >
                    <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                    <Accordion.Content>Hi!</Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}

export function Controlled() {
    const [value, setValue] = useState<string[]>(["item-1"]);

    return (
        <Accordion.Root
            value={value}
            onValueChange={(details) => setValue(details.value)}
        >
            {items.map((itemValue, index) => (
                <Accordion.Item
                    key={itemValue}
                    value={itemValue}
                >
                    <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                    <Accordion.Content>Hi!</Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}

export function WithIcon() {
    return (
        <Accordion.Root multiple>
            {items.map((value, index) => (
                <Accordion.Item
                    key={value}
                    value={value}
                >
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
            <Accordion.Root
                multiple
                variant="outline"
            >
                {items.map((value, index) => (
                    <Accordion.Item
                        key={value}
                        value={value}
                    >
                        <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                        <Accordion.Content>Hi!</Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion.Root>

            <Text bold>Solid</Text>
            <Accordion.Root
                multiple
                variant="solid"
            >
                {items.map((value, index) => (
                    <Accordion.Item
                        key={value}
                        value={value}
                    >
                        <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                        <Accordion.Content>Hi!</Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion.Root>

            <Text bold>Subtle</Text>
            <Accordion.Root
                multiple
                variant="subtle"
            >
                {items.map((value, index) => (
                    <Accordion.Item
                        key={value}
                        value={value}
                    >
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
            <Accordion.Root
                multiple
                size="sm"
            >
                {items.map((value, index) => (
                    <Accordion.Item
                        key={value}
                        value={value}
                    >
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
            <Accordion.Root
                multiple
                size="md"
            >
                {items.map((value, index) => (
                    <Accordion.Item
                        key={value}
                        value={value}
                    >
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
            <Accordion.Root
                multiple
                size="lg"
            >
                {items.map((value, index) => (
                    <Accordion.Item
                        key={value}
                        value={value}
                    >
                        <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                        <Accordion.Content>Hi!</Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </>
    );
}
