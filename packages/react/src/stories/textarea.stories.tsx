import { Textarea, TextareaNoAutoSize, VStack } from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Textarea"
} satisfies Meta;

export function Base() {
    return <Textarea />;
}

export function Placeholder() {
    return <Textarea placeholder="Placeholder" />;
}

export function MinMax() {
    return (
        <Textarea
            minRows={2}
            maxRows={4}
        />
    );
}

export function NoAutoSize() {
    return <TextareaNoAutoSize />;
}

export function Variant() {
    return (
        <VStack>
            <Textarea variant="outline" />
            <Textarea variant="filled" />
            <Textarea variant="flushed" />
        </VStack>
    );
}
