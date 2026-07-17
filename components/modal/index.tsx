"use client";

import {
    FocusLock,
    ModalContextProvider,
    type ModalOptions,
    Portal,
    type PortalProps,
    RemoveScroll,
    type UseModalProps,
    useDefaultTransition,
    useModal,
    useModalContext,
    useModalManager,
    useMotionVariants
} from "@dreamy-ui/react";
import { AnimatePresence, usePresence } from "motion/react";
import { useEffect, useMemo } from "react";
import { createStyleContext } from "styled-system/jsx";
import { modal } from "styled-system/recipes";
import { Box, type BoxProps } from "../box";
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "../close-button";
import { Flex, type FlexProps } from "../flex";
import { Heading } from "../heading";
import { MotionBox, type MotionBoxProps, MotionFlex, type MotionFlexProps } from "../motion";

const { withContext, withRootProvider } = createStyleContext(modal);

export interface ModalProps extends UseModalProps, ModalOptions {
    children: React.ReactNode;
    /**
     * Where scroll behavior should originate.
     * - If set to `inside`, scroll only occurs within the `ModalBody`.
     * - If set to `outside`, the entire `ModalContent` will scroll within the viewport.
     *
     * @default "outside"
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
 * <Modal.Root isOpen={isOpen} onClose={onClose}>
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
        returnFocusOnClose: true,
        blockScrollOnMount: true,
        allowPinchZoom: false,
        preserveScrollBarGap: true,
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
        portalProps
    } = modalProps;

    const modal = useModal(modalProps);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const context = useMemo(() => {
        return {
            ...modal,
            autoFocus,
            trapFocus,
            initialFocusRef,
            finalFocusRef,
            returnFocusOnClose,
            blockScrollOnMount,
            allowPinchZoom,
            preserveScrollBarGap,
            onCloseComplete,
            scrollBehavior
        };
    }, [modal]);

    return (
        <ModalContextProvider value={context}>
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
        </ModalContextProvider>
    );
});

export interface ModalOverlayProps extends MotionBoxProps {}

/**
 * Modal Overlay — backdrop behind the dialog content.
 */
export const Overlay = withContext(function Component(props: ModalOverlayProps) {
    const { isOpen } = useModalContext();
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
    const { getDialogProps } = useModalContext();
    const { modal } = useMotionVariants();
    const transition = useDefaultTransition();

    return (
        <>
            <ModalFocusScope>
                <Container>
                    <MotionFlex
                        animate="animate"
                        exit="exit"
                        initial="initial"
                        transition={transition}
                        variants={modal}
                        {...getDialogProps(props)}
                    >
                        {children}
                    </MotionFlex>
                </Container>
            </ModalFocusScope>
        </>
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
        returnFocusOnClose,
        preserveScrollBarGap,
        lockFocusAcrossFrames,
        useInert,
        isOpen
    } = useModalContext();

    const [isPresent, safeToRemove] = usePresence();

    useEffect(() => {
        if (!isPresent && safeToRemove) {
            setTimeout(safeToRemove);
        }
    }, [isPresent, safeToRemove]);

    const index = useModalManager(dialogRef, isOpen);

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

type ScrollBehavior = "inside" | "outside";
