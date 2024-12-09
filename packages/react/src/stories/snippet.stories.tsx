import { Snippet, VStack } from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Snippet"
} satisfies Meta;

export function Base() {
    return (
        <VStack>
            <Snippet>pnpm i @dreamy-ui/react @dreamy-ui/system</Snippet>
        </VStack>
    );
}

export function MultiLine() {
    return (
        <Snippet>
            <span>pnpm i @dreamy-ui/system</span>
            <span>pnpm i @dreamy-ui/react</span>
        </Snippet>
    );
}

export function Variant() {
    return (
        <VStack>
            <Snippet variant="solid">pnpm i @dreamy-ui/react @dreamy-ui/system</Snippet>
            <Snippet variant="bordered">pnpm i @dreamy-ui/react @dreamy-ui/system</Snippet>
        </VStack>
    );
}

export function Size() {
    return (
        <VStack>
            <Snippet size="sm">pnpm i @dreamy-ui/react @dreamy-ui/system</Snippet>
            <Snippet size="md">pnpm i @dreamy-ui/react @dreamy-ui/system</Snippet>
            <Snippet size="lg">pnpm i @dreamy-ui/react @dreamy-ui/system</Snippet>
        </VStack>
    );
}

export function Scheme() {
    return (
        <VStack>
            <Snippet scheme="primary">pnpm i @dreamy-ui/react @dreamy-ui/system</Snippet>
            <Snippet scheme="secondary">pnpm i @dreamy-ui/react @dreamy-ui/system</Snippet>
            <Snippet scheme="success">pnpm i @dreamy-ui/react @dreamy-ui/system</Snippet>
            <Snippet scheme="warning">pnpm i @dreamy-ui/react @dreamy-ui/system</Snippet>
            <Snippet scheme="error">pnpm i @dreamy-ui/react @dreamy-ui/system</Snippet>
            <Snippet scheme="info">pnpm i @dreamy-ui/react @dreamy-ui/system</Snippet>
        </VStack>
    );
}
