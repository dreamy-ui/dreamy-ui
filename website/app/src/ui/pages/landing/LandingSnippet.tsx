"use client";

import { Button, Snippet } from "@/ui";
import { useSnippetContext } from "@dreamy-ui/react";
import { type PM, useGlobalContext } from "../../global/GlobalContext";

const pmPrefixes = {
    npm: "npx dreamy",
    pnpm: "pnpm dlx dreamy",
    yarn: "yarn dlx dreamy",
    bun: "bunx dreamy"
} as const satisfies Record<PM, string>;

function PackageManagerTabs() {
    const { pm, updatePm } = useGlobalContext();
    const { resetCopied } = useSnippetContext();

    return (
        <>
            {(Object.keys(pmPrefixes) as PM[]).map((name) => (
                <Button
                    color={pm === name ? "fg" : "fg.medium"}
                    fontWeight={pm === name ? "semibold" : "medium"}
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

export interface PmCommandSnippetProps {
    commandSuffix?: string;
}

export function PmCommandSnippet({ commandSuffix = "init" }: PmCommandSnippetProps) {
    const { pm } = useGlobalContext();
    const command = `${pmPrefixes[pm]} ${commandSuffix}`;

    return (
        <Snippet.Root w="full">
            <Snippet.Header aria-label="Package manager">
                <PackageManagerTabs />
            </Snippet.Header>
            <Snippet.Body codeString={command}>{command}</Snippet.Body>
        </Snippet.Root>
    );
}

export function LandingSnippet() {
    return <PmCommandSnippet commandSuffix="init" />;
}
