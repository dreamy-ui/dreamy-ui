"use client";

import {
    DrawerContextProvider,
    type DrawerOptions,
    type DrawerPlacement,
    FocusLock,
    Portal,
    type PortalProps,
    RemoveScroll,
    type UseDrawerProps,
    useDefaultTransition,
    useDrawer,
    useDrawerContext,
    useDrawerManager,
    useMotionVariants
} from "@dreamy-ui/react";
import { AnimatePresence, usePresence } from "motion/react";
import { useEffect, useMemo } from "react";
import { createStyleContext } from "styled-system/jsx";
import { drawer } from "styled-system/recipes";
import { Box, type BoxProps } from "./box";
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "./close-button";
import { Flex, type FlexProps } from "./flex";
import { Heading } from "./heading";
import { MotionBox, type MotionBoxProps, MotionFlex, type MotionFlexProps } from "./motion";

const { withContext, withRootProvider } = createStyleContext(drawer, {
    forwardVariants: ["placement"]
});

export interface DrawerProps extends UseDrawerProps, DrawerOptions {
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
 * <Drawer.Root isOpen={isOpen} onClose={onClose}>
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
        returnFocusOnClose: true,
        blockScrollOnMount: true,
        allowPinchZoom: false,
        preserveScrollBarGap: true,
        placement: "right",
        ...props
    };

    const {
        children,
        autoFocus,
        trapFocus,
        initialFocusRef,
        finalFocusRef,
        returnFocusOnClose,
        blockScrollOnMount,
        scrollBehavior,
        allowPinchZoom,
        preserveScrollBarGap,
        onCloseComplete,
        portalProps,
        placement
    } = drawerProps;

    const drawerState = useDrawer(drawerProps);

    // biome-ignore lint/correctness/useExhaustiveDependencies: context should update when drawer state changes
    const context = useMemo(() => {
        return {
            ...drawerState,
            autoFocus,
            trapFocus,
            initialFocusRef,
            finalFocusRef,
            returnFocusOnClose,
            blockScrollOnMount,
            allowPinchZoom,
            preserveScrollBarGap,
            onCloseComplete,
            scrollBehavior,
            placement: placement ?? "right"
        };
    }, [drawerState]);

    return (
        <DrawerContextProvider value={context}>
            <AnimatePresence onExitComplete={onCloseComplete}>
                {context.isOpen && (
                    <Portal
                        isActive={context.isOpen}
                        key={context.id}
                        zIndex="var(--z-index-modal)"
                        {...portalProps}
                    >
                        {children}
                    </Portal>
                )}
            </AnimatePresence>
        </DrawerContextProvider>
    );
});

export interface DrawerOverlayProps extends MotionBoxProps {}

/**
 * Drawer Overlay — backdrop behind the panel content.
 */
export const Overlay = withContext(function Component(props: DrawerOverlayProps) {
    const { isOpen } = useDrawerContext();
    const { overlay } = useMotionVariants();

    return (
        <AnimatePresence>
            {isOpen && (
                <MotionBox
                    animate="animate"
                    exit="exit"
                    initial="initial"
                    variants={overlay}
                    {...props}
                />
            )}
        </AnimatePresence>
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
    const { getDialogProps, placement } = useDrawerContext();
    const { drawer } = useMotionVariants();
    const transition = useDefaultTransition();

    return (
        <DrawerFocusScope>
            <Container>
                <MotionFlex
                    animate="animate"
                    custom={{ placement }}
                    exit="exit"
                    initial="initial"
                    transition={transition}
                    variants={drawer}
                    {...getDialogProps(props)}
                >
                    {children}
                </MotionFlex>
            </Container>
        </DrawerFocusScope>
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
        returnFocusOnClose,
        preserveScrollBarGap,
        lockFocusAcrossFrames,
        useInert,
        isOpen
    } = useDrawerContext();

    const [isPresent, safeToRemove] = usePresence();

    useEffect(() => {
        if (!isPresent && safeToRemove) {
            setTimeout(safeToRemove);
        }
    }, [isPresent, safeToRemove]);

    const index = useDrawerManager(dialogRef, isOpen);

    return (
        <FocusLock
            autoFocus={autoFocus}
            contentRef={dialogRef}
            finalFocusRef={finalFocusRef}
            initialFocusRef={initialFocusRef}
            isDisabled={!trapFocus}
            lockFocusAcrossFrames={lockFocusAcrossFrames}
            restoreFocus={returnFocusOnClose}
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

type ScrollBehavior = "inside" | "outside";

export type { DrawerPlacement };
