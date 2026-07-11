"use client";

import {
    TabsDescendantsProvider,
    TabsProvider,
    TRANSITION_EASINGS,
    type UseTabListProps,
    type UseTabOptions,
    type UseTabsProps,
    useCanUseDOM,
    useDefaultTransition,
    useReducedMotion,
    useTab,
    useTabList,
    useTabPanel,
    useTabPanels,
    useTabs,
    useTabsContext
} from "@dreamy-ui/react";

import { type HTMLDreamyProps, createStyleContext } from "styled-system/jsx";
import { type TabsVariantProps, tabs } from "styled-system/recipes";
import { Box } from "./box";
import { Button, type ButtonProps } from "./button";
import { Flex, type FlexProps } from "./flex";
import { MotionFlex, type MotionFlexProps } from "./motion";

const { withProvider, withContext } = createStyleContext(tabs, {
    forwardVariants: ["orientation"]
});

export interface TabsProps
    extends UseTabsProps,
        Omit<HTMLDreamyProps<"div">, "onChange" | "direction">,
        TabsVariantProps {
    children: React.ReactNode;
}

/**
 * Tabs component
 *
 * @See Docs https://dreamy-ui.com/docs/components/tabs
 */
export const Root = withProvider(function Tabs(props: TabsProps) {
    const { children, ...rest } = props;

    const { htmlProps, descendants, ...ctx } = useTabs(rest);

    return (
        <TabsDescendantsProvider value={descendants}>
            <TabsProvider value={ctx}>
                <Box {...htmlProps}>{children}</Box>
            </TabsProvider>
        </TabsDescendantsProvider>
    );
}, "root");

export interface TabListProps extends UseTabListProps, Omit<FlexProps, "onKeyDown" | "ref"> {}

export const List = withContext(function TabList(props: TabListProps) {
    const { ref } = props;
    const tablistProps = useTabList({ ...props, ref });

    return <Flex {...tablistProps} />;
}, "tabList");

export interface TabProps extends UseTabOptions, ButtonProps {}

export const Tab = withContext(function Tab(props: TabProps) {
    const { ref } = props;
    const { children, ...rest } = props;

    const { isSelected, props: tabProps } = useTab({ ...rest, ref });

    return (
        <Button
            disableRipple
            size={"sm"}
            variant={"ghost"}
            {...tabProps}
        >
            {children}
            {isSelected && <Indicator />}
        </Button>
    );
}, "tab");

export interface TabPanelsProps extends FlexProps {}

export const Panels = withContext(function TabPanels(props: TabPanelsProps) {
    const panelsProps = useTabPanels(props);

    return <Flex {...panelsProps} />;
}, "tabPanels");

export interface TabPanelProps extends HTMLDreamyProps<"div"> {}

export const Panel = withContext(function TabPanel(props: TabPanelProps) {
    const { ref } = props;
    const panelProps = useTabPanel({ ...props, ref });

    return <Flex {...panelProps} />;
}, "tabPanel");

export interface TabIndicatorProps extends MotionFlexProps {}

/**
 * Used inside Tab components
 * @internal
 */
const Indicator = withContext(function TabIndicator(props: TabIndicatorProps) {
    const { id, selectedIndex } = useTabsContext();
    const transition = useDefaultTransition();
    const reduceMotion = useReducedMotion();
    const domAvailable = useCanUseDOM();

    return (
        <MotionFlex
            {...props}
            animate={{ opacity: 1, scale: 1 }}
            initial={!domAvailable ? { opacity: 0, scale: 0.95 } : undefined}
            layout={reduceMotion ? false : "position"}
            layoutDependency={selectedIndex}
            layoutId={`${id}-indicator`}
            transition={
                reduceMotion
                    ? { duration: 0 }
                    : {
                          ...transition,
                          layout: {
                              duration: (transition?.duration ?? 0.2) * 1.5,
                              ease: TRANSITION_EASINGS.easeInOut
                          }
                      }
            }
        />
    );
}, "tabIndicator");
