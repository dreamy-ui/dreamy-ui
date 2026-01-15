import { Divider, HStack, Stack, Text, VStack } from "@/rsc";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Stack"
} satisfies Meta;

export function Base() {
    return (
        <Stack>
            <Text>First</Text>
            <Text>Second</Text>
            <Text>Third</Text>
        </Stack>
    );
}

export function VStack_() {
    return (
        <VStack>
            <Text>First</Text>
            <Text>Second</Text>
            <Text>Third</Text>
        </VStack>
    );
}

export function HStack_() {
    return (
        <HStack>
            <Text>First</Text>
            <Text>Second</Text>
            <Text>Third</Text>
        </HStack>
    );
}

export function Seperator() {
    return (
        <Stack
            separator={
                <Divider
                    orientation="vertical"
                    h={5}
                />
            }
        >
            <Text>First</Text>
            <Text>Second</Text>
            <Text>Third</Text>
        </Stack>
    );
}
