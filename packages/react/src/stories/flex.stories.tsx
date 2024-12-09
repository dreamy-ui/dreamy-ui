import { Flex } from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Flex"
} satisfies Meta;

export function Base() {
    return <Flex>Flex</Flex>;
}

export function Column() {
    return (
        <Flex direction="column">
            <p>Flex</p>
            <p>Flex</p>
            <p>Flex</p>
            <p>Flex</p>
        </Flex>
    );
}

export function Row() {
    return (
        <Flex direction="row">
            <p>Flex</p>
            <p>Flex</p>
            <p>Flex</p>
            <p>Flex</p>
        </Flex>
    );
}

export function Gap() {
    return (
        <Flex gap="2">
            <p>Flex</p>
            <p>Flex</p>
            <p>Flex</p>
            <p>Flex</p>
        </Flex>
    );
}
