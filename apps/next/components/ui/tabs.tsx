"use client";

import {
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
import { type HTMLDreamyProps, createStyleContext } from "styled-system/jsx";
import { tabs } from "styled-system/recipes";
import { Box } from "./box";
import { Button, type ButtonProps } from "./button";
import { Flex, type FlexProps } from "./flex";
import { MotionFlex, type MotionFlexProps } from "./motion";

const { withProvider, withContext } = createStyleContext(tabs);

export interface TabsProps
    extends UseTabsProps,
        Omit<HTMLDreamyProps<"div">, "onChange" | "direction"> {
    children: React.ReactNode;
}

/**
 * Tabs component
 *
 * @See Docs https://dreamy-ui.com/docs/components/tabs
 */
export const Root = withProvider(
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

export const List = withContext(
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
                disableRipple
                size={"sm"}
                variant={"ghost"}
                {...tabProps}
            >
                {children}
                {isSelected && <Indicator />}
            </Button>
        );
    }),
    "tab"
);

export interface TabPanelsProps extends FlexProps {}

export const Panels = withContext(
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

export const Panel = withContext(
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
const Indicator = withContext(
    forwardRef<HTMLDivElement, TabIndicatorProps>(function TabIndicator(props, ref) {
        const { id } = useTabsContext();
        const transition = useDefaultTransition();
        const domAvailable = useCanUseDOM();

        return (
            <MotionFlex
                ref={ref}
                {...props}
                animate={{ opacity: 1, scale: 1 }}
                initial={!domAvailable ? { opacity: 0, scale: 0.95 } : undefined}
                layout
                layoutDependency={false}
                layoutId={`${id}-indicator`}
                rounded={"inherit"}
                transition={{
                    ...transition,
                    duration: (transition?.duration ?? 0.2) * 1.5
                }}
            />
        );
    }),
    "tabIndicator"
);
