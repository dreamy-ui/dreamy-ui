"use client";

import {
    type DreamyHostProps,
    type StyleContextSlotProps,
    type UiSdkMotionController,
    UiSdkMotionSync,
    mergeMotionRefs,
    transformReducedMotion,
    useDefaultTransition,
    useMotionVariants,
    useReducedMotion,
    useUiSdkMotion
} from "@dreamy-ui/react";
import {
    Dialog as UiSdkDialog,
    DialogBackdrop as UiSdkDialogBackdrop,
    DialogClose as UiSdkDialogClose,
    DialogContent as UiSdkDialogContent,
    DialogDescription as UiSdkDialogDescription,
    DialogShortcut as UiSdkDialogShortcut,
    DialogTitle as UiSdkDialogTitle,
    DialogTrigger as UiSdkDialogTrigger,
    type DialogContentProps as UiSdkDialogContentProps,
    type DialogOptions,
    type DialogShortcutProps as UiSdkDialogShortcutProps,
    type DialogTriggerProps as UiSdkDialogTriggerProps,
    createDialogController
} from "@ui-sdk/react/dialog";
import type React from "react";
import {
    type CSSProperties,
    type ReactElement,
    type ReactNode,
    createContext,
    useContext,
    useMemo
} from "react";
import { css, cx } from "styled-system/css";
import {
    type HTMLDreamyProps,
    createStyleContext,
    dreamy,
    splitCssProps
} from "styled-system/jsx";
import { type ModalVariantProps, modal } from "styled-system/recipes";
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "./close-button";
import { Heading } from "./heading";
import { MotionBox, MotionFlex } from "./motion";
import { Text, type TextProps } from "./text";

const { withContext, withRootProvider } = createStyleContext(modal);

export { createDialogController };

export type ModalScrollBehavior = "inside" | "outside";

interface ModalUiContextValue {
    scrollBehavior: ModalScrollBehavior;
    reduceMotion: boolean;
    motion: UiSdkMotionController;
}

const ModalUiContext = createContext<ModalUiContextValue | null>(null);

function useModalUi() {
    const context = useContext(ModalUiContext);
    if (!context) {
        throw new Error("useModalUi must be used within Modal.Root");
    }
    return context;
}

export interface ModalProps extends DialogOptions, ModalVariantProps {
    children?: ReactNode;
    /**
     * Where scroll behavior should originate.
     * - If set to `inside`, scroll occurs within `Modal.Body`.
     * - If set to `outside`, the dialog content scrolls within the viewport.
     *
     * @default "inside"
     */
    scrollBehavior?: ModalScrollBehavior;
    /**
     * If `true`, dialog enter/exit transitions are disabled.
     */
    reduceMotion?: boolean;
}

/**
 * Modal component — accessible dialog overlay powered by UI SDK `Dialog`.
 *
 * @see Docs https://dreamy-ui.com/docs/components/modal
 */
export const Root = withRootProvider(function ModalRoot(props: ModalProps) {
    const {
        children,
        scrollBehavior = "inside",
        reduceMotion: reduceMotionProp,
        size: _size,
        placement: _placement,
        open,
        defaultOpen,
        onOpenChange,
        ...dialogOptions
    } = props;

    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? globalReduceMotion ?? false;
    const motion = useUiSdkMotion({ open, defaultOpen, reduceMotion });
    const handleOpenChange = motion.wrapOnOpenChange(onOpenChange);

    const uiValue = useMemo<ModalUiContextValue>(
        () => ({ scrollBehavior, reduceMotion, motion }),
        [motion, reduceMotion, scrollBehavior]
    );

    return (
        <ModalUiContext.Provider value={uiValue}>
            <UiSdkDialog
                {...dialogOptions}
                defaultOpen={defaultOpen}
                onOpenChange={handleOpenChange}
                open={open}
            >
                <UiSdkMotionSync
                    controller={motion}
                    open={open}
                />
                {children}
            </UiSdkDialog>
        </ModalUiContext.Provider>
    );
});

export interface ModalTriggerProps
    extends UiSdkDialogTriggerProps,
        Omit<HTMLDreamyProps<"button">, "children" | "disabled" | "value" | "defaultValue" | "onChange"> {
    render?: ReactElement;
    children?: ReactNode;
}

/**
 * Modal Trigger — opens the dialog when activated.
 */
