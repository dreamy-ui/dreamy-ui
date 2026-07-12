import { Flex, ProgressCircular } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Progress Circular"
} satisfies Meta;

export function Base() {
    return <ProgressCircular value={69} />;
}

export function Sizes() {
    return (
        <Flex
            col
            gap={5}
        >
            <ProgressCircular
                size="xs"
                value={69}
            />
            <ProgressCircular
                size="sm"
                value={69}
            />
            <ProgressCircular
                size="md"
                value={69}
            />
            <ProgressCircular
                size="lg"
                value={69}
            />
            <ProgressCircular
                size="xl"
                value={69}
            />
        </Flex>
    );
}

export function Schemes() {
    return (
        <Flex
            col
            gap={5}
        >
            <ProgressCircular
                scheme="primary"
                value={21}
            />
            <ProgressCircular
                scheme="secondary"
                value={37}
            />
            <ProgressCircular
                scheme="success"
                value={42}
            />
            <ProgressCircular
                scheme="warning"
                value={10}
            />
            <ProgressCircular
                scheme="error"
                value={100}
            />
            <ProgressCircular
                scheme="info"
                value={50}
            />
        </Flex>
    );
}

export function IndeterminateProgress() {
    return <ProgressCircular isIndeterminate />;
}

export function ShowValueLabel() {
    return (
        <Flex
            col
            gap={5}
        >
            <ProgressCircular
                showValueLabel
                value={69}
            />
            <ProgressCircular
                showValueLabel
                value={69}
                valueLabel="0"
            />
            <ProgressCircular
                formatOptions={{ style: "currency", currency: "USD" }}
                showValueLabel
                value={69}
            />
        </Flex>
    );
}

export function Label() {
    return (
        <ProgressCircular
            label="Downloading..."
            value={69}
        />
    );
}

export function MinAndMaxValue() {
    return (
        <ProgressCircular
            maxValue={37}
            minValue={21}
            value={29}
        />
    );
}
