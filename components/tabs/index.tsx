"use client";

import {
    type DreamyHostProps,
    TRANSITION_EASINGS,
    useDefaultTransition,
    useReducedMotion
} from "@dreamy-ui/react";
import {
    Tabs as UiSdkTabs,
    TabsList as UiSdkTabsList,
    TabsPanel as UiSdkTabsPanel,
    TabsTab as UiSdkTabsTab,
    TabsTabIcon as UiSdkTabsTabIcon,
    type TabsOptions,
    type TabsPanelProps as UiSdkTabsPanelProps,
    type TabsTabProps as UiSdkTabsTabProps,
    createTabsController
} from "@ui-sdk/react/tabs";
import type React from "react";
import {
    type CSSProperties,
    Children,
    type ReactElement,
    type ReactNode,
    cloneElement,
    createContext,
    isValidElement,
    useContext,
    useId,
    useMemo
} from "react";
import { css, cx } from "styled-system/css";
import {
    type HTMLDreamyProps,
    createStyleContext,
    dreamy,
    splitCssProps
} from "styled-system/jsx";
import { type TabsVariantProps, tabs } from "styled-system/recipes";
import { MotionFlex, type MotionFlexProps } from "../motion";

const { withProvider, withContext } = createStyleContext(tabs, {
    forwardVariants: ["orientation"]
});

export { createTabsController };

const TAB_PART = Symbol.for("dreamy.tabs.tab");
const PANEL_PART = Symbol.for("dreamy.tabs.panel");

interface TabsUiContextValue {
    reduceMotion: boolean;
    indicatorLayoutId: string;
}

const TabsUiContext = createContext<TabsUiContextValue>({
    reduceMotion: false,
    indicatorLayoutId: "dreamy-tab-indicator"
});

function assignIndices(children: ReactNode, part: symbol) {
    let index = 0;
    return Children.map(children, (child) => {
        if (!isValidElement(child)) {
            return child;
        }
        if ((child.type as { partType?: symbol }).partType === part) {
            const props = child.props as { value?: string; index?: number };
            const currentIndex = props.index ?? index;
            index = currentIndex + 1;
            return cloneElement(child as ReactElement<{ index?: number; value?: string }>, {
                index: currentIndex,
                value: props.value ?? String(currentIndex)
            });
        }
        return child;
    });
}

export interface TabsProps
    extends TabsOptions<string>,
        Omit<TabsVariantProps, "orientation">,
        DreamyHostProps<HTMLDreamyProps<"div">, TabsOptions<string>, "onChange" | "size"> {
    reduceMotion?: boolean;
    children?: ReactNode;
}

function TabsRoot(props: TabsProps) {
    const {
        value,
        defaultValue,
        onValueChange,
        orientation = "horizontal",
        activation,
        loop,
        hiddenUntilFound,
        controller,
        debug,
        reduceMotion: reduceMotionProp,
        className,
        style,
        children,
        ...rest
    } = props;

    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? globalReduceMotion ?? false;
    const indicatorLayoutId = `dreamy-tab-indicator-${useId()}`;
    const [cssProps, domProps] = splitCssProps(rest);
    const uiValue = useMemo<TabsUiContextValue>(
        () => ({ reduceMotion, indicatorLayoutId }),
        [indicatorLayoutId, reduceMotion]
    );

    return (
        <TabsUiContext.Provider value={uiValue}>
            <UiSdkTabs
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkTabs>)}
                activation={activation}
                className={cx(className as string | undefined, css(cssProps))}
                controller={controller}
                debug={debug}
                defaultValue={value === undefined ? (defaultValue ?? "0") : defaultValue}
                hiddenUntilFound={hiddenUntilFound}
                loop={loop}
                onValueChange={onValueChange}
                orientation={orientation}
                style={style as CSSProperties | undefined}
                value={value}
            >
                {children}
            </UiSdkTabs>
        </TabsUiContext.Provider>
    );
}

/**
 * Tabs component — layered sections of content powered by UI SDK `Tabs`.
 *
 * @see Docs https://dreamy-ui.com/docs/components/tabs
 */
export const Root: (props: TabsProps) => React.JSX.Element = withProvider(TabsRoot, "root") as (
    props: TabsProps
) => React.JSX.Element;

