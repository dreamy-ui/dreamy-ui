import { Flex } from "@/flex";
import { VStack } from "@/stack";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@/tabs";
import { Text } from "@/text";
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
                        <Tabs variant={variant}>
                            <TabList>
                                <Tab>Tab 1</Tab>
                                <Tab>Tab 2</Tab>
                                <Tab>Tab 3</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <p>Tab 1 content</p>
                                </TabPanel>
                                <TabPanel>
                                    <p>Tab 2 content</p>
                                </TabPanel>
                                <TabPanel>
                                    <p>Tab 3 content</p>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
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

            <Tabs
                index={index}
                onChange={setIndex}
            >
                <TabList>
                    <Tab>Tab 1</Tab>
                    <Tab>Tab 2</Tab>
                    <Tab>Tab 3</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <p>Tab 1 content</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Tab 2 content</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Tab 3 content</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    );
}
