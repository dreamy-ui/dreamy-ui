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
import { forwardRef, useMemo } from "react";
import { createStyleContext } from "styled-system/jsx";
import type { AccordionVariantProps } from "styled-system/recipes";
import { accordion } from "styled-system/recipes";
import { Box } from "./box";
import { type HTMLDreamyProps, dreamy } from "./factory";
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
const AccordionRoot = withProvider(
    forwardRef<HTMLDivElement, AccordionProps>(function AccordionRoot(ownProps, ref) {
        const { htmlProps, descendants, ...context } = useAccordion(ownProps);

        const ctx = useMemo(
            () => ({ ...context, reduceMotion: !!ownProps.reduceMotion }),
            [...objectToDeps(context), ownProps.reduceMotion]
        );

        return (
            <AccordionDescendantsProvider value={descendants}>
                <AccordionProvider value={ctx}>
                    <Box
                        ref={ref}
                        {...htmlProps}
                    />
                </AccordionProvider>
            </AccordionDescendantsProvider>
        );
    }),
    "root"
);

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

const AccordionItem = withContext(
    forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(props, ref) {
        const { children } = props;
        const { htmlProps, ...ctx } = useAccordionItem(props);

        return (
            <AccordionItemProvider value={ctx}>
                <Box
                    ref={ref}
                    {...htmlProps}
                >
                    {typeof children === "function"
                        ? children({
                              isExpanded: !!ctx.isOpen,
                              isDisabled: !!ctx.isDisabled
                          })
                        : children}
                </Box>
            </AccordionItemProvider>
        );
    }),
    "item"
);

export interface AccordionContentProps extends HTMLDreamyProps<"div"> {
    /**
     * The properties passed to the underlying `Collapse` component.
     */
    collapseProps?: CollapseProps;
}

const AccordionContent = withContext(
    forwardRef<HTMLDivElement, AccordionContentProps>(function AccordionContent(props, ref) {
        const { collapseProps, ...rest } = props;

        const { reduceMotion } = useAccordionContext();
        const { getContentProps, isOpen } = useAccordionItemContext();

        const panelProps = getContentProps(rest, ref) as any;

        if (!reduceMotion) {
            panelProps.hidden = undefined;
        }

        const child = <Box {...panelProps} />;

        if (!reduceMotion) {
            return (
                <Collapse
                    in={isOpen}
                    {...collapseProps}
                >
                    {child}
                </Collapse>
            );
        }

        return child;
    }),
    "content"
);

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

const AccordionTrigger = withContext(
    forwardRef<HTMLButtonElement, AccordionTriggerProps>(function AccordionTrigger(
        { headingTag: HeadingTag = "h2", children, icon, iconProps, ...props },
        ref
    ) {
        const { getTriggerProps } = useAccordionItemContext();

        return (
            <HeadingTag>
                <dreamy.button {...(getTriggerProps(props, ref) as any)}>
                    {children}
                    {icon ?? <AccordionIcon {...iconProps} />}
                </dreamy.button>
            </HeadingTag>
        );
    }),
    "trigger"
);

export interface AccordionIconProps extends HTMLDreamyProps<"svg"> {}

/**
 * @internal
 */
const AccordionIcon = withContext(
    forwardRef<SVGSVGElement, AccordionIconProps>(function AccordionIcon(props, ref) {
        return (
            <dreamy.svg
                ref={ref}
                asChild
                aria-hidden="true"
                {...props}
            >
                <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </dreamy.svg>
        );
    }),
    "icon"
);

export namespace Accordion {
    export const Root = AccordionRoot;
    export const Item = AccordionItem;
    export const Content = AccordionContent;
    export const Trigger = AccordionTrigger;
}
