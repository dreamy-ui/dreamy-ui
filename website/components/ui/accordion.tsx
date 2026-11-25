"use client";

import {
    type DreamyHostProps,
    type UiSdkMotionController,
    UiSdkMotionSync,
    dataAttr,
    mergeMotionRefs,
    useReducedMotion,
    useUiSdkMotion
} from "@dreamy-ui/react";
import {
    Accordion as UiSdkAccordion,
    AccordionHeader as UiSdkAccordionHeader,
    AccordionItem as UiSdkAccordionItem,
    AccordionPanel as UiSdkAccordionPanel,
    AccordionTrigger as UiSdkAccordionTrigger,
    type AccordionItemProps as UiSdkAccordionItemProps,
    type AccordionOptions,
    type AccordionPanelProps as UiSdkAccordionPanelProps,
    createAccordionController
} from "@ui-sdk/react/accordion";
import type React from "react";
import {
    type CSSProperties,
    type ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef
} from "react";
import { css, cx } from "styled-system/css";
import {
    type HTMLDreamyProps,
    createStyleContext,
    dreamy,
    splitCssProps
} from "styled-system/jsx";
import type { AccordionVariantProps } from "styled-system/recipes";
import { accordion } from "styled-system/recipes";
import type { IconProps } from "./icon";
import { Collapse, type CollapseProps } from "./transitions";

const { withProvider, withContext } = createStyleContext(accordion);

export { createAccordionController };

interface AccordionRootMotionContextValue {
    value: string[] | undefined;
    initialValue: string[];
    reduceMotion: boolean;
}

const AccordionRootMotionContext = createContext<AccordionRootMotionContextValue>({
    value: undefined,
    initialValue: [],
    reduceMotion: false
});

interface AccordionItemMotionContextValue {
    motion: UiSdkMotionController;
    wasInitiallyOpen: boolean;
}

const AccordionItemMotionContext = createContext<AccordionItemMotionContextValue | null>(null);

export interface AccordionProps
    extends AccordionOptions<string>,
        AccordionVariantProps,
        DreamyHostProps<HTMLDreamyProps<"div">, AccordionOptions<string>, "onChange" | "size"> {
    children?: ReactNode;
}

function AccordionRoot(props: AccordionProps) {
    const {
        value,
        defaultValue,
        onValueChange,
        multiple,
        collapsible,
        disabled,
        keepMounted,
        hiddenUntilFound,
        controller,
        debug,
        className,
        style,
        children,
        ...rest
    } = props;

    const reduceMotion = useReducedMotion() ?? false;
    const initialValueRef = useRef<string[]>(value ?? defaultValue ?? []);
    const [cssProps, domProps] = splitCssProps(rest);

    const rootMotionValue = useMemo<AccordionRootMotionContextValue>(
        () => ({
            value,
            initialValue: initialValueRef.current,
            reduceMotion
        }),
        [reduceMotion, value]
    );

    return (
        <AccordionRootMotionContext.Provider value={rootMotionValue}>
            <UiSdkAccordion
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkAccordion>)}
                className={cx(className as string | undefined, css(cssProps))}
                collapsible={collapsible}
                controller={controller}
                debug={debug}
                defaultValue={defaultValue}
                disabled={disabled}
                hiddenUntilFound={hiddenUntilFound}
                keepMounted={keepMounted}
                multiple={multiple}
                onValueChange={onValueChange}
                style={style as CSSProperties | undefined}
                value={value}
            >
                {children}
            </UiSdkAccordion>
        </AccordionRootMotionContext.Provider>
    );
}

/**
 * Accordion component — expandable sections for progressive disclosure powered by UI SDK.
 *
 * @see Docs https://dreamy-ui.com/docs/components/accordion
 */
export const Root: (props: AccordionProps) => React.JSX.Element = withProvider(
    AccordionRoot,
    "root"
) as (props: AccordionProps) => React.JSX.Element;

export interface AccordionItemProps
    extends Omit<UiSdkAccordionItemProps<string>, "value">,
        Omit<HTMLDreamyProps<"div">, "children" | "value" | "disabled"> {
    value: string;
    disabled?: boolean;
    children?: ReactNode;
}

/**
 * Accordion Item — a single expandable section within the accordion.
 */
