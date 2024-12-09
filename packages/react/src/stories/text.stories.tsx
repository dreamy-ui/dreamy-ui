import { Text, VStack } from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Text"
} satisfies Meta;

export function Base() {
    return <Text>Text</Text>;
}

export function Size() {
    return (
        <VStack>
            <Text size={"xs"}>XS</Text>
            <Text size={"sm"}>SM</Text>
            <Text size={"md"}>MD</Text>
            <Text size={"lg"}>LG</Text>
            <Text size={"xl"}>XL</Text>
            <Text size={"2xl"}>2XL</Text>
            <Text size={"3xl"}>3XL</Text>
            <Text size={"4xl"}>4XL</Text>
            <Text size={"5xl"}>5XL</Text>
            <Text size={"6xl"}>6XL</Text>
            <Text size={"7xl"}>7XL</Text>
        </VStack>
    );
}
