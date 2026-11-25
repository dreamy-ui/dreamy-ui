import { Button, HStack, Progress, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

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

export function WithLabelAndFormat() {
    return (
        <VStack
            align="stretch"
            gap={5}
            maxW="md"
            w="full"
        >
            <Progress
                label="Exporting video"
                showValue
                value={60}
            />
            <Progress
                format={{ style: "unit", unit: "gigabyte" }}
                label="Download"
                max={250}
                showValue
                value={120}
            />
            <Progress
                format={{ style: "percent", maximumFractionDigits: 1 }}
                label="Video render"
                showValue
                value={87.25}
            />
            <Progress
                format={(minutes: number) => `${60 - minutes} min left`}
                label="Backup"
                max={60}
                showValue
                value={45}
            />
            <Progress
                label="Synchronisierung"
                locale="de-DE"
                showValue
                value={40}
            />
        </VStack>
    );
}

export function ValueLabelAndInteractive() {
    const total = 5;
    const [uploaded, setUploaded] = useState(1);

    return (
        <VStack
            align="stretch"
            gap={4}
            maxW="md"
            w="full"
        >
            <HStack gap={2}>
                <Button
                    disabled={uploaded >= total}
                    onClick={() => setUploaded((n) => Math.min(total, n + 1))}
                    size="xs"
                >
                    Upload Next
                </Button>
                <Button
                    onClick={() => setUploaded(0)}
                    size="xs"
                    variant="outline"
                >
                    Reset
                </Button>
            </HStack>
            <Progress
                label="Uploading photos"
                showValue
                value={(uploaded / total) * 100}
            />
            <Progress
                getValueLabel={(value, details) =>
                    `${value} of ${details.max} files, ${details.formatted}`
                }
                label="Copying files"
                max={12}
                showValue
                value={3}
                valueLabel="3 of 12"
            />
        </VStack>
    );
}
