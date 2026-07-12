import { Field, Textarea, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Textarea"
} satisfies Meta;

export function Base() {
    return <Textarea placeholder="Enter your bio" />;
}

export function MinMaxRows() {
    return (
        <Textarea
            maxRows={4}
            minRows={2}
            placeholder="Enter your bio"
        />
    );
}

export function Resize() {
    return (
        <VStack w="full">
            <Textarea
                placeholder="Enter your bio"
                resize="none"
            />
            <Textarea
                placeholder="Enter your bio"
                resize="vertical"
            />
            <Textarea
                placeholder="Enter your bio"
                resize="horizontal"
            />
            <Textarea
                placeholder="Enter your bio"
                resize="both"
            />
        </VStack>
    );
}

export function Sizes() {
    return (
        <VStack w="full">
            <Textarea
                placeholder="Enter your bio"
                size="sm"
            />
            <Textarea
                placeholder="Enter your bio"
                size="md"
            />
            <Textarea
                placeholder="Enter your bio"
                size="lg"
            />
        </VStack>
    );
}

export function Variants() {
    return (
        <VStack w="full">
            <Textarea
                placeholder="Enter your bio"
                variant="outline"
            />
            <Textarea
                placeholder="Enter your bio"
                variant="filled"
            />
            <Textarea
                placeholder="Enter your bio"
                variant="flushed"
            />
        </VStack>
    );
}

export function Invalid() {
    return (
        <VStack w="full">
            <Textarea
                isInvalid
                placeholder="Enter your bio"
                variant="outline"
            />
            <Textarea
                isInvalid
                placeholder="Enter your bio"
                variant="filled"
            />
            <Textarea
                isInvalid
                placeholder="Enter your bio"
                variant="flushed"
            />
        </VStack>
    );
}

export function WithField() {
    return (
        <Field.Root>
            <Field.Label>Biography</Field.Label>
            <Textarea placeholder="Enter your bio" />
            <Field.Hint>Biography should not contain any bad words.</Field.Hint>
        </Field.Root>
    );
}
