import { Snippet, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Snippet"
} satisfies Meta;

export function Base() {
    return <Snippet w="full">pnpm dlx dreamy add --all</Snippet>;
}

export function Variants() {
    return (
        <VStack w="full">
            <Snippet
                variant="bordered"
                w="full"
            >
                pnpm dlx dreamy add --all
            </Snippet>
            <Snippet
                variant="solid"
                w="full"
            >
                pnpm dlx dreamy add --all
            </Snippet>
        </VStack>
    );
}

export function Sizes() {
    return (
        <VStack w="full">
            <Snippet
                size="sm"
                w="full"
            >
                pnpm dlx dreamy add --all
            </Snippet>
            <Snippet
                size="md"
                w="full"
            >
                pnpm dlx dreamy add --all
            </Snippet>
            <Snippet
                size="lg"
                w="full"
            >
                pnpm dlx dreamy add --all
            </Snippet>
        </VStack>
    );
}

export function Schemes() {
    return (
        <VStack w="full">
            {["primary", "secondary", "success", "warning", "info", "error", "none"].map(
                (scheme) => (
                    <Snippet
                        key={scheme}
                        scheme={scheme as any}
                        w="full"
                    >
                        pnpm dlx dreamy add --all
                    </Snippet>
                )
            )}
        </VStack>
    );
}

export function DisableTooltip() {
    return (
        <Snippet
            disableTooltip
            w="full"
        >
            pnpm dlx dreamy add --all
        </Snippet>
    );
}
