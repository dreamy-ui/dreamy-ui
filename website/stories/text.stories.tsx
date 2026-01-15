import { Text, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Text"
} satisfies Meta;

export function Base() {
    return <Text>This is a simple text component.</Text>;
}

export function Sizes() {
    return (
        <VStack w="full">
            <Text size="xs">Extra small</Text>
            <Text size="sm">Small</Text>
            <Text size="md">Medium</Text>
            <Text size="lg">Large</Text>
            <Text size="xl">Extra large</Text>
            <Text size="2xl">2 Extra large</Text>
            <Text size="3xl">3 Extra large</Text>
            <Text size="4xl">4 Extra large</Text>
            <Text size="5xl">5 Extra large</Text>
            <Text size="6xl">6 Extra large</Text>
            <Text size="7xl">7 Extra large</Text>
        </VStack>
    );
}
