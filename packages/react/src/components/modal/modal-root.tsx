import { type UseModalProps, type UseModalReturn, useModal } from "@/components/modal/use-modal";
import { Portal, type PortalProps } from "@/components/portal";
import { createContext } from "@/provider/create-context";
import { AnimatePresence } from "motion/react";
import { useMemo } from "react";

interface ModalContext extends ModalOptions, UseModalReturn {
    scrollBehavior?: "inside" | "outside";
}

export const [ModalContextProvider, useModalContext] = createContext<ModalContext>({
    strict: true,
    name: "ModalContext",
    errorMessage:
        "useModalContext: `context` is undefined. Seems you forgot to wrap modal components in `<Modal />`"
});

export function ModalRoot(props: ModalProps) {
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
                {context.isOpen && <Portal {...portalProps}>{children}</Portal>}
            </AnimatePresence>
        </ModalContextProvider>
    );
}

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

interface ModalOptions {
    /**
     * If `false`, focus lock will be disabled completely.
     *
     * This is useful in situations where you still need to interact with
     * other surrounding elements.
     *
     * 🚨Warning: We don't recommend doing this because it hurts the
     * accessibility of the modal, based on WAI-ARIA specifications.
     *
     * @default true
     */
    trapFocus?: boolean;
    /**
     * If `true`, the modal will autofocus the first enabled and interactive
     * element within the `ModalContent`
     *
     * @default true
     */
    autoFocus?: boolean;
    /**
     * The `ref` of element to receive focus when the modal opens.
     */
    initialFocusRef?: React.RefObject<FocusableElement>;
    /**
     * The `ref` of element to receive focus when the modal closes.
     */
    finalFocusRef?: React.RefObject<FocusableElement>;
    /**
     * If `true`, the modal will return focus to the element that triggered it when it closes.
     * @default true
     */
    returnFocusOnClose?: boolean;
    /**
     * If `true`, scrolling will be disabled on the `body` when the modal opens.
     * @default true
     */
    blockScrollOnMount?: boolean;
    /**
     * Handle zoom/pinch gestures on iOS devices when scroll locking is enabled.
     * @default false.
     */
    allowPinchZoom?: boolean;
    /**
     * If `true`, a `padding-right` will be applied to the body element
     * that's equal to the width of the scrollbar.
     *
     * This can help prevent some unpleasant flickering effect
     * and content adjustment when the modal opens
     *
     * @default true
     */
    preserveScrollBarGap?: boolean;

    lockFocusAcrossFrames?: boolean;
}

type ScrollBehavior = "inside" | "outside";

export interface FocusLockProps {
    /**
     * `ref` of the element to receive focus initially
     */
    initialFocusRef?: React.RefObject<FocusableElement>;
    /**
     * `ref` of the element to return focus to when `FocusLock`
     * unmounts
     */
    finalFocusRef?: React.RefObject<FocusableElement>;
    /**
     * The `ref` of the wrapper for which the focus-lock wraps
     */
    contentRef?: React.RefObject<HTMLElement>;
    /**
     * If `true`, focus will be restored to the element that
     * triggered the `FocusLock` once it unmounts
     *
     * @default false
     */
    restoreFocus?: boolean;
    /**
     * If `true`, focus trapping will be disabled
     *
     * @default false
     */
    disabled?: boolean;
    /**
     * If `true`, the first focusable element within the `children`
     * will auto-focused once `FocusLock` mounts
     *
     * @default false
     */
    autoFocus?: boolean;
    /**
     * If `true`, disables text selections inside, and outside focus lock
     *
     * @default false
     */
    persistentFocus?: boolean;
}

interface FocusableElement {
    focus(options?: FocusOptions): void;
}
