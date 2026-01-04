import { Flex } from "@/ui";
import { VStack } from "@/ui";
import { Tabs } from "@/ui";
import { Text } from "@/ui";
import React, { useState } from "react";
import { capitalize } from "~/src/functions/string";

export function VariantTabs() {
    return (
        <VStack gap={6}>
            <Flex
                col
                gap={2}
            >
                {(["filled", "underline", "filled-simple"] as const).map((variant) => (
                    <React.Fragment key={variant}>
                        <Text bold>{capitalize(variant)} Variant</Text>
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
                    </React.Fragment>
                ))}
            </Flex>
        </VStack>
    );
}

export function ControlledTabs() {
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
