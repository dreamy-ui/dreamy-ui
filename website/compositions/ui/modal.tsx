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
import { forwardRef, useEffect, useMemo } from "react";
import { createStyleContext } from "styled-system/jsx";
import { modal } from "styled-system/recipes";
import { Box, type BoxProps } from "./box";
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "./close-button";
import { Flex, type FlexProps } from "./flex";
import { Heading } from "./heading";
import { MotionBox, type MotionBoxProps, MotionFlex, type MotionFlexProps } from "./motion";

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
    portalProps?: PortalProps;
}

/**
 * Modal component
 *
 * @See Docs https://dreamy-ui.com/docs/components/modal
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
                        key={context.id}
                        {...portalProps}
                    >
                        {children}
                    </Portal>
                )}
            </AnimatePresence>
        </ModalContextProvider>
    );
});

export interface ModalOverlayProps extends MotionBoxProps { }

export const Overlay = withContext(
    forwardRef<HTMLDivElement, ModalOverlayProps>((props, ref) => {
        const { isOpen } = useModalContext();
        const { overlay } = useMotionVariants();

        return (
            <AnimatePresence>
                {isOpen && (
                    <MotionBox
                        animate="animate"
                        exit="exit"
                        initial="initial"
                        ref={ref}
                        variants={overlay.default}
                        {...props}
                    />
                )}
            </AnimatePresence>
        );
    }),
    "overlay"
);

interface ModalContainerProps extends BoxProps { }

const Container = withContext(
    forwardRef<HTMLDivElement, ModalContainerProps>(({ children, ...props }, ref) => {
        const { getDialogContainerProps } = useModalContext();

        return <Box {...getDialogContainerProps(props, ref)}>{children}</Box>;
    }),
    "container"
);

export interface ModalContentProps extends MotionFlexProps { }

export const Content = withContext(
    forwardRef<HTMLDivElement, ModalContentProps>(({ children, ...props }, ref) => {
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
                            variants={modal.default}
                            {...getDialogProps(props, ref)}
                        >
                            {children}
                        </MotionFlex>
                    </Container>
                </ModalFocusScope>
            </>
        );
    }),
    "content"
);

export interface ModalHeaderProps extends FlexProps { }

export const Header = withContext(
    forwardRef<HTMLDivElement, ModalHeaderProps>(({ children, ...props }, ref) => {
        return (
            <Flex
                as={"header"}
                {...props}
                ref={ref}
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
    }),
    "header"
);

export interface ModalBodyProps extends FlexProps { }

export const Body = withContext(
    forwardRef<HTMLDivElement, ModalBodyProps>(({ children, style, ...props }, ref) => {
        const { scrollBehavior } = useModalContext();

        return (
            <Flex
                ref={ref}
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
    }),
    "body"
);

export interface ModalFooterProps extends FlexProps { }

export const Footer = withContext(
    forwardRef<HTMLDivElement, ModalFooterProps>(({ children, ...props }, ref) => {
        return (
            <Flex
                as={"footer"}
                {...props}
                ref={ref}
            >
                {children}
            </Flex>
        );
    }),
    "footer"
);

export interface ModalCloseButtonProps extends CloseButtonProps { }

export const CloseButton = withContext(
    forwardRef<HTMLButtonElement, ModalCloseButtonProps>(({ ...props }, ref) => {
        const { onClose } = useModalContext();

        return (
            <CloseButtonComponent
                onClick={onClose}
                ref={ref}
                {...props}
            />
        );
    }),
    "close"
);

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