export function Trigger(props: ModalTriggerProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDialogTrigger
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDialogTrigger>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDialogTrigger>
    );
}

export interface ModalOverlayProps extends Omit<HTMLDreamyProps<"div">, "children">, StyleContextSlotProps {
    children?: ReactNode;
}

/**
 * Modal Overlay — backdrop scrim behind the dialog content.
 */
export const Overlay = withContext(function ModalOverlay(props: ModalOverlayProps) {
    const { className, style, children, "data-slot": _dataSlot, ...rest } = props;
    const { reduceMotion, motion } = useModalUi();
    const { overlay } = useMotionVariants();
    const transition = useDefaultTransition();
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDialogBackdrop
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDialogBackdrop>)}
            className={cx(className as string | undefined, css(cssProps))}
            data-reduce-motion={reduceMotion ? "" : undefined}
            render={(partProps, state) => {
                const {
                    ref: partRef,
                    style: partStyle,
                    children: partChildren,
                    ...restPartProps
                } = partProps as React.ComponentPropsWithRef<"div">;
                const isOpen = (state as { open?: boolean })?.open ?? motion.isOpen;

                return (
                    <MotionBox
                        {...(restPartProps as Record<string, unknown>)}
                        animate={isOpen ? "animate" : "exit"}
                        initial={reduceMotion ? false : "initial"}
                        onAnimationComplete={() => {
                            if (!isOpen) {
                                motion.notifyAnimationComplete("overlay");
                            }
                        }}
                        ref={mergeMotionRefs(partRef, (el) => {
                            motion.register("overlay", el as HTMLElement | null);
                        })}
                        style={partStyle as CSSProperties | undefined}
                        transition={transition}
                        variants={transformReducedMotion(overlay, reduceMotion)}
                    >
                        {partChildren}
                    </MotionBox>
                );
            }}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDialogBackdrop>
    );
}, "overlay");

export interface ModalContentProps
    extends UiSdkDialogContentProps,
        DreamyHostProps<HTMLDreamyProps<"div">, UiSdkDialogContentProps>,
        StyleContextSlotProps {
    render?: ReactElement;
    children?: ReactNode;
}

/**
 * Modal Content — dialog surface, top-layer stacking, and focus scope.
 */
export const Content = withContext(function ModalContent(props: ModalContentProps) {
    const {
        className,
        style,
        children,
        initialFocus,
        finalFocus,
        keepMounted,
        container,
        render,
        "data-slot": _dataSlot,
        ...rest
    } = props;
    const { scrollBehavior, reduceMotion, motion } = useModalUi();
    const { modal: modalVariants } = useMotionVariants();
    const transition = useDefaultTransition();
    const [cssProps, domProps] = splitCssProps(rest);

    const resolvedRender: React.ComponentProps<typeof UiSdkDialogContent>["render"] =
        render ??
        ((partProps, state) => {
            const {
                ref: partRef,
                style: partStyle,
                children: partChildren,
                ...restPartProps
            } = partProps as React.ComponentPropsWithRef<"div">;
            const isOpen = (state as { open?: boolean })?.open ?? motion.isOpen;

            return (
                <MotionFlex
                    {...(restPartProps as Record<string, unknown>)}
                    animate={isOpen ? "animate" : "exit"}
                    initial={reduceMotion ? false : "initial"}
                    onAnimationComplete={() => {
                        if (!isOpen) {
                            motion.notifyAnimationComplete("content");
                        }
                    }}
                    ref={mergeMotionRefs(partRef, (el) => {
                        motion.register("content", el as HTMLElement | null);
                    })}
                    style={partStyle as CSSProperties | undefined}
                    transition={transition}
                    variants={transformReducedMotion(modalVariants, reduceMotion)}
                >
                    {partChildren}
                </MotionFlex>
            );
        });

    return (
        <UiSdkDialogContent
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDialogContent>)}
            className={cx(className as string | undefined, css(cssProps))}
            container={container}
            data-reduce-motion={reduceMotion ? "" : undefined}
            data-scroll-behavior={scrollBehavior}
            finalFocus={finalFocus}
            initialFocus={initialFocus}
            keepMounted={keepMounted}
            render={resolvedRender}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDialogContent>
    );
}, "content");

export interface ModalHeaderProps extends Omit<HTMLDreamyProps<"header">, "children">, StyleContextSlotProps {
    children?: ReactNode;
}

