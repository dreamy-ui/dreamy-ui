"use client";

import {
    AccordionDescendantsProvider,
    AccordionItemProvider,
    AccordionProvider,
    type UseAccordionItemProps,
    type UseAccordionProps,
    objectToDeps,
    useAccordion,
    useAccordionContext,
    useAccordionItem,
    useAccordionItemContext
} from "@dreamy-ui/react";
import { useMemo } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import type { AccordionVariantProps } from "styled-system/recipes";
import { accordion } from "styled-system/recipes";
import { Box } from "./box";
import type { IconProps } from "./icon";
import { Collapse, type CollapseProps } from "./transitions";

const { withProvider, withContext } = createStyleContext(accordion);

export interface AccordionProps
    extends UseAccordionProps,
        Omit<HTMLDreamyProps<"div">, keyof UseAccordionProps>,
        AccordionVariantProps {
    /**
     * If `true`, height animation and transitions will be disabled.
     *
     * @default false
     */
    reduceMotion?: boolean;
}

/**
 * Accordion component
 *
 * @See Docs https://dreamy-ui.com/docs/components/accordion
 */
export const Root = withProvider(function AccordionRoot(ownProps: AccordionProps) {
    const { htmlProps, descendants, ...context } = useAccordion(ownProps);

    const ctx = useMemo(
        () => ({ ...context, reduceMotion: !!ownProps.reduceMotion }),
        [...objectToDeps(context), ownProps.reduceMotion]
    );

    return (
        <AccordionDescendantsProvider value={descendants}>
            <AccordionProvider value={ctx}>
                <Box {...htmlProps} />
            </AccordionProvider>
        </AccordionDescendantsProvider>
    );
}, "root");

export interface AccordionItemProps
    extends Omit<HTMLDreamyProps<"div">, keyof UseAccordionItemProps | "children">,
        UseAccordionItemProps {
    children?:
        | React.ReactNode
        | ((props: {
              isExpanded: boolean;
              isDisabled: boolean;
          }) => React.ReactNode);
}

export const Item = withContext(function AccordionItem(props: AccordionItemProps) {
    const { children } = props;
    const { htmlProps, ...ctx } = useAccordionItem(props);

    return (
        <AccordionItemProvider value={ctx}>
            <Box {...htmlProps}>
                {typeof children === "function"
                    ? children({
                          isExpanded: !!ctx.isOpen,
                          isDisabled: !!ctx.isDisabled
                      })
                    : children}
            </Box>
        </AccordionItemProvider>
    );
}, "item");

export interface AccordionContentProps extends HTMLDreamyProps<"div"> {
    /**
     * The properties passed to the underlying `Collapse` component.
     */
    collapseProps?: CollapseProps;
}

export const Content = withContext(function AccordionContent(props: AccordionContentProps) {
    const { collapseProps } = props;

    const { reduceMotion } = useAccordionContext();
    const { getContentProps, isOpen } = useAccordionItemContext();

    const panelProps = getContentProps(props);

    if (!reduceMotion) {
        panelProps.hidden = undefined;
    }

    const child = <Box {...panelProps} />;

    if (!reduceMotion) {
        return (
            <Collapse
                isOpen={isOpen}
                {...collapseProps}
            >
                {child}
            </Collapse>
        );
    }

    return child;
}, "content");

export interface AccordionTriggerProps extends HTMLDreamyProps<"button"> {
    /**
     * The heading tag to use for the wrapper of the trigger.
     * @default "h2"
     */
    headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    /**
     * Removes default icon and allows for custom icon to be passed in.
     */
    icon?: React.ReactNode;
    /**
     * Props to pass to the default icon.
     */
    iconProps?: IconProps;
}

export const Trigger = withContext(function AccordionTrigger({
    headingTag: HeadingTag = "h2",
    children,
    icon,
    iconProps,
    ...props
}: AccordionTriggerProps) {
    const { getTriggerProps } = useAccordionItemContext();

    return (
        <HeadingTag>
            <dreamy.button {...getTriggerProps(props)}>
                {children}
                {icon ?? <AccordionIcon {...iconProps} />}
            </dreamy.button>
        </HeadingTag>
    );
}, "trigger");

export interface AccordionIconProps extends HTMLDreamyProps<"svg"> {}

/**
 * @internal
 */
const AccordionIcon = withContext(function AccordionIcon(props: AccordionIconProps) {
    return (
        <dreamy.svg
            aria-hidden="true"
            asChild
            {...props}
        >
            <svg
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
        </dreamy.svg>
    );
}, "icon");
