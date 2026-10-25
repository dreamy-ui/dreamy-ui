"use client";

import {
    Dialog as ArkDialog,
    type DialogRootProps as ArkDialogRootProps
} from "@ark-ui/react/dialog";
import {
    FocusLock,
    ModalContextProvider,
    type ModalOptions,
    Portal,
    type PortalProps,
    RemoveScroll,
    type UseModalProps,
    transformReducedMotion,
    useDefaultTransition,
    useModal,
    useModalContext,
    useModalManager,
    useMotionVariants,
    useReducedMotion
} from "@dreamy-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createStyleContext } from "styled-system/jsx";
import { modal } from "styled-system/recipes";
import { Box, type BoxProps } from "../box";
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "../close-button";
import { Flex, type FlexProps } from "../flex";
import { Heading } from "../heading";
import { MotionBox, type MotionBoxProps, MotionFlex, type MotionFlexProps } from "../motion";
import { useFloatingPresent } from "../popover/use-floating-present";

const { withContext, withRootProvider } = createStyleContext(modal);

type ScrollBehavior = "inside" | "outside";

export interface ModalProps
    extends Omit<ArkDialogRootProps, "children">,
        ModalOptions,
        Pick<UseModalProps, "useInert"> {
    children: React.ReactNode;
    /**
     * Where scroll behavior should originate.
     * - If set to `inside`, scroll only occurs within the `ModalBody`.
     * - If set to `outside`, the entire `ModalContent` will scroll within the viewport.
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
 * Modal component — accessible dialog overlay.
 *
 * @see Docs https://dreamy-ui.com/docs/components/modal
 *
 * @example
 * ```tsx
 * <Modal.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
 *   <Modal.Overlay />
 *   <Modal.Content>
 *     <Modal.Header>Title</Modal.Header>
 *     <Modal.Body>Body</Modal.Body>
 *   </Modal.Content>
 * </Modal.Root>
 * ```
 */
export const Root = withRootProvider(function ModalRoot(props: ModalProps) {
    const modalProps: ModalProps = {
        scrollBehavior: "inside",
        autoFocus: true,
        trapFocus: true,
        restoreFocus: true,
        blockScrollOnMount: true,
        allowPinchZoom: false,
        preserveScrollBarGap: true,
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
        closeOnEscape,
        closeOnInteractOutside,
        useInert,
        id,
        ...arkRest
    } = modalProps;

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

    const modalState = useModal({
        open,
        present,
        onOpenChange: handleOpenChange,
        id,
        closeOnEscape,
        closeOnInteractOutside,
        useInert,
        scrollBehavior
    });

    const context = useMemo(() => {
        return {
            ...modalState,
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
            reduceMotion,
            onExitAnimationComplete: handleMotionExitComplete
        };
    }, [
        allowPinchZoom,
        autoFocus,
        blockScrollOnMount,
        finalFocusRef,
        handleMotionExitComplete,
        initialFocusRef,
        modalState,
        onCloseComplete,
        preserveScrollBarGap,
        reduceMotion,
        restoreFocus,
        scrollBehavior,
        trapFocus
    ]);

    return (
        <ArkDialog.Root
            {...arkRest}
            closeOnEscape={closeOnEscape}
            closeOnInteractOutside={closeOnInteractOutside}
            defaultOpen={defaultOpen}
            id={id}
            onOpenChange={handleOpenChange}
            open={open}
            present={present}
            unmountOnExit={false}
        >
            <ModalContextProvider value={context}>
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
            </ModalContextProvider>
        </ArkDialog.Root>
    );
});

export interface ModalOverlayProps extends MotionBoxProps {}

/**
 * Modal Overlay — backdrop behind the dialog content.
 */
export const Overlay = withContext(function Component(props: ModalOverlayProps) {
    const { open, reduceMotion } = useModalContext();
    const { overlay } = useMotionVariants();
    const transition = useDefaultTransition();

    return (
        <MotionBox
            animate={open ? "animate" : "exit"}
            exit="exit"
            initial={reduceMotion ? false : "initial"}
            transition={transition}
            variants={transformReducedMotion(overlay, reduceMotion ?? false)}
            {...(reduceMotion ? {} : { hidden: false })}
            {...props}
        />
    );
}, "overlay");

interface ModalContainerProps extends BoxProps {}

const Container = withContext(function Component({ children, ...props }: ModalContainerProps) {
    const { getDialogContainerProps } = useModalContext();

    return <Box {...getDialogContainerProps(props)}>{children}</Box>;
}, "container");

export interface ModalContentProps extends MotionFlexProps {}

/**
 * Modal Content — centered dialog surface and focus scope.
 */
export const Content = withContext(function Component({
    children,
    ...props
}: ModalContentProps) {
    const { getDialogProps, open, reduceMotion, onExitAnimationComplete } = useModalContext();
    const { modal: modalVariants } = useMotionVariants();
    const transition = useDefaultTransition();
    const exitNotifiedRef = useRef(false);

    useEffect(() => {
        if (open) {
            exitNotifiedRef.current = false;
        }
    }, [open]);

    return (
        <ArkDialog.Positioner>
            <ModalFocusScope>
                <Container>
                    <ArkDialog.Content asChild>
                        <MotionFlex
                            animate={open ? "animate" : "exit"}
                            exit="exit"
                            initial={reduceMotion ? false : "initial"}
                            transition={transition}
                            variants={transformReducedMotion(modalVariants, reduceMotion ?? false)}
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
                    </ArkDialog.Content>
                </Container>
            </ModalFocusScope>
        </ArkDialog.Positioner>
    );
}, "content");

export interface ModalHeaderProps extends FlexProps {}

/**
 * Modal Header — top section for the dialog title.
 */
export const Header = withContext(function Component({ children, ...props }: ModalHeaderProps) {
    const { headerId, setHeaderMounted } = useModalContext();

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

export interface ModalBodyProps extends FlexProps {}

/**
 * Modal Body — main content area of the dialog.
 */
export const Body = withContext(function Component({ children, style, ...props }: ModalBodyProps) {
    const { scrollBehavior, bodyId, setBodyMounted } = useModalContext();

    useEffect(() => {
        setBodyMounted(true);
        return () => setBodyMounted(false);
    }, [setBodyMounted]);

    return (
        <Flex
            id={bodyId}
            {...props}
            style={{
                maxHeight: scrollBehavior === "inside" ? "calc(100vh - 10rem)" : undefined,
                overflow: scrollBehavior === "inside" ? "auto" : undefined,
                ...style
            }}
        >
            {children}
        </Flex>
    );
}, "body");

export interface ModalFooterProps extends FlexProps {}

/**
 * Modal Footer — bottom section for dialog actions.
 */
export const Footer = withContext(function Component({ children, ...props }: ModalFooterProps) {
    return (
        <Flex
            as={"footer"}
            {...props}
        >
            {children}
        </Flex>
    );
}, "footer");

export interface ModalCloseButtonProps extends CloseButtonProps {}

/**
 * Modal Close Button — dismisses the dialog.
 */
export const CloseButton = withContext(function Component({ ...props }: ModalCloseButtonProps) {
    const { onClose } = useModalContext();

    return (
        <CloseButtonComponent
            onClick={onClose}
            {...props}
        />
    );
}, "close");

interface ModalFocusScopeProps {
    children: React.ReactElement;
}

function ModalFocusScope(props: ModalFocusScopeProps) {
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
    } = useModalContext();

    const index = useModalManager(dialogRef, present);

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
                // only block scroll for first dialog
                forwardProps
                inert={useInert}
                removeScrollBar={!preserveScrollBarGap}
            >
                {props.children}
            </RemoveScroll>
        </FocusLock>
    );
}