/**
 * Modal Header — top section that provides the dialog's accessible title (`aria-labelledby`).
 */
export const Header = withContext(function ModalHeader(props: ModalHeaderProps) {
    const { children, className, style, "data-slot": _dataSlot, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDialogTitle
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDialogTitle>)}
            className={cx(className as string | undefined, css(cssProps))}
            render={<header />}
            style={style as CSSProperties | undefined}
        >
            {typeof children === "string" ? (
                <Heading
                    as="span"
                    size="lg"
                    variant="heading"
                >
                    {children}
                </Heading>
            ) : (
                children
            )}
        </UiSdkDialogTitle>
    );
}, "header");

export interface ModalTitleProps extends Omit<HTMLDreamyProps<"h2">, "children"> {
    children?: ReactNode;
}

/**
 * Modal Title — explicit dialog heading (`aria-labelledby`).
 */
export function Title(props: ModalTitleProps) {
    const { children, className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDialogTitle
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDialogTitle>)}
            className={cx(className as string | undefined, css(cssProps))}
            render={
                <Heading
                    as="h2"
                    size="lg"
                    variant="heading"
                />
            }
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDialogTitle>
    );
}

export interface ModalBodyProps extends Omit<HTMLDreamyProps<"div">, "children">, StyleContextSlotProps {
    children?: ReactNode;
}

/**
 * Modal Body — main content area wired as the dialog's `aria-describedby`.
 */
export const Body = withContext(function ModalBody(props: ModalBodyProps) {
    const { children, className, style, "data-slot": _dataSlot, ...rest } = props;
    const { scrollBehavior } = useModalUi();
    const [cssProps, domProps] = splitCssProps(rest);

    const resolvedStyle: CSSProperties = {
        maxHeight: scrollBehavior === "inside" ? "calc(100vh - 10rem)" : undefined,
        overflow: scrollBehavior === "inside" ? "auto" : undefined,
        ...(style as CSSProperties | undefined)
    };

    return (
        <UiSdkDialogDescription
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDialogDescription>)}
            className={cx(className as string | undefined, css(cssProps))}
            render={<div />}
            style={resolvedStyle}
        >
            {children}
        </UiSdkDialogDescription>
    );
}, "body");

export interface ModalDescriptionProps extends TextProps {}

/**
 * Modal Description — explicit accessible description (`aria-describedby`).
 */
export function Description(props: ModalDescriptionProps) {
    const { children, className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDialogDescription
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDialogDescription>)}
            className={cx(className as string | undefined, css(cssProps))}
            render={<Text as="p" />}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDialogDescription>
    );
}

export interface ModalFooterProps extends HTMLDreamyProps<"footer"> {}

/**
 * Modal Footer — bottom section for dialog actions.
 */
export const Footer = withContext(dreamy.footer, "footer");

export interface ModalCloseButtonProps extends CloseButtonProps, StyleContextSlotProps {
    action?: React.ComponentProps<typeof UiSdkDialogClose>["action"];
    value?: string;
}

/**
 * Modal Close Button — icon button that dismisses the dialog.
 */
export const CloseButton = withContext(function ModalCloseButton(props: ModalCloseButtonProps) {
    const { className, action, value, "data-slot": _dataSlot, ...rest } = props;

    return (
        <UiSdkDialogClose
            action={action}
            className={className as string | undefined}
            render={<CloseButtonComponent {...rest} />}
            value={value}
        />
    );
}, "close");

export interface ModalCloseProps
    extends Omit<HTMLDreamyProps<"button">, "children" | "value"> {
    action?: React.ComponentProps<typeof UiSdkDialogClose>["action"];
    value?: string;
    render?: ReactElement;
    children?: ReactNode;
}

/**
 * Modal Close — action button that closes the dialog.
 */
export function Close(props: ModalCloseProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDialogClose
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDialogClose>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDialogClose>
    );
}

export interface ModalShortcutProps
    extends UiSdkDialogShortcutProps,
        Omit<HTMLDreamyProps<"span">, "children"> {
    children?: ReactNode;
}

/**
 * Modal Shortcut — displays a trigger's keyboard shortcut.
 */
export function Shortcut(props: ModalShortcutProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDialogShortcut
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDialogShortcut>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDialogShortcut>
    );
}
