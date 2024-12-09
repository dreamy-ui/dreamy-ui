import { Progress, VStack } from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Progress"
} satisfies Meta;

export function Base() {
    return <Progress aria-label="Progress" />;
}

export function Value() {
    return (
        <Progress
            value={50}
            aria-label="Progress"
        />
    );
}

export function Size() {
    return (
        <VStack>
            <Progress
                size={"sm"}
                aria-label="Progress"
            />
            <Progress
                size={"md"}
                aria-label="Progress"
            />
            <Progress
                size={"lg"}
                aria-label="Progress"
            />
        </VStack>
    );
}

export function Color() {
    return (
        <VStack gap={5}>
            <Progress
                scheme="primary"
                value={50}
                aria-label="Progress"
            />
            <Progress
                scheme="secondary"
                value={50}
                aria-label="Progress"
            />
            <Progress
                scheme="success"
                value={50}
                aria-label="Progress"
            />
            <Progress
                scheme="warning"
                value={50}
                aria-label="Progress"
            />
            <Progress
                scheme="error"
                value={50}
                aria-label="Progress"
            />
            <Progress
                scheme="info"
                value={50}
                aria-label="Progress"
            />
        </VStack>
    );
}

export function Indeterminate() {
    return (
        <Progress
            isIndeterminate
            aria-label="Progress"
        />
    );
}

export function Speed() {
    return (
        <Progress
            isIndeterminate
            speed="0.4s"
            aria-label="Progress"
        />
    );
}
