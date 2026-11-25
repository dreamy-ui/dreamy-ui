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
    type DialogApi,
    type DialogBackdropState,
    type DialogCloseActionDetails,
    type DialogCloseProps,
    type DialogCloseState,
    type DialogContentProps,
    type DialogContentState,
    type DialogController,
    type DialogDismissAttemptDetails,
    type DialogDismissReason,
    type DialogFinalFocus,
    type DialogInitialFocus,
    type DialogOpenChangeDetails,
    type DialogOpenChangeReason,
    type DialogOptions,
    type DialogPayloadChangeReason,
    type DialogPrimitive,
    type DialogShortcutProps,
    type DialogShortcutState,
    type DialogTriggerProps,
    type DialogTriggerState,
    createDialogController
} from "@ui-sdk/react/dialog";
import type React from "react";
import {
    type CSSProperties,
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
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "../close-button";
import { Heading } from "../heading";
import { MotionBox, MotionFlex } from "../motion";
import { Text, type TextProps } from "../text";

const { withContext, withRootProvider } = createStyleContext(modal);

export { createDialogController };
export type {
    DialogApi,
    DialogBackdropState,
    DialogCloseActionDetails,
    DialogCloseProps,
    DialogCloseState,
    DialogContentProps,
    DialogContentState,
    DialogController,
    DialogDismissAttemptDetails,
    DialogDismissReason,
    DialogFinalFocus,
    DialogInitialFocus,
    DialogOpenChangeDetails,
    DialogOpenChangeReason,
    DialogOptions,
    DialogPayloadChangeReason,
    DialogPrimitive,
    DialogShortcutProps,
    DialogShortcutState,
    DialogTriggerProps,
    DialogTriggerState
};

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

type UiSdkDialogTriggerComponentProps = React.ComponentProps<typeof UiSdkDialogTrigger>;

export interface ModalTriggerProps
    extends Omit<UiSdkDialogTriggerComponentProps, "className" | "style">,
        Omit<
            HTMLDreamyProps<"button">,
            | keyof UiSdkDialogTriggerComponentProps
            | "children"
            | "disabled"
            | "value"
            | "defaultValue"
            | "onChange"
            | "className"
            | "style"
        > {
    className?: UiSdkDialogTriggerComponentProps["className"];
    style?: UiSdkDialogTriggerComponentProps["style"];
}

/**
 * Modal Trigger — opens the dialog when activated.
 */
export function Trigger(props: ModalTriggerProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);
    const resolvedClassName =
        typeof className === "function"
            ? (state: DialogTriggerState) => cx(className(state), css(cssProps))
            : cx(className as string | undefined, css(cssProps));

    return (
        <UiSdkDialogTrigger
            {...(domProps as unknown as UiSdkDialogTriggerComponentProps)}
            className={resolvedClassName}
            style={style}
        >
            {children}
        </UiSdkDialogTrigger>
    );
}

type UiSdkDialogBackdropComponentProps = React.ComponentProps<typeof UiSdkDialogBackdrop>;

export interface ModalOverlayProps
    extends Omit<HTMLDreamyProps<"div">, "children">,
        StyleContextSlotProps {
    render?: UiSdkDialogBackdropComponentProps["render"];
    children?: UiSdkDialogBackdropComponentProps["children"];
}

/**
 * Modal Overlay — backdrop scrim behind the dialog content.
 */
export const Overlay = withContext(function ModalOverlay(props: ModalOverlayProps) {
    const { className, style, children, render, "data-slot": _dataSlot, ...rest } = props;
    const { reduceMotion, motion } = useModalUi();
    const { overlay } = useMotionVariants();
    const transition = useDefaultTransition();
    const [cssProps, domProps] = splitCssProps(rest);

    const resolvedRender: UiSdkDialogBackdropComponentProps["render"] =
        render ??
        ((partProps, state) => {
            const {
                ref: partRef,
                style: partStyle,
                children: partChildren,
                ...restPartProps
            } = partProps as React.ComponentPropsWithRef<"div">;
            const isOpen = (state as DialogBackdropState | undefined)?.open ?? motion.isOpen;

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
        });

    return (
        <UiSdkDialogBackdrop
            {...(domProps as unknown as UiSdkDialogBackdropComponentProps)}
            className={cx(className as string | undefined, css(cssProps))}
            data-reduce-motion={reduceMotion ? "" : undefined}
            render={resolvedRender}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDialogBackdrop>
    );
}, "overlay");

type UiSdkDialogContentComponentProps<Payload = unknown> = React.ComponentProps<
    typeof UiSdkDialogContent<Payload>
>;

export interface ModalContentProps<Payload = unknown>
    extends Omit<
            UiSdkDialogContentComponentProps<Payload>,
            "children" | "className" | "style" | "render"
        >,
        DreamyHostProps<
            HTMLDreamyProps<"div">,
            UiSdkDialogContentComponentProps<Payload>,
            "children" | "render"
        >,
        StyleContextSlotProps {
    render?: UiSdkDialogContentComponentProps<Payload>["render"];
    children?: ReactNode | ((state: DialogContentState<Payload>) => ReactNode);
}

/**
 * Modal Content — dialog surface, top-layer stacking, and focus scope.
 */
