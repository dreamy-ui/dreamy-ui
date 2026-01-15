import { Box, Flex, Tabs, Text } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Tabs"
} satisfies Meta;

export function Base() {
    return (
        <Tabs.Root>
            <Tabs.List>
                <Tabs.Tab>Tab 1</Tabs.Tab>
                <Tabs.Tab>Tab 2</Tabs.Tab>
                <Tabs.Tab>Tab 3</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
                <Tabs.Panel>
                    <p>Tab 1</p>
                </Tabs.Panel>
                <Tabs.Panel>
                    <p>Tab 2</p>
                </Tabs.Panel>
                <Tabs.Panel>
                    <p>Tab 3</p>
                </Tabs.Panel>
            </Tabs.Panels>
        </Tabs.Root>
    );
}

export function Variants() {
    return (
        <Flex
            col
            gap={6}
        >
            {(["filled", "underline", "filled-simple"] as const).map((variant) => (
                <Flex
                    col
                    gap={2}
                    key={variant}
                >
                    <Text bold>{variant.charAt(0).toUpperCase() + variant.slice(1)} Variant</Text>
                    <Tabs.Root variant={variant}>
                        <Tabs.List>
                            <Tabs.Tab>Tab 1</Tabs.Tab>
                            <Tabs.Tab>Tab 2</Tabs.Tab>
                            <Tabs.Tab>Tab 3</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panels>
                            <Tabs.Panel>
                                <p>Tab 1 content</p>
                            </Tabs.Panel>
                            <Tabs.Panel>
                                <p>Tab 2 content</p>
                            </Tabs.Panel>
                            <Tabs.Panel>
                                <p>Tab 3 content</p>
                            </Tabs.Panel>
                        </Tabs.Panels>
                    </Tabs.Root>
                </Flex>
            ))}
        </Flex>
    );
}

export function Fitted() {
    return (
        <Tabs.Root fitted>
            <Tabs.List>
                <Tabs.Tab>Tab 1</Tabs.Tab>
                <Tabs.Tab>Tab 2</Tabs.Tab>
                <Tabs.Tab>Tab 3</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
                <Tabs.Panel>
                    <p>Tab 1</p>
                </Tabs.Panel>
                <Tabs.Panel>
                    <p>Tab 2</p>
                </Tabs.Panel>
                <Tabs.Panel>
                    <p>Tab 3</p>
                </Tabs.Panel>
            </Tabs.Panels>
        </Tabs.Root>
    );
}

export function Controlled() {
    const [index, setIndex] = useState(2);

    return (
        <>
            <Text bold>Current Tab: {index + 1}</Text>

            <Tabs.Root
                index={index}
                onChange={setIndex}
            >
                <Tabs.List>
                    <Tabs.Tab>Tab 1</Tabs.Tab>
                    <Tabs.Tab>Tab 2</Tabs.Tab>
                    <Tabs.Tab>Tab 3</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                    <Tabs.Panel>
                        <p>Tab 1 content</p>
                    </Tabs.Panel>
                    <Tabs.Panel>
                        <p>Tab 2 content</p>
                    </Tabs.Panel>
                    <Tabs.Panel>
                        <p>Tab 3 content</p>
                    </Tabs.Panel>
                </Tabs.Panels>
            </Tabs.Root>
        </>
    );
}

export function LazyMount() {
    return (
        <Tabs.Root isLazy>
            <Tabs.List>
                <Tabs.Tab>Tab 1</Tabs.Tab>
                <Tabs.Tab>Tab 2</Tabs.Tab>
                <Tabs.Tab>Tab 3</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
                <Tabs.Panel>
                    <p>Tab 1</p>
                </Tabs.Panel>
                <Tabs.Panel>
                    <p>Tab 2</p>
                </Tabs.Panel>
                <Tabs.Panel>
                    <p>Tab 3</p>
                </Tabs.Panel>
            </Tabs.Panels>
        </Tabs.Root>
    );
}

export function Overflow() {
    return (
        <Box
            maxW="xs"
            w="xs"
        >
            <Tabs.Root>
                <Tabs.List overflowX="scroll">
                    <Tabs.Tab>Tab 1</Tabs.Tab>
                    <Tabs.Tab>Tab 2</Tabs.Tab>
                    <Tabs.Tab>Tab 3</Tabs.Tab>
                    <Tabs.Tab>Tab 4</Tabs.Tab>
                    <Tabs.Tab>Tab 5</Tabs.Tab>
                    <Tabs.Tab>Tab 6</Tabs.Tab>
                    <Tabs.Tab>Tab 7</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                    <Tabs.Panel>1</Tabs.Panel>
                    <Tabs.Panel>2</Tabs.Panel>
                    <Tabs.Panel>3</Tabs.Panel>
                    <Tabs.Panel>4</Tabs.Panel>
                    <Tabs.Panel>5</Tabs.Panel>
                    <Tabs.Panel>6</Tabs.Panel>
                    <Tabs.Panel>7</Tabs.Panel>
                </Tabs.Panels>
            </Tabs.Root>
        </Box>
    );
}
