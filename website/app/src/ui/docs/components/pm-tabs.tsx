"use client";

import { Button, Snippet } from "@/ui";
import { useSnippetContext } from "@dreamy-ui/react";
import { Children, type ReactElement, type ReactNode, isValidElement, useMemo } from "react";
import { type PM, useGlobalContext } from "../../global/GlobalContext";

export interface PMTabsOptionProps {
    name: "npm" | "pnpm" | "yarn" | "bun" | (string & {});
    children: ReactNode;
}

function Option(_props: PMTabsOptionProps) {
    return null;
}

interface PMTabButtonsProps {
    options: Array<{ name: string; content: ReactNode }>;
}

function PMTabButtons({ options }: PMTabButtonsProps) {
    const { pm, updatePm } = useGlobalContext();
    const { resetCopied } = useSnippetContext();

    return (
        <>
            {options.map((option) => (
                <Button
                    color={pm === option.name ? "fg" : "fg.medium"}
                    fontWeight={"medium"}
                    key={option.name}
                    onClick={() => {
                        updatePm(option.name as PM);
                        resetCopied();
                    }}
                    px={2}
                    py={1}
                    size={"sm"}
                    variant={"link"}
                >
                    {option.name}
                </Button>
            ))}
        </>
    );
}

function getOptionContent(content: ReactNode): string {
    if (typeof content === "string") {
        return content;
    }

    if (typeof content === "number") {
        return String(content);
    }

    return "";
}

export const PMTabs = Object.assign(
    function PMTabs({ children }: { children: ReactNode }) {
        const { pm } = useGlobalContext();

        const options = useMemo(() => {
            return Children.toArray(children)
                .map((child) => {
                    if (!isValidElement(child)) return null;
                    const name = (child as ReactElement<PMTabsOptionProps>).props?.name;
                    if (!name) return null;
                    const content = (child as ReactElement<PMTabsOptionProps>).props?.children;
                    return { name, content };
                })
                .filter(Boolean) as Array<{ name: string; content: ReactNode }>;
        }, [children]);

        const activeOption =
            options.find((option) => option.name === pm)?.content ?? options[0]?.content;
        const codeString = getOptionContent(activeOption);

        return (
            <Snippet.Root w="full">
                <Snippet.Header aria-label="Package manager">
                    <PMTabButtons options={options} />
                </Snippet.Header>
                <Snippet.Body codeString={codeString}>{activeOption}</Snippet.Body>
            </Snippet.Root>
        );
    },
    { Option }
);
