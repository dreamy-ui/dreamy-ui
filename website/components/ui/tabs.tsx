"use client";

import { Tabs as ArkTabs, useTabsContext } from "@ark-ui/react/tabs";
import {
    TRANSITION_EASINGS,
    useCanUseDOM,
    useDefaultTransition,
    useReducedMotion
} from "@dreamy-ui/react";
import { Children, cloneElement, createContext, isValidElement, useContext } from "react";
import { type HTMLDreamyProps, createStyleContext } from "styled-system/jsx";
import { type TabsVariantProps, tabs } from "styled-system/recipes";
import { Box } from "./box";
import { type ButtonProps } from "./button";
import { Flex, type FlexProps } from "./flex";
import { MotionFlex, type MotionFlexProps } from "./motion";

const { withProvider, withContext } = createStyleContext(tabs, {
    forwardVariants: ["orientation"]
});

const TAB_PART = Symbol.for("dreamy.tabs.tab");
const PANEL_PART = Symbol.for("dreamy.tabs.panel");

interface TabsActivationContextValue {
    isManual: boolean;
}

const TabsActivationContext = createContext<TabsActivationContextValue>({ isManual: false });

function getIsManual(manual?: boolean, activationMode?: TabsProps["activationMode"]) {
    if (activationMode) {
        return activationMode === "manual";
    }
    return manual === true;
}

function assignIndices(children: React.ReactNode, part: symbol) {
    let index = 0;
    return Children.map(children, (child) => {
        if (!isValidElement(child)) {
            return child;
        }
        if ((child.type as { partType?: symbol }).partType === part) {
            const next = cloneElement(child, { index } as { index: number });
            index += 1;
            return next;
        }
        return child;
    });
}

export interface TabsProps
    extends Omit<React.ComponentProps<typeof ArkTabs.Root>, "activationMode">,
        TabsVariantProps {
    children: React.ReactNode;
    /**
     * When true, selection updates on Enter/Space or click, not on focus.
     * Maps to Ark `activationMode="manual"`.
     */
    manual?: boolean;
    activationMode?: React.ComponentProps<typeof ArkTabs.Root>["activationMode"];
}

function indexToValue(index: number) {
    return String(index);
}

export const Root = withProvider(function Tabs(props: TabsProps) {
    const { children, manual, activationMode, defaultValue, value, ...rest } = props;
    const isManual = getIsManual(manual, activationMode);

    return (
        <ArkTabs.Root
            activationMode={activationMode ?? (manual ? "manual" : undefined)}
            defaultValue={value === undefined ? (defaultValue ?? "0") : defaultValue}
            value={value}
            {...rest}
        >
            <TabsActivationContext.Provider value={{ isManual }}>
                <Box data-part="root">{children}</Box>
            </TabsActivationContext.Provider>
        </ArkTabs.Root>
    );
}, "root");

export interface TabListProps extends FlexProps {}

export const List = withContext(function TabList(props: TabListProps) {
    const { children, ...rest } = props;
    return (
        <ArkTabs.List {...rest}>
            {assignIndices(children, TAB_PART)}
            <TabIndicator />
        </ArkTabs.List>
    );
}, "tabList");

export interface TabProps extends ButtonProps {
    index?: number;
}

function TabComponent(props: TabProps) {
    const {
        children,
        index = 0,
        isDisabled,
        isLoading,
        onFocus,
        disableRipple: _disableRipple,
        leftIcon: _leftIcon,
        rightIcon: _rightIcon,
        loadingText: _loadingText,
        spinner: _spinner,
        spinnerPlacement: _spinnerPlacement,
        ...rest
    } = props;
    const value = indexToValue(index);
    const tabsApi = useTabsContext();
    const { isManual } = useContext(TabsActivationContext);

    function handleFocus(event: React.FocusEvent<HTMLButtonElement>) {
        onFocus?.(event);
        if (!isManual && !isDisabled && !isLoading) {
            tabsApi.setValue(value);
        }
    }

    return (
        <ArkTabs.Trigger
            disabled={isDisabled || isLoading}
            type="button"
            value={value}
            {...rest}
            onFocus={handleFocus}
        >
            {children}
        </ArkTabs.Trigger>
    );
}

export const Tab = withContext(TabComponent, "tab");
Tab.partType = TAB_PART;

export interface TabPanelsProps extends FlexProps {}

export const Panels = withContext(function TabPanels(props: TabPanelsProps) {
    const { children, ...rest } = props;
    return <Flex {...rest}>{assignIndices(children, PANEL_PART)}</Flex>;
}, "tabPanels");

export interface TabPanelProps extends HTMLDreamyProps<"div"> {
    index?: number;
}

function TabPanelComponent(props: TabPanelProps) {
    const { children, index = 0, ...rest } = props;

    return (
        <ArkTabs.Content
            value={indexToValue(index)}
            {...rest}
        >
            <Flex>{children}</Flex>
        </ArkTabs.Content>
    );
}

export const Panel = withContext(TabPanelComponent, "tabPanel");
Panel.partType = PANEL_PART;

const TabIndicator = withContext(function TabIndicator() {
    const transition = useDefaultTransition();
    const reduceMotion = useReducedMotion();
    const domAvailable = useCanUseDOM();

    return (
        <ArkTabs.Indicator asChild>
            <MotionFlex
                animate={{ opacity: 1, scale: 1 }}
                initial={!domAvailable ? { opacity: 0, scale: 0.95 } : undefined}
                layout={reduceMotion ? false : "position"}
                layoutId={"dreamy-tab-indicator"}
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
        </ArkTabs.Indicator>
    );
}, "tabIndicator");
