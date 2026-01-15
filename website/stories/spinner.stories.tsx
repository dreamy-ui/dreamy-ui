import { Flex, Spinner } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Spinner"
} satisfies Meta;

export function Base() {
    return <Spinner />;
}

export function Sizes() {
    return (
        <Flex
            alignItems="center"
            gap={4}
            wrapped
        >
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
        </Flex>
    );
}

export function WithLabel() {
    return <Spinner label="Loading..." />;
}

export function Speed() {
    return (
        <Flex
            alignItems="center"
            gap={4}
            wrapped
        >
            <Spinner
                label="Fast"
                speed="0.5s"
            />
            <Spinner
                label="Default"
                speed="0.8s"
            />
            <Spinner
                label="Slow"
                speed="1.5s"
            />
        </Flex>
    );
}

export function Color() {
    return (
        <Flex
            alignItems="center"
            gap={4}
            wrapped
        >
            <Spinner color="primary" />
            <Spinner color="success" />
            <Spinner color="warning" />
            <Spinner color="error" />
        </Flex>
    );
}

export function LabelStyling() {
    return (
        <Flex
            alignItems="center"
            gap={4}
            wrapped
        >
            <Spinner
                label="Custom Label"
                labelProps={{
                    color: "primary",
                    fontSize: "md"
                }}
            />
            <Spinner
                css={{
                    "& [data-part=label]": {
                        color: "success",
                        fontWeight: "bold"
                    }
                }}
                label="Styled Label"
            />
        </Flex>
    );
}
