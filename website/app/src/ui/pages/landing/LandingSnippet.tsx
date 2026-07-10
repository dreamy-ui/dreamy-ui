"use client";

import { Button, Snippet } from "@/ui";
import { useSnippetContext } from "@dreamy-ui/react";
import { type PM, useGlobalContext } from "../../global/GlobalContext";

const commands = {
    npm: "npx dreamy init",
    pnpm: "pnpm dlx dreamy init",
    yarn: "yarn dlx dreamy init",
    bun: "bunx dreamy init"
} as const;

function PackageManagerTabs() {
    const { pm, updatePm } = useGlobalContext();
    const { resetCopied } = useSnippetContext();

    return (
        <>
            {(Object.keys(commands) as PM[]).map((name) => (
                <Button
                    color={pm === name ? "fg" : "fg.medium"}
                    fontWeight={"medium"}
                    key={name}
                    onClick={() => {
                        updatePm(name);
                        resetCopied();
                    }}
                    px={2}
                    py={1}
                    size={"sm"}
                    variant={"link"}
                >
                    {name}
                </Button>
            ))}
        </>
    );
}

export function LandingSnippet() {
    const { pm } = useGlobalContext();
    const command = commands[pm];

    return (
        <Snippet.Root w="full">
            <Snippet.Header aria-label="Package manager">
                <PackageManagerTabs />
            </Snippet.Header>
            <Snippet.Body codeString={command}>{command}</Snippet.Body>
        </Snippet.Root>
    );
}
