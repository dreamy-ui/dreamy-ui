"use client";

import {
    Drawer as ArkDrawer,
    type DrawerRootProps as ArkDrawerRootProps
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createStyleContext } from "styled-system/jsx";
import { drawer } from "styled-system/recipes";
import { Box, type BoxProps } from "../box";
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "../close-button";
import { Flex, type FlexProps } from "../flex";
import { Heading } from "../heading";
import { MotionBox, type MotionBoxProps, MotionFlex, type MotionFlexProps } from "../motion";
import { useFloatingPresent } from "../popover/use-floating-present";

const { withContext, withRootProvider } = createStyleContext(drawer, {
    forwardVariants: ["placement"]
});

type ScrollBehavior = "inside" | "outside";

export interface DrawerProps
    extends Omit<ArkDrawerRootProps, "children">,
        DrawerOptions,
        Pick<UseDrawerProps, "useInert"> {
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
        closeOnEscape,
        closeOnInteractOutside,
        useInert,
        id,
        ...arkRest
    } = drawerProps;

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

    const handleMotionExitComplete = useCallback(() => {
        handleExitComplete();
        onCloseComplete?.();
    }, [handleExitComplete, onCloseComplete]);

    useEffect(() => {
        if (!open && reduceMotion) {
            onCloseComplete?.();
        }
    }, [open, onCloseComplete, reduceMotion]);

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
            reduceMotion,
            onExitAnimationComplete: handleMotionExitComplete
        };
    }, [
        allowPinchZoom,
        autoFocus,
        blockScrollOnMount,
        drawerState,
        finalFocusRef,
        handleMotionExitComplete,
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
            onOpenChange={handleOpenChange}
            open={open}
            placement={placement}
            present={present}
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

export interface DrawerContentProps extends MotionFlexProps {}

/**
 * Drawer Content — slide-over surface and focus scope.
 */
export const Content = withContext(function Component({
    children,
    ...props
}: DrawerContentProps) {
    const { getDialogProps, placement, open, reduceMotion, onExitAnimationComplete } =
        useDrawerContext();
    const { drawer: drawerVariants } = useMotionVariants();
    const transition = useDefaultTransition();
    const exitNotifiedRef = useRef(false);

    useEffect(() => {
        if (open) {
            exitNotifiedRef.current = false;
        }
    }, [open]);

    return (
        <ArkDrawer.Positioner>
            <DrawerFocusScope>
                <Container>
                    <ArkDrawer.Content asChild>
                        <MotionFlex
                            animate={open ? "animate" : "exit"}
                            custom={{ placement }}
                            exit="exit"
                            initial={reduceMotion ? false : "initial"}
                            transition={transition}
                            variants={transformReducedMotion(drawerVariants, reduceMotion ?? false)}
                            onAnimationComplete={() => {
                                if (!open && !reduceMotion && !exitNotifiedRef.current) {
                                    exitNotifiedRef.current = true;
                                    onExitAnimationComplete?.();
                                }
                            }}
                            {...(reduceMotion ? {} : { hidden: false })}
                            {...getDialogProps(props)}
                        >
                            {children}
                        </MotionFlex>
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
    const { onClose } = useDrawerContext();

    return (
        <CloseButtonComponent
            onClick={onClose}
            {...props}
        />
    );
}, "close");

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
