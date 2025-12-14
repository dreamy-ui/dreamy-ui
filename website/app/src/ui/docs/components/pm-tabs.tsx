import { Box } from "@/box";
import { Button } from "@/button";
import { Flex } from "@/flex";
import { Icon } from "@/icon";
import { IconButton } from "@/icon-button";
import { DarkTheme } from "@/theme";
import { useClipboard } from "@dreamy-ui/react";
import { Children, type ReactElement, type ReactNode, isValidElement, useMemo } from "react";
import { FaTerminal } from "react-icons/fa";
import { LuCheck, LuCopy } from "react-icons/lu";
import { type PM, useGlobalContext } from "../../global/GlobalContext";

export interface PMTabsOptionProps {
    name: "npm" | "pnpm" | "yarn" | "bun" | (string & {});
    children: ReactNode;
}

function Option(_props: PMTabsOptionProps) {
    return null;
}

export const PMTabs = Object.assign(
    function PMTabs({ children }: { children: ReactNode }) {
        const { pm, updatePm } = useGlobalContext();

        const options = useMemo(() => {
            return Children.toArray(children)
                .map((child) => {
                    if (!isValidElement(child)) return null;
                    const name = (child as ReactElement<PMTabsOptionProps>).props?.name as
                        | PMTabsOptionProps["name"]
                        | undefined;
                    if (!name) return null;
                    const content = (child as ReactElement<PMTabsOptionProps>).props
                        ?.children as ReactNode;
                    return { name, content };
                })
                .filter(Boolean) as Array<{ name: string; content: ReactNode }>;
        }, [children]);

        const { copy, copied, reset } = useClipboard();

        return (
            <DarkTheme full>
                <Flex
                    bg={"#1a1a1a"}
                    col
                    full
                    rounded={"l3"}
                >
                    <Flex
                        align={"center"}
                        aria-label="Package manager"
                        borderBottom={"1px solid"}
                        borderBottomColor={"whiteAlpha.300!"}
                        gap={2}
                        justify={"space-between"}
                        px={4}
                        py={2}
                        role="tablist"
                    >
                        <Flex
                            align={"center"}
                            gap={2}
                        >
                            <Icon
                                as={FaTerminal}
                                boxSize={"4"}
                                color={"fg.medium"}
                            />

                            {options.map((o) => (
                                <Button
                                    _hover={{
                                        color: "fg"
                                    }}
                                    color={pm === o.name ? "fg" : "fg.medium"}
                                    fontWeight={"medium"}
                                    key={o.name}
                                    onClick={() => {
                                        updatePm(o.name as PM);
                                        reset();
                                    }}
                                    px={2}
                                    py={1}
                                    size={"sm"}
                                    variant={"link"}
                                >
                                    {o.name}
                                </Button>
                            ))}
                        </Flex>

                        <IconButton
                            _hover={{
                                color: "fg"
                            }}
                            aria-label="Copy"
                            color={"fg.medium"}
                            icon={
                                <Icon
                                    as={copied ? LuCheck : LuCopy}
                                    boxSize={"4"}
                                />
                            }
                            onClick={() => {
                                copy(options.find((o) => o.name === pm)?.content as string);
                            }}
                            p={2}
                            variant={"link"}
                        />
                    </Flex>

                    <Flex
                        px={4}
                        py={4}
                    >
                        {options.map((o) => (
                            <Flex
                                aria-hidden={pm !== o.name}
                                color={"fg.medium"}
                                display={pm === o.name ? "flex" : "none"}
                                key={o.name}
                                role="tabpanel"
                            >
                                <Box
                                    as={"pre"}
                                    m={0}
                                    p={0}
                                    whiteSpace={"pre-wrap"}
                                >
                                    <code>{o.content}</code>
                                </Box>
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
            </DarkTheme>
        );
    },
    { Option }
);
