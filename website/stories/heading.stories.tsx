import { Heading, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Heading"
} satisfies Meta;

export function Base() {
    return <Heading>This is a simple Heading component.</Heading>;
}

export function Sizes() {
    return (
        <VStack
            align="start"
            w="full"
        >
            <Heading size="xs">Extra small</Heading>
            <Heading size="sm">Small</Heading>
            <Heading size="md">Medium</Heading>
            <Heading size="lg">Large</Heading>
            <Heading size="xl">Extra large</Heading>
            <Heading size="2xl">2 Extra large</Heading>
            <Heading size="3xl">3 Extra large</Heading>
            <Heading size="4xl">4 Extra large</Heading>
            <Heading size="5xl">5 Extra large</Heading>
            <Heading size="6xl">6 Extra large</Heading>
            <Heading size="7xl">7 Extra large</Heading>
        </VStack>
    );
}

export function Tags() {
    return (
        <VStack
            align="start"
            w="full"
        >
            <Heading as="h1">This is a Heading component with h1 tag.</Heading>
            <Heading as="h2">This is a Heading component with h2 tag.</Heading>
            <Heading as="h3">This is a Heading component with h3 tag.</Heading>
        </VStack>
    );
}
