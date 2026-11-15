"use client";

import {
    Drawer as ArkDrawer,
    type DrawerContentProps as ArkDrawerContentProps,
    type DrawerRootProps as ArkDrawerRootProps,
    type DrawerRootProviderProps as ArkDrawerRootProviderProps
} from "@ark-ui/react/drawer";
import {
    DrawerContextProvider,
    type DrawerOptions,
    type DrawerPlacement,
    FocusLock,
    Portal,
    type PortalProps,
    RemoveScroll,
    type UseDrawerProps,
    transformReducedMotion,
    useDefaultTransition,
    useDrawer,
    useDrawerContext,
    useDrawerManager,
    useMotionVariants,
    useReducedMotion
} from "@dreamy-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { createStyleContext } from "styled-system/jsx";
import { drawer } from "styled-system/recipes";
import { Box, type BoxProps } from "./box";
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "./close-button";
import { Flex, type FlexProps } from "./flex";
import { Heading } from "./heading";
import { MotionBox, type MotionBoxProps } from "./motion";
import { Text, type TextProps } from "./text";
import { useFloatingPresent } from "./use-floating-present";
import { placementToSwipeDirection } from "./map-placement";

const { withContext, withRootProvider } = createStyleContext(drawer, {
    forwardVariants: ["placement"]
});

type ScrollBehavior = "inside" | "outside";

export interface DrawerProps
    extends Omit<ArkDrawerRootProps, "children">,
        DrawerOptions,
        Pick<UseDrawerProps, "useInert" | "placement"> {
    children: React.ReactNode;
    /**
     * Where scroll behavior should originate.
     * - If set to `inside`, scroll only occurs within the `Drawer.Body`.
     * - If set to `outside`, the entire `Drawer.Content` will scroll within the viewport.
     *
     * @default "inside"
     */
    scrollBehavior?: ScrollBehavior;
    /**
     * Fires when all exiting nodes have completed animating out
     */
    onCloseComplete?: () => void;
    /**
     * Props to be forwarded to the portal component
     */
    portalProps?: Omit<PortalProps, "children">;
}

/**
 * Drawer component — accessible slide-over panel.
 *
 * @see Docs https://dreamy-ui.com/docs/components/drawer
 *
 * @example
 * ```tsx
 * <Drawer.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
 *   <Drawer.Overlay />
 *   <Drawer.Content>
 *     <Drawer.Header>Title</Drawer.Header>
 *     <Drawer.Body>Body</Drawer.Body>
 *   </Drawer.Content>
 * </Drawer.Root>
 * ```
 */
export const Root = withRootProvider(function DrawerRoot(props: DrawerProps) {
    const drawerProps: DrawerProps = {
        scrollBehavior: "inside",
        autoFocus: true,
        trapFocus: true,
        restoreFocus: true,
        blockScrollOnMount: true,
        allowPinchZoom: false,
        preserveScrollBarGap: true,
        placement: "right",
        closeOnEscape: true,
        closeOnInteractOutside: true,
        ...props
    };

    const {
        children,
        open: openProp,
        defaultOpen,
        onOpenChange,
        autoFocus,
        trapFocus,
        initialFocusRef,
        finalFocusRef,
        restoreFocus,
        blockScrollOnMount,
        scrollBehavior,
        allowPinchZoom,
        preserveScrollBarGap,
        onCloseComplete,
        portalProps,
        placement,
        swipeDirection: swipeDirectionProp,
        closeOnEscape,
        closeOnInteractOutside,
        useInert,
        id,
        ...arkRest
    } = drawerProps;

    const swipeDirection = swipeDirectionProp ?? placementToSwipeDirection(placement ?? "right");

    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : uncontrolledOpen;

    const handleOpenChange = useCallback(
        (details: { open: boolean }) => {
            if (!isControlled) {
                setUncontrolledOpen(details.open);
            }
            onOpenChange?.(details);
        },
        [isControlled, onOpenChange]
    );

    const reduceMotion = useReducedMotion();
    const { present, handleExitComplete } = useFloatingPresent(open, reduceMotion);

    const handleArkExitComplete = useCallback(() => {
        handleExitComplete();
        onCloseComplete?.();
    }, [handleExitComplete, onCloseComplete]);

    useEffect(() => {
        if (!open && reduceMotion) {
            handleExitComplete();
            onCloseComplete?.();
        }
    }, [handleExitComplete, onCloseComplete, open, reduceMotion]);

    const drawerState = useDrawer({
        open,
        present,
        onOpenChange: handleOpenChange,
        id,
        closeOnEscape,
        closeOnInteractOutside,
        useInert,
        scrollBehavior,
        placement
    });

    const context = useMemo(() => {
        return {
            ...drawerState,
            autoFocus,
            trapFocus,
            initialFocusRef,
            finalFocusRef,
            restoreFocus,
            blockScrollOnMount,
            allowPinchZoom,
            preserveScrollBarGap,
            onCloseComplete,
            scrollBehavior,
            placement: placement ?? "right",
            reduceMotion
        };
    }, [
        allowPinchZoom,
        autoFocus,
        blockScrollOnMount,
        drawerState,
        finalFocusRef,
        initialFocusRef,
        onCloseComplete,
        placement,
        preserveScrollBarGap,
        reduceMotion,
        restoreFocus,
        scrollBehavior,
        trapFocus
    ]);

    return (
        <ArkDrawer.Root
            {...arkRest}
            closeOnEscape={closeOnEscape}
            closeOnInteractOutside={closeOnInteractOutside}
            defaultOpen={defaultOpen}
            id={id}
            onExitComplete={handleArkExitComplete}
            onOpenChange={handleOpenChange}
            open={open}
            present={present}
            preventScroll={blockScrollOnMount}
            restoreFocus={restoreFocus}
            swipeDirection={swipeDirection}
            trapFocus={trapFocus}
            unmountOnExit={false}
        >
            <DrawerContextProvider value={context}>
                {present && (
                    <Portal
                        isActive={present}
                        key={context.id}
                        zIndex="var(--z-index-modal)"
                        {...portalProps}
                    >
                        {children}
                    </Portal>
                )}
            </DrawerContextProvider>
        </ArkDrawer.Root>
    );
});