export const Content = withContext(
    function ModalContent<Payload = unknown>(props: ModalContentProps<Payload>) {
        const {
            className,
            style,
            children,
            initialFocus,
            finalFocus,
            keepMounted,
            inline,
            container,
            render,
            "data-slot": _dataSlot,
            ...rest
        } = props;
        const { scrollBehavior, reduceMotion, motion } = useModalUi();
        const { modal: modalVariants } = useMotionVariants();
        const transition = useDefaultTransition();
        const [cssProps, domProps] = splitCssProps(rest);

        const resolvedRender: UiSdkDialogContentComponentProps<Payload>["render"] =
            render ??
            ((partProps, state) => {
                const {
                    ref: partRef,
                    style: partStyle,
                    children: partChildren,
                    ...restPartProps
                } = partProps as React.ComponentPropsWithRef<"div">;
                const contentState = state as DialogContentState<Payload> | undefined;

                if (contentState?.presentation === "sheet") {
                    return (
                        <div
                            {...(restPartProps as React.ComponentProps<"div">)}
                            ref={partRef}
                            style={partStyle as CSSProperties | undefined}
                        >
                            {partChildren}
                        </div>
                    );
                }

                const isOpen = contentState?.open ?? motion.isOpen;

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
            <UiSdkDialogContent<Payload>
                {...(domProps as unknown as UiSdkDialogContentComponentProps<Payload>)}
                className={cx(className as string | undefined, css(cssProps))}
                container={container}
                data-reduce-motion={reduceMotion ? "" : undefined}
                data-scroll-behavior={scrollBehavior}
                finalFocus={finalFocus}
                initialFocus={initialFocus}
                inline={inline}
                keepMounted={keepMounted}
                render={resolvedRender}
                style={style as CSSProperties | undefined}
            >
                {children}
            </UiSdkDialogContent>
        );
    },
    "content",
    { forwardProps: ["container"] } as never
) as <Payload = unknown>(props: ModalContentProps<Payload>) => React.JSX.Element | null;

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

type UiSdkDialogTitleComponentProps = React.ComponentProps<typeof UiSdkDialogTitle>;

export interface ModalTitleProps extends Omit<HTMLDreamyProps<"h2">, "children"> {
    render?: UiSdkDialogTitleComponentProps["render"];
    children?: UiSdkDialogTitleComponentProps["children"];
}

/**
 * Modal Title — explicit dialog heading (`aria-labelledby`).
 */
export function Title(props: ModalTitleProps) {
    const { children, className, style, render, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDialogTitle
            {...(domProps as unknown as UiSdkDialogTitleComponentProps)}
            className={cx(className as string | undefined, css(cssProps))}
            render={
                render ?? (
                    <Heading
                        as="h2"
                        size="lg"
                        variant="heading"
                    />
                )
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

type UiSdkDialogDescriptionComponentProps = React.ComponentProps<typeof UiSdkDialogDescription>;

export interface ModalDescriptionProps extends Omit<TextProps, "children"> {
    render?: UiSdkDialogDescriptionComponentProps["render"];
    children?: UiSdkDialogDescriptionComponentProps["children"];
}

/**
 * Modal Description — explicit accessible description (`aria-describedby`).
 */
export function Description(props: ModalDescriptionProps) {
    const { children, className, style, render, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDialogDescription
            {...(domProps as unknown as UiSdkDialogDescriptionComponentProps)}
            className={cx(className as string | undefined, css(cssProps))}
            render={render ?? <Text as="p" />}
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

type UiSdkDialogCloseComponentProps = React.ComponentProps<typeof UiSdkDialogClose>;

export interface ModalCloseProps
    extends Omit<HTMLDreamyProps<"button">, "children" | "value" | "className" | "style"> {
    action?: UiSdkDialogCloseComponentProps["action"];
    value?: string;
    render?: UiSdkDialogCloseComponentProps["render"];
    children?: UiSdkDialogCloseComponentProps["children"];
    className?: UiSdkDialogCloseComponentProps["className"];
    style?: UiSdkDialogCloseComponentProps["style"];
}

/**
 * Modal Close — action button that closes the dialog.
 */
export function Close(props: ModalCloseProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);
    const resolvedClassName =
        typeof className === "function"
            ? (state: DialogCloseState) => cx(className(state), css(cssProps))
            : cx(className as string | undefined, css(cssProps));

    return (
        <UiSdkDialogClose
            {...(domProps as unknown as UiSdkDialogCloseComponentProps)}
            className={resolvedClassName}
            style={style}
        >
            {children}
        </UiSdkDialogClose>
    );
}

type UiSdkDialogShortcutComponentProps = React.ComponentProps<typeof UiSdkDialogShortcut>;

export interface ModalShortcutProps
    extends Omit<UiSdkDialogShortcutComponentProps, "className" | "style">,
        Omit<HTMLDreamyProps<"span">, "children" | "className" | "style"> {
    className?: UiSdkDialogShortcutComponentProps["className"];
    style?: UiSdkDialogShortcutComponentProps["style"];
}

/**
 * Modal Shortcut — displays a trigger's keyboard shortcut.
 */
export function Shortcut(props: ModalShortcutProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);
    const resolvedClassName =
        typeof className === "function"
            ? (state: DialogShortcutState) => cx(className(state), css(cssProps))
            : cx(className as string | undefined, css(cssProps));

    return (
        <UiSdkDialogShortcut
            {...(domProps as unknown as UiSdkDialogShortcutComponentProps)}
            className={resolvedClassName}
            style={style}
        >
            {children}
        </UiSdkDialogShortcut>
    );
}
