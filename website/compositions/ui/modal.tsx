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
import { CloseButton, type CloseButtonProps } from "./close-button";
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
const ModalRoot = withRootProvider(function ModalRoot(props: ModalProps) {
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

export interface ModalOverlayProps extends MotionBoxProps {}

const ModalOverlay = withContext(
    forwardRef<HTMLDivElement, ModalOverlayProps>((props, ref) => {
        const { isOpen } = useModalContext();
        const { overlay } = useMotionVariants();

        return (
            <AnimatePresence>
                {isOpen && (
                    <MotionBox
                        variants={overlay.default}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        ref={ref}
                        {...props}
                    />
                )}
            </AnimatePresence>
        );
    }),
    "overlay"
);

export interface ModalContainerProps extends BoxProps {}

const ModalContainer = withContext(
    forwardRef<HTMLDivElement, ModalContainerProps>(({ children, ...props }, ref) => {
        const { getDialogContainerProps } = useModalContext();

        return <Box {...getDialogContainerProps(props, ref)}>{children}</Box>;
    }),
    "container"
);

export interface ModalContentProps extends MotionFlexProps {}

const ModalContent = withContext(
    forwardRef<HTMLDivElement, ModalContentProps>(({ children, ...props }, ref) => {
        const { getDialogProps } = useModalContext();
        const { modal } = useMotionVariants();
        const transition = useDefaultTransition();

        return (
            <>
                <ModalFocusScope>
                    <ModalContainer>
                        <MotionFlex
                            variants={modal.default}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={transition}
                            {...getDialogProps(props, ref)}
                        >
                            {children}
                        </MotionFlex>
                    </ModalContainer>
                </ModalFocusScope>
            </>
        );
    }),
    "content"
);

export interface ModalHeaderProps extends FlexProps {}

const ModalHeader = withContext(
    forwardRef<HTMLDivElement, ModalHeaderProps>(({ children, ...props }, ref) => {
        return (
            <Flex
                as={"header"}
                {...props}
                ref={ref}
            >
                {typeof children === "string" ? (
                    <Heading
                        variant={"heading"}
                        size="lg"
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

export interface ModalBodyProps extends FlexProps {}

const ModalBody = withContext(
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

export interface ModalFooterProps extends FlexProps {}

const ModalFooter = withContext(
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

export interface ModalCloseButtonProps extends CloseButtonProps {}

const ModalCloseButton = withContext(
    forwardRef<HTMLButtonElement, ModalCloseButtonProps>(({ ...props }, ref) => {
        const { onClose } = useModalContext();

        return (
            <CloseButton
                ref={ref}
                onClick={onClose}
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
            isDisabled={!trapFocus}
            initialFocusRef={initialFocusRef}
            finalFocusRef={finalFocusRef}
            restoreFocus={returnFocusOnClose}
            contentRef={dialogRef}
            lockFocusAcrossFrames={lockFocusAcrossFrames}
        >
            <RemoveScroll
                removeScrollBar={!preserveScrollBarGap}
                allowPinchZoom={allowPinchZoom}
                // only block scroll for first dialog
                enabled={index === 1 && blockScrollOnMount}
                forwardProps
                inert={useInert}
            >
                {props.children}
            </RemoveScroll>
        </FocusLock>
    );
}

type ScrollBehavior = "inside" | "outside";

export namespace Modal {
    export const Root = ModalRoot;
    export const Overlay = ModalOverlay;
    export const Container = ModalContainer;
    export const Content = ModalContent;
    export const Header = ModalHeader;
    export const Body = ModalBody;
    export const Footer = ModalFooter;
    export const CloseButton = ModalCloseButton;
}
