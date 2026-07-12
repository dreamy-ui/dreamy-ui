import { Progress, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Progress"
} satisfies Meta;

export function Base() {
    return (
        <Progress
            aria-label="Progress"
            value={50}
        />
    );
}

export function Sizes() {
    return (
        <VStack
            gap={5}
            w="full"
        >
            <Progress
                aria-label="Progress"
                size="sm"
                value={50}
            />
            <Progress
                aria-label="Progress"
                size="md"
                value={50}
            />
            <Progress
                aria-label="Progress"
                size="lg"
                value={50}
            />
        </VStack>
    );
}

export function Scheme() {
    return (
        <VStack
            full
            gap={5}
        >
            <Progress
                aria-label="Progress"
                scheme="primary"
                value={50}
            />
            <Progress
                aria-label="Progress"
                scheme="secondary"
                value={50}
            />
            <Progress
                aria-label="Progress"
                scheme="success"
                value={50}
            />
            <Progress
                aria-label="Progress"
                scheme="warning"
                value={50}
            />
            <Progress
                aria-label="Progress"
                scheme="error"
                value={50}
            />
            <Progress
                aria-label="Progress"
                scheme="info"
                value={50}
            />
            <Progress
                aria-label="Progress"
                scheme="none"
                value={50}
            />
        </VStack>
    );
}

export function IndeterminateProgress() {
    return (
        <Progress
            aria-label="Progress"
            isIndeterminate
            speed="0.8s"
        />
    );
}
