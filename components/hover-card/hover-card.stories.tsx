import { Button, HStack, HoverCard, Text, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "HoverCard"
} satisfies Meta;

export function Base() {
    return (
        <HoverCard.Root>
            <HoverCard.Trigger>
                <Button variant="link">@dreamy_ui</Button>
            </HoverCard.Trigger>
            <HoverCard.Content>
                <HoverCard.Header>Dreamy UI</HoverCard.Header>
                <HoverCard.Body>
                    <Text
                        color="fg.medium"
                        fontSize="sm"
                    >
                        A React component library powered by UI SDK and Panda CSS.
                    </Text>
                </HoverCard.Body>
                <HoverCard.Footer>
                    <Text
                        color="fg.medium"
                        fontSize="xs"
                    >
                        Hover card preview
                    </Text>
                </HoverCard.Footer>
            </HoverCard.Content>
        </HoverCard.Root>
    );
}

export function Sizes() {
    return (
        <HStack gap={4}>
            {(["sm", "md", "lg"] as const).map((size) => (
                <HoverCard.Root
                    delay={0}
                    key={size}
                    size={size}
                >
                    <HoverCard.Trigger>
                        <Button
                            size="sm"
                            variant="outline"
                        >
                            {size}
                        </Button>
                    </HoverCard.Trigger>
                    <HoverCard.Content>
                        <HoverCard.Body>
                            <Text fontSize="sm">Hover card size {size}</Text>
                        </HoverCard.Body>
                    </HoverCard.Content>
                </HoverCard.Root>
            ))}
        </HStack>
    );
}

export function Controlled() {
    const [open, setOpen] = useState(false);

    return (
        <VStack align="start">
            <Button
                onClick={() => setOpen((prev) => !prev)}
                size="sm"
                variant="outline"
            >
                {open ? "Close" : "Open"} hover card
            </Button>
            <HoverCard.Root
                onOpenChange={(next) => setOpen(next)}
                open={open}
            >
                <HoverCard.Trigger>
                    <Button variant="link">@dreamy_ui</Button>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <HoverCard.Body>
                        <Text fontSize="sm">Controlled hover card content</Text>
                    </HoverCard.Body>
                </HoverCard.Content>
            </HoverCard.Root>
        </VStack>
    );
}

export function States() {
    return (
        <HStack gap={4}>
            <HoverCard.Root
                delay={0}
                hasArrow={false}
            >
                <HoverCard.Trigger>
                    <Button
                        size="sm"
                        variant="outline"
                    >
                        No arrow
                    </Button>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <HoverCard.Body>
                        <Text fontSize="sm">Without arrow</Text>
                    </HoverCard.Body>
                </HoverCard.Content>
            </HoverCard.Root>
            <HoverCard.Root
                delay={0}
                disabled
            >
                <HoverCard.Trigger>
                    <Button
                        size="sm"
                        variant="outline"
                    >
                        Disabled
                    </Button>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <HoverCard.Body>
                        <Text fontSize="sm">Disabled hover card</Text>
                    </HoverCard.Body>
                </HoverCard.Content>
            </HoverCard.Root>
        </HStack>
    );
}