export interface DrawerOverlayProps extends MotionBoxProps {}

/**
 * Drawer Overlay — backdrop behind the panel content.
 */
export const Overlay = withContext(function Component(props: DrawerOverlayProps) {
    const { open, reduceMotion } = useDrawerContext();
    const { overlay } = useMotionVariants();
    const transition = useDefaultTransition();

    return (
        <ArkDrawer.Backdrop asChild>
            <MotionBox
                animate={open ? "animate" : "exit"}
                exit="exit"
                initial={reduceMotion ? false : "initial"}
                transition={transition}
                variants={transformReducedMotion(overlay, reduceMotion ?? false)}
                {...(reduceMotion ? {} : { hidden: false })}
                {...props}
            />
        </ArkDrawer.Backdrop>
    );
}, "overlay");

interface DrawerContainerProps extends BoxProps {}

const Container = withContext(function Component({ children, ...props }: DrawerContainerProps) {
    const { getDialogContainerProps } = useDrawerContext();

    return <Box {...getDialogContainerProps(props)}>{children}</Box>;
}, "container");

export interface DrawerContentProps
    extends Omit<FlexProps, "draggable">,
        Pick<ArkDrawerContentProps, "draggable"> {}

/**
 * Drawer Content — slide-over surface and focus scope.
 * Drag, snap points, and swipe-to-dismiss are handled by Ark UI on this element.
 */
export const Content = withContext(function Component({
    children,
    draggable,
    ...props
}: DrawerContentProps) {
    const { getDialogProps } = useDrawerContext();

    return (
        <ArkDrawer.Positioner>
            <DrawerFocusScope>
                <Container>
                    <ArkDrawer.Content
                        asChild
                        draggable={draggable}
                    >
                        <Flex {...getDialogProps(props)}>{children}</Flex>
                    </ArkDrawer.Content>
                </Container>
            </DrawerFocusScope>
        </ArkDrawer.Positioner>
    );
}, "content");

export interface DrawerHeaderProps extends FlexProps {}

/**
 * Drawer Header — top section for the panel title.
 */
export const Header = withContext(function Component({ children, ...props }: DrawerHeaderProps) {
    const { headerId, setHeaderMounted } = useDrawerContext();

    useEffect(() => {
        setHeaderMounted(true);
        return () => setHeaderMounted(false);
    }, [setHeaderMounted]);

    return (
        <Flex
            as={"header"}
            id={headerId}
            {...props}
        >
            {typeof children === "string" ? (
                <Heading
                    size="lg"
                    variant={"heading"}
                >
                    {children}
                </Heading>
            ) : (
                children
            )}
        </Flex>
    );
}, "header");

export interface DrawerBodyProps extends FlexProps {}

/**
 * Drawer Body — main content area of the panel.
 */
export const Body = withContext(function Component({ children, style, ...props }: DrawerBodyProps) {
    const { scrollBehavior, bodyId, setBodyMounted } = useDrawerContext();

    useEffect(() => {
        setBodyMounted(true);
        return () => setBodyMounted(false);
    }, [setBodyMounted]);

    return (
        <Flex
            id={bodyId}
            {...props}
            style={{
                overflow: scrollBehavior === "inside" ? "auto" : undefined,
                ...style
            }}
        >
            {children}
        </Flex>
    );
}, "body");

export interface DrawerFooterProps extends FlexProps {}

/**
 * Drawer Footer — bottom section for panel actions.
 */
export const Footer = withContext(function Component({ children, ...props }: DrawerFooterProps) {
    return (
        <Flex
            as={"footer"}
            {...props}
        >
            {children}
        </Flex>
    );
}, "footer");

export interface DrawerCloseButtonProps extends CloseButtonProps {}

/**
 * Drawer Close Button — dismisses the panel.
 */
