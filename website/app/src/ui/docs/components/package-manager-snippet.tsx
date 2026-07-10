import { Button, Snippet } from "@/ui";
import { useState } from "react";

const commands = {
    npm: "npx dreamy init",
    pnpm: "pnpm dlx dreamy init",
    yarn: "yarn dlx dreamy init",
    bun: "bunx dreamy init"
} as const;

type PM = keyof typeof commands;

export function PackageManagerSnippet() {
    const [pm, setPm] = useState<PM>("pnpm");
    const command = commands[pm];

    return (
        <Snippet.Root w="full">
            <Snippet.Header>
                {(Object.keys(commands) as PM[]).map((name) => (
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
            <Snippet.Body codeString={command}>{command}</Snippet.Body>
        </Snippet.Root>
    );
}
