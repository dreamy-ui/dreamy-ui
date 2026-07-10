import { Button, Snippet, VStack } from "@/ui";
import { useState } from "react";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Snippet"
} satisfies Meta;

export function Base() {
    return (
        <Snippet.Root w="full">
            <Snippet.Header />
            <Snippet.Body>pnpm dlx dreamy add --all</Snippet.Body>
        </Snippet.Root>
    );
}

export function HeaderChildren() {
    const [pm, setPm] = useState<"npm" | "pnpm" | "yarn" | "bun">("pnpm");
    const commands = {
        npm: "npx dreamy init",
        pnpm: "pnpm dlx dreamy init",
        yarn: "yarn dlx dreamy init",
        bun: "bunx dreamy init"
    };

    return (
        <Snippet.Root w="full">
            <Snippet.Header>
                {(["npm", "pnpm", "yarn", "bun"] as const).map((name) => (
                    <Button
                        color={pm === name ? "fg" : "fg.medium"}
                        fontWeight={"medium"}
                        key={name}
                        onClick={() => setPm(name)}
                        px={2}
                        py={1}
                        size={"sm"}
                        variant={"link"}
                    >
                        {name}
                    </Button>
                ))}
            </Snippet.Header>
            <Snippet.Body codeString={commands[pm]}>{commands[pm]}</Snippet.Body>
        </Snippet.Root>
    );
}

export function Sizes() {
    return (
        <VStack w="full">
            <Snippet.Root
                size="sm"
                w="full"
            >
                <Snippet.Header />
                <Snippet.Body>pnpm dlx dreamy add --all</Snippet.Body>
            </Snippet.Root>
            <Snippet.Root
                size="md"
                w="full"
            >
                <Snippet.Header />
                <Snippet.Body>pnpm dlx dreamy add --all</Snippet.Body>
            </Snippet.Root>
            <Snippet.Root
                size="lg"
                w="full"
            >
                <Snippet.Header />
                <Snippet.Body>pnpm dlx dreamy add --all</Snippet.Body>
            </Snippet.Root>
        </VStack>
    );
}

export function HideCopyButton() {
    return (
        <Snippet.Root w="full">
            <Snippet.Header hideCopyButton />
            <Snippet.Body>pnpm dlx dreamy add --all</Snippet.Body>
        </Snippet.Root>
    );
}