export const Item = withContext(function AccordionItem(props: AccordionItemProps) {
    const {
        value,
        disabled,
        onOpenChange,
        onOpenChangeComplete,
        className,
        style,
        children,
        ...rest
    } = props;
    const { value: rootValue, initialValue, reduceMotion } = useContext(AccordionRootMotionContext);
    const wasInitiallyOpenRef = useRef(initialValue.includes(value));
    const controlledOpen = rootValue !== undefined ? rootValue.includes(value) : undefined;
    const itemMotion = useUiSdkMotion({
        open: controlledOpen,
        defaultOpen: wasInitiallyOpenRef.current,
        reduceMotion
    });
    const handleOpenChange = itemMotion.wrapOnOpenChange(onOpenChange);
    const [cssProps, domProps] = splitCssProps(rest);

    const itemContextValue = useMemo<AccordionItemMotionContextValue>(
        () => ({
            motion: itemMotion,
            wasInitiallyOpen: wasInitiallyOpenRef.current
        }),
        [itemMotion]
    );

    return (
        <AccordionItemMotionContext.Provider value={itemContextValue}>
            <UiSdkAccordionItem
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkAccordionItem>)}
                className={cx(className as string | undefined, css(cssProps))}
                disabled={disabled}
                onOpenChange={handleOpenChange}
                onOpenChangeComplete={onOpenChangeComplete}
                style={style as CSSProperties | undefined}
                value={value}
            >
                <UiSdkMotionSync
                    controller={itemMotion}
                    open={controlledOpen}
                />
                {children}
            </UiSdkAccordionItem>
        </AccordionItemMotionContext.Provider>
    );
}, "item");

const ItemTrigger = withContext(function AccordionItemTrigger(
    props: React.ComponentProps<typeof UiSdkAccordionTrigger>
) {
    return <UiSdkAccordionTrigger {...props} />;
}, "trigger");

const Body = withContext(dreamy.div, "body");
const IconSlot = withContext(dreamy.span, "icon");

export interface AccordionContentProps
    extends UiSdkAccordionPanelProps,
        Omit<HTMLDreamyProps<"div">, "children"> {
    /**
     * Props passed to the underlying `Collapse` component.
     */
    collapseProps?: Omit<CollapseProps, "isOpen">;
    children?: ReactNode;
}

/**
 * Accordion Content — the collapsible panel revealed when an item is expanded.
 */
export const Content = withContext(function AccordionContent(props: AccordionContentProps) {
    const {
        children,
        collapseProps,
        keepMounted,
        hiddenUntilFound,
        className,
        style,
        ...rest
    } = props;
    const itemMotionCtx = useContext(AccordionItemMotionContext);
    const isFirstMountRef = useRef(true);
    useEffect(() => {
        isFirstMountRef.current = false;
    }, []);
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkAccordionPanel
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkAccordionPanel>)}
            className={cx(className as string | undefined, css(cssProps))}
            hiddenUntilFound={hiddenUntilFound}
            keepMounted={keepMounted}
            render={(partProps) => {
                const { ref: partRef, ...restPartProps } =
                    partProps as React.ComponentPropsWithRef<"div">;
                return (
                    <div
                        {...restPartProps}
                        ref={mergeMotionRefs(partRef, (el) => {
                            itemMotionCtx?.motion.register("panel", el as HTMLElement | null);
                        })}
                    />
                );
            }}
            style={style as CSSProperties | undefined}
        >
            {(state: { open: boolean }) => {
                const skipInitialEnter =
                    isFirstMountRef.current &&
                    Boolean(itemMotionCtx?.wasInitiallyOpen) &&
                    state.open;
                const reduceMotion = itemMotionCtx?.motion.reduceMotion ?? false;

                return (
                    <Collapse
                        animatePresenceProps={{ initial: true }}
                        initial={skipInitialEnter || reduceMotion ? false : "exit"}
                        isOpen={state.open}
                        onAnimationComplete={() => {
                            if (!state.open) {
                                itemMotionCtx?.motion.notifyAnimationComplete("panel");
                            }
                        }}
                        {...collapseProps}
                    >
                        <Body>{children}</Body>
                    </Collapse>
                );
            }}
        </UiSdkAccordionPanel>
    );
}, "content");

export interface AccordionTriggerProps extends Omit<HTMLDreamyProps<"button">, "children"> {
    /**
     * The heading tag to use for the wrapper of the trigger.
     * @default "h2"
     */
    headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    /**
     * Removes default icon and allows for custom icon to be passed in.
     */
    icon?: ReactNode;
    /**
     * Props to pass to the default icon.
     */
    iconProps?: IconProps;
    children?: ReactNode;
}

/**
 * Accordion Trigger — the button that expands or collapses an item.
 */
export function Trigger({
    headingTag: HeadingTag = "h2",
    children,
    icon,
    iconProps,
    className,
    style,
    ...rest
}: AccordionTriggerProps) {
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkAccordionHeader render={<HeadingTag />}>
            <ItemTrigger
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkAccordionTrigger>)}
                className={cx(className as string | undefined, css(cssProps))}
                style={style as CSSProperties | undefined}
            >
                {(state: { open: boolean }) => (
                    <>
                        {children}
                        {icon ?? (
                            <IconSlot data-open={dataAttr(state.open)}>
                                <AccordionIcon {...iconProps} />
                            </IconSlot>
                        )}
                    </>
                )}
            </ItemTrigger>
        </UiSdkAccordionHeader>
    );
}

export interface AccordionIconProps extends HTMLDreamyProps<"svg"> {}

function AccordionIcon(props: AccordionIconProps) {
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
}
