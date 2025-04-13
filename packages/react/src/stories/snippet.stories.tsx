import { Snippet } from "@/components";
import { VStack } from "@/rsc";
import type { Meta } from "@storybook/react";

export default {
    title: "Snippet"
} satisfies Meta;

export function Base() {
    return (
        <VStack>
            <Snippet>pnpm i @dreamy-ui/react styled-system</Snippet>
        </VStack>
    );
}

export function MultiLine() {
    return (
        <Snippet>
            <span>pnpm i styled-system</span>
            <span>pnpm i @dreamy-ui/react</span>
        </Snippet>
    );
}

export function Variant() {
    return (
        <VStack>
            <Snippet variant="solid">pnpm i @dreamy-ui/react styled-system</Snippet>
            <Snippet variant="bordered">pnpm i @dreamy-ui/react styled-system</Snippet>
        </VStack>
    );
}

export function Size() {
    return (
        <VStack>
            <Snippet size="sm">pnpm i @dreamy-ui/react styled-system</Snippet>
            <Snippet size="md">pnpm i @dreamy-ui/react styled-system</Snippet>
            <Snippet size="lg">pnpm i @dreamy-ui/react styled-system</Snippet>
        </VStack>
    );
}

export function Scheme() {
    return (
        <VStack>
            <Snippet scheme="primary">pnpm i @dreamy-ui/react styled-system</Snippet>
            <Snippet scheme="secondary">pnpm i @dreamy-ui/react styled-system</Snippet>
            <Snippet scheme="success">pnpm i @dreamy-ui/react styled-system</Snippet>
            <Snippet scheme="warning">pnpm i @dreamy-ui/react styled-system</Snippet>
            <Snippet scheme="error">pnpm i @dreamy-ui/react styled-system</Snippet>
            <Snippet scheme="info">pnpm i @dreamy-ui/react styled-system</Snippet>
        </VStack>
    );
}
