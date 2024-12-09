import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Tabs"
} satisfies Meta;

export function Base() {
    return (
        <Tabs>
            <TabList>
                <Tab>Tab 1</Tab>
                <Tab>Tab 2</Tab>
                <Tab>Tab 3</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <p>Tab 1</p>
                </TabPanel>
                <TabPanel>
                    <p>Tab 2</p>
                </TabPanel>
                <TabPanel>
                    <p>Tab 3</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}

export function Variants() {
    return (
        <>
            <Tabs variant="filled">
                <TabList>
                    <Tab>Tab 1</Tab>
                    <Tab>Tab 2</Tab>
                    <Tab>Tab 3</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <p>Tab 1</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Tab 2</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Tab 3</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Tabs variant="underline">
                <TabList>
                    <Tab>Tab 1</Tab>
                    <Tab>Tab 2</Tab>
                    <Tab>Tab 3</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <p>Tab 1</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Tab 2</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Tab 3</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Tabs variant="filled-simple">
                <TabList>
                    <Tab>Tab 1</Tab>
                    <Tab>Tab 2</Tab>
                    <Tab>Tab 3</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <p>Tab 1</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Tab 2</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Tab 3</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    );
}

export function Fitted() {
    return (
        <Tabs
            variant="underline"
            fitted
        >
            <TabList>
                <Tab>Tab 1</Tab>
                <Tab>Tab 2</Tab>
                <Tab>Tab 3</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <p>Tab 1</p>
                </TabPanel>
                <TabPanel>
                    <p>Tab 2</p>
                </TabPanel>
                <TabPanel>
                    <p>Tab 3</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}
