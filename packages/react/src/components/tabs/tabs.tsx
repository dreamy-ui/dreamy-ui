"use client";

import { createStyleContext } from "@/components/style-context";
import { TabBase } from "@/components/tabs/tab";
import { TabIndicatorBase } from "@/components/tabs/tab-indicator";
import { TabListBase } from "@/components/tabs/tab-list";
import { TabPanelBase } from "@/components/tabs/tab-panel";
import { TabPanelsBase } from "@/components/tabs/tab-panels";
import { TabsRoot } from "@/components/tabs/tabs-root";
import { tabs } from "@dreamy-ui/system/recipes";

const { withProvider, withContext } = createStyleContext(tabs, (prop) => prop === "orientation");

/**
 * Tabs component.
 *
 * @See Docs https://dream-ui.com/docs/components/tabs
 */
export const Tabs = withProvider(TabsRoot, "root");
export const TabList = withContext(TabListBase, "tabList");
export const Tab = withContext(TabBase, "tab");
export const TabPanels = withContext(TabPanelsBase, "tabPanels");
export const TabPanel = withContext(TabPanelBase, "tabPanel");

/**
 * Used inside Tab components
 * @internal
 */
export const TabIndicator = withContext(TabIndicatorBase, "tabIndicator");
