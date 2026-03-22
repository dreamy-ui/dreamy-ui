import { Flex, HStack, Tabs, Text, VStack } from "@/ui";
import React, { useState } from "react";
import { LuBot, LuHouse, LuLayoutDashboard, LuSettings, LuShield, LuUser } from "react-icons/lu";
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
                                <Tabs.Tab>
                                    <HStack gap={1.5}>
                                        <LuHouse />
                                        Home
                                    </HStack>
                                </Tabs.Tab>
                                <Tabs.Tab>
                                    <HStack gap={1.5}>
                                        <LuSettings />
                                        Settings
                                    </HStack>
                                </Tabs.Tab>
                                <Tabs.Tab>
                                    <HStack gap={1.5}>
                                        <LuUser />
                                        Profile
                                    </HStack>
                                </Tabs.Tab>
                            </Tabs.List>
                            <Tabs.Panels>
                                <Tabs.Panel>Home content</Tabs.Panel>
                                <Tabs.Panel>Settings content</Tabs.Panel>
                                <Tabs.Panel>Profile content</Tabs.Panel>
                            </Tabs.Panels>
                        </Tabs.Root>
                    </React.Fragment>
                ))}
            </Flex>
        </VStack>
    );
}

export function ControlledTabs() {
    const [index, setIndex] = useState(0);

    const tabs = ["Dashboard", "AI Chat", "Security"];

    return (
        <>
            <Text bold>Current Tab: {tabs[index]}</Text>

            <Tabs.Root
                index={index}
                onChange={setIndex}
            >
                <Tabs.List>
                    <Tabs.Tab>
                        <HStack gap={1.5}>
                            <LuLayoutDashboard />
                            Dashboard
                        </HStack>
                    </Tabs.Tab>
                    <Tabs.Tab>
                        <HStack gap={1.5}>
                            <LuBot />
                            AI Chat
                        </HStack>
                    </Tabs.Tab>
                    <Tabs.Tab>
                        <HStack gap={1.5}>
                            <LuShield />
                            Security
                        </HStack>
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                    <Tabs.Panel>Dashboard content</Tabs.Panel>
                    <Tabs.Panel>AI Chat content</Tabs.Panel>
                    <Tabs.Panel>Security content</Tabs.Panel>
                </Tabs.Panels>
            </Tabs.Root>
        </>
    );
}

export function SizeTabs() {
    return (
        <VStack gap={6}>
            <Flex
                col
                gap={2}
            >
                {(["sm", "md", "lg"] as const).map((size) => (
                    <React.Fragment key={size}>
                        <Text bold>{size.toUpperCase()} Size</Text>
                        <Tabs.Root size={size}>
                            <Tabs.List>
                                <Tabs.Tab>
                                    <HStack gap={1.5}>
                                        <LuHouse />
                                        Home
                                    </HStack>
                                </Tabs.Tab>
                                <Tabs.Tab>
                                    <HStack gap={1.5}>
                                        <LuSettings />
                                        Settings
                                    </HStack>
                                </Tabs.Tab>
                                <Tabs.Tab>
                                    <HStack gap={1.5}>
                                        <LuUser />
                                        Profile
                                    </HStack>
                                </Tabs.Tab>
                            </Tabs.List>
                            <Tabs.Panels>
                                <Tabs.Panel>Home content</Tabs.Panel>
                                <Tabs.Panel>Settings content</Tabs.Panel>
                                <Tabs.Panel>Profile content</Tabs.Panel>
                            </Tabs.Panels>
                        </Tabs.Root>
                    </React.Fragment>
                ))}
            </Flex>
        </VStack>
    );
}