export interface TabListProps extends Omit<HTMLDreamyProps<"div">, "children"> {
    children?: ReactNode;
}

export const List = withContext(function TabList(props: TabListProps) {
    const { children, className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkTabsList
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkTabsList>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {assignIndices(children, TAB_PART)}
        </UiSdkTabsList>
    );
}, "tabList");

export interface TabProps
    extends Partial<Omit<UiSdkTabsTabProps, "disabled" | "value">>,
        DreamyHostProps<HTMLDreamyProps<"button">, UiSdkTabsTabProps, "disabled" | "value"> {
    index?: number;
    value?: string;
    disabled?: boolean;
    render?: ReactElement;
    children?: ReactNode;
}

function TabComponent(props: TabProps) {
    const {
        children,
        index = 0,
        value,
        disabled,
        render,
        className,
        style,
        ...rest
    } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkTabsTab
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkTabsTab>)}
            className={cx(className as string | undefined, css(cssProps))}
            disabled={disabled}
            render={render}
            style={style as CSSProperties | undefined}
            value={value ?? String(index)}
        >
            {(state) => (
                <>
                    {children}
                    {state.selected ? <TabIndicator /> : null}
                </>
            )}
        </UiSdkTabsTab>
    );
}

export const Tab = withContext(TabComponent, "tab") as typeof TabComponent & {
    partType?: symbol;
};
Tab.partType = TAB_PART;

export interface TabIconProps extends Omit<HTMLDreamyProps<"span">, "children"> {
    mirror?: boolean;
    children?: ReactNode;
}

export function TabIcon(props: TabIconProps) {
    const { className, style, children, mirror, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkTabsTabIcon
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkTabsTabIcon>)}
            className={cx(className as string | undefined, css(cssProps))}
            mirror={mirror}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkTabsTabIcon>
    );
}

export interface TabPanelsProps extends HTMLDreamyProps<"div"> {}

export const Panels = withContext(function TabPanels(props: TabPanelsProps) {
    const { children, ...rest } = props;
    return <dreamy.div {...rest}>{assignIndices(children, PANEL_PART)}</dreamy.div>;
}, "tabPanels");

export interface TabPanelProps
    extends Partial<UiSdkTabsPanelProps>,
        DreamyHostProps<HTMLDreamyProps<"div">, UiSdkTabsPanelProps> {
    index?: number;
    children?: ReactNode;
}

function TabPanelComponent(props: TabPanelProps) {
    const { children, index = 0, value, keepMounted, hiddenUntilFound, className, style, ...rest } =
        props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkTabsPanel
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkTabsPanel>)}
            className={cx(className as string | undefined, css(cssProps))}
            hiddenUntilFound={hiddenUntilFound}
            keepMounted={keepMounted}
            style={style as CSSProperties | undefined}
            value={value ?? String(index)}
        >
            {children}
        </UiSdkTabsPanel>
    );
}

export const Panel = withContext(TabPanelComponent, "tabPanel") as typeof TabPanelComponent & {
    partType?: symbol;
};
Panel.partType = PANEL_PART;

const TabIndicator = withContext(function TabsIndicatorSlot(props: MotionFlexProps) {
    const { reduceMotion, indicatorLayoutId } = useContext(TabsUiContext);
    const transition = useDefaultTransition();

    const indicatorTransition = useMemo(
        () =>
            reduceMotion
                ? { duration: 0 }
                : {
                      ...transition,
                      layout:
                          transition && "type" in transition && transition.type === "spring"
                              ? transition
                              : {
                                    duration:
                                        ((transition as { duration?: number } | undefined)
                                            ?.duration ?? 0.2) * 1.5,
                                    ease: TRANSITION_EASINGS.easeInOut
                                }
                  },
        [reduceMotion, transition]
    );

    return (
        <MotionFlex
            aria-hidden="true"
            data-reduce-motion={reduceMotion ? "" : undefined}
            data-slot="tabs-indicator"
            layout={reduceMotion ? false : "position"}
            layoutId={indicatorLayoutId}
            transition={indicatorTransition}
            {...props}
        />
    );
}, "tabIndicator");
