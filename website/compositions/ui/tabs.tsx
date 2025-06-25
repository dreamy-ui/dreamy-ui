"use client";

import {
    type ButtonProps,
    TabsDescendantsProvider,
    TabsProvider,
    type UseTabListProps,
    type UseTabOptions,
    type UseTabsProps,
    useCanUseDOM,
    useDefaultTransition,
    useTab,
    useTabList,
    useTabPanel,
    useTabPanels,
    useTabs,
    useTabsContext
} from "@dreamy-ui/react";
import { forwardRef } from "react";
import { tabs } from "styled-system/recipes";
import { Box } from "./box";
import { Button } from "./button";
import type { HTMLDreamyProps } from "./factory";
import { Flex, type FlexProps } from "./flex";
import { MotionFlex, type MotionFlexProps } from "./motion";
import { createStyleContext } from "./style-context";

const { withProvider, withContext } = createStyleContext(tabs, (prop) => prop === "orientation");

export interface TabsProps
    extends UseTabsProps,
        Omit<HTMLDreamyProps<"div">, "onChange" | "direction"> {
    children: React.ReactNode;
}

/**
 * Tabs component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/tabs
 */
export const Tabs = withProvider(
    forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, ref) {
        const { children, ...rest } = props;

        const { htmlProps, descendants, ...ctx } = useTabs(rest);

        return (
            <TabsDescendantsProvider value={descendants}>
                <TabsProvider value={ctx}>
                    <Box
                        ref={ref}
                        {...htmlProps}
                    >
                        {children}
                    </Box>
                </TabsProvider>
            </TabsDescendantsProvider>
        );
    }),
    "root"
);

export interface TabListProps extends UseTabListProps, Omit<FlexProps, "onKeyDown" | "ref"> {}

export const TabList = withContext(
    forwardRef<HTMLDivElement, TabListProps>(function TabList(props, ref) {
        const tablistProps = useTabList({ ...props, ref });

        return <Flex {...tablistProps} />;
    }),
    "tabList"
);

export interface TabProps extends UseTabOptions, ButtonProps {}

export const Tab = withContext(
    forwardRef<HTMLButtonElement, TabProps>(function Tab(props, ref) {
        const { children, ...rest } = props;

        const { isSelected, props: tabProps } = useTab({ ...rest, ref });

        return (
            <Button
                size={"sm"}
                variant={"ghost"}
                disableRipple
                {...tabProps}
            >
                {children}
                {isSelected && <TabIndicator />}
            </Button>
        );
    }),
    "tab"
);

export interface TabPanelsProps extends FlexProps {}

export const TabPanels = withContext(
    forwardRef<HTMLDivElement, TabPanelsProps>(function TabPanels(props, ref) {
        const panelsProps = useTabPanels(props);

        return (
            <Flex
                {...panelsProps}
                ref={ref}
            />
        );
    }),
    "tabPanels"
);

export interface TabPanelProps extends HTMLDreamyProps<"div"> {}

export const TabPanel = withContext(
    forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(props, ref) {
        const panelProps = useTabPanel({ ...props, ref });

        return (
            <Flex
                {...panelProps}
                ref={ref}
            />
        );
    }),
    "tabPanel"
);

export interface TabIndicatorProps extends MotionFlexProps {}

/**
 * Used inside Tab components
 * @internal
 */
const TabIndicator = withContext(
    forwardRef<HTMLDivElement, TabIndicatorProps>(function TabIndicator(props, ref) {
        const { id } = useTabsContext();
        const transition = useDefaultTransition();
        const domAvailable = useCanUseDOM();

        return (
            <MotionFlex
                ref={ref}
                {...props}
                layout
                layoutId={`${id}-indicator`}
                layoutDependency={false}
                transition={{
                    ...transition,
                    duration: ((transition as any)?.duration ?? 0.2) * 1.5
                }}
                initial={!domAvailable ? { opacity: 0, scale: 0.95 } : undefined}
                animate={{ opacity: 1, scale: 1 }}
                rounded={"inherit"}
            />
        );
    }),
    "tabIndicator"
);
