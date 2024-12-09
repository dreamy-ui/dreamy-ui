import { Heading, VStack } from "@/rsc";
import type { Meta } from "@storybook/react";

export default {
    title: "Heading"
} satisfies Meta;

export function Base() {
    return <Heading>Heading</Heading>;
}

export function Size() {
    return (
        <VStack>
            <Heading size={"xs"}>XS</Heading>
            <Heading size={"sm"}>SM</Heading>
            <Heading size={"md"}>MD</Heading>
            <Heading size={"lg"}>LG</Heading>
            <Heading size={"xl"}>XL</Heading>
            <Heading size={"2xl"}>2XL</Heading>
            <Heading size={"3xl"}>3XL</Heading>
            <Heading size={"4xl"}>4XL</Heading>
            <Heading size={"5xl"}>5XL</Heading>
            <Heading size={"6xl"}>6XL</Heading>
            <Heading size={"7xl"}>7XL</Heading>
        </VStack>
    );
}