export const CloseButton = withContext(function Component({ ...props }: DrawerCloseButtonProps) {
    return (
        <ArkDrawer.CloseTrigger asChild>
            <CloseButtonComponent {...props} />
        </ArkDrawer.CloseTrigger>
    );
}, "close");

export interface DrawerGrabberProps extends HTMLDreamyProps<"div"> {}

/**
 * Drawer Grabber — drag handle for resizing or dismissing (use with snap points).
 */
export const Grabber = withContext(function Component(props: DrawerGrabberProps) {
    return (
        <ArkDrawer.Grabber asChild>
            <dreamy.div {...props} />
        </ArkDrawer.Grabber>
    );
}, "grabber");

export interface DrawerGrabberIndicatorProps extends HTMLDreamyProps<"div"> {}

/**
 * Drawer Grabber Indicator — visual pill inside the grabber.
 */
export const GrabberIndicator = withContext(function Component(props: DrawerGrabberIndicatorProps) {
    return (
        <ArkDrawer.GrabberIndicator asChild>
            <dreamy.div {...props} />
        </ArkDrawer.GrabberIndicator>
    );
}, "grabberIndicator");

export interface DrawerTriggerProps extends HTMLDreamyProps<"button"> {
    value?: string;
}

/**
 * Drawer Trigger — opens the drawer (supports `value` for multiple triggers).
 */
export const Trigger = withContext(function Component({ type = "button", ...props }: DrawerTriggerProps) {
    return (
        <ArkDrawer.Trigger asChild>
            <dreamy.button
                type={type}
                {...props}
            />
        </ArkDrawer.Trigger>
    );
}, "trigger");

export interface DrawerTitleProps extends HTMLDreamyProps<"h2"> {}

/**
 * Drawer Title — accessible name wired to Ark dialog semantics.
 */
export const Title = withContext(function Component({ children, ...props }: DrawerTitleProps) {
    return (
        <ArkDrawer.Title asChild>
            <Heading
                as="h2"
                size="lg"
                variant="heading"
                {...props}
            >
                {children}
            </Heading>
        </ArkDrawer.Title>
    );
}, "title");

export interface DrawerDescriptionProps extends TextProps {}

/**
 * Drawer Description — optional accessible description for the panel.
 */
export const Description = withContext(function Component(props: DrawerDescriptionProps) {
    return (
        <ArkDrawer.Description asChild>
            <Text
                as="p"
                {...props}
            />
        </ArkDrawer.Description>
    );
}, "description");

export interface DrawerSwipeAreaProps extends HTMLDreamyProps<"div"> {}

/**
 * Drawer Swipe Area — expanded touch target for swipe gestures.
 */
export const SwipeArea = withContext(function Component(props: DrawerSwipeAreaProps) {
    return (
        <ArkDrawer.SwipeArea asChild>
            <dreamy.div {...props} />
        </ArkDrawer.SwipeArea>
    );
}, "swipeArea");

export type DrawerRootProviderProps = ArkDrawerRootProviderProps;

/**
 * Drawer Root Provider — control the drawer via `useDrawer` from `@ark-ui/react/drawer`.
 */
export function RootProvider(props: DrawerRootProviderProps) {
    return <ArkDrawer.RootProvider {...props} />;
}

export const Stack = ArkDrawer.Stack;
export const IndentBackground = ArkDrawer.IndentBackground;
export const Indent = ArkDrawer.Indent;

interface DrawerFocusScopeProps {
    children: React.ReactElement;
}

function DrawerFocusScope(props: DrawerFocusScopeProps) {
    const {
        autoFocus,
        trapFocus,
        dialogRef,
        initialFocusRef,
        blockScrollOnMount,
        allowPinchZoom,
        finalFocusRef,
        restoreFocus,
        preserveScrollBarGap,
        lockFocusAcrossFrames,
        useInert,
        present
    } = useDrawerContext();

    const index = useDrawerManager(dialogRef, present);

    return (
        <FocusLock
            autoFocus={autoFocus}
            contentRef={dialogRef}
            finalFocusRef={finalFocusRef}
            initialFocusRef={initialFocusRef}
            isDisabled={!trapFocus}
            lockFocusAcrossFrames={lockFocusAcrossFrames}
            restoreFocus={restoreFocus}
        >
            <RemoveScroll
                allowPinchZoom={allowPinchZoom}
                enabled={index === 1 && blockScrollOnMount}
                forwardProps
                inert={useInert}
                removeScrollBar={!preserveScrollBarGap}
            >
                {props.children}
            </RemoveScroll>
        </FocusLock>
    );
}

export type { DrawerPlacement };

export type DrawerOpenChangeDetails = Parameters<
    NonNullable<ArkDrawerRootProps["onOpenChange"]>
>[0];

export type DrawerSnapPointChangeDetails = Parameters<
    NonNullable<ArkDrawerRootProps["onSnapPointChange"]>
>[0];

export type DrawerTriggerValueChangeDetails = Parameters<
    NonNullable<ArkDrawerRootProps["onTriggerValueChange"]>
>[0];

export { useDrawer as useDrawerStore } from "@ark-ui/react/drawer";
