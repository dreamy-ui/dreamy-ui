import { mergeRefs } from "@/hooks/use-merge-refs";
import { createContext } from "@/provider";
import { callAllHandlers } from "@/utils/call-all";
import { hideOthers } from "aria-hidden";
import {
    type ForwardedRef,
    type RefObject,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState
} from "react";

export { RemoveScroll } from "react-remove-scroll";

export interface FocusableElement {
    focus(options?: FocusOptions): void;
}

export interface ModalOptions {
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
    initialFocusRef?: React.RefObject<FocusableElement | null>;
    /**
     * The `ref` of element to receive focus when the modal closes.
     */
    finalFocusRef?: React.RefObject<FocusableElement | null>;
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

interface ModalContext extends ModalOptions, UseModalReturn {
    scrollBehavior?: "inside" | "outside";
}

export const [ModalContextProvider, useModalContext] = createContext<ModalContext>({
    strict: true,
    name: "ModalContext",
    errorMessage:
        "useModalContext: `context` is undefined. Seems you forgot to wrap modal components in `<Modal />`"
});

export interface UseModalProps {
    /**
     * If `true`, the modal will be open.
     */
    isOpen: boolean;
    /**
     * The `id` of the modal
     */
    id?: string;
    /**
     * Callback invoked to close the modal.
     */
    onClose(): void;
    /**
     * If `true`, the modal will close when the overlay is clicked
     * @default true
     */
    closeOnOverlayClick?: boolean;
    /**
     * If `true`, the modal will close when the `Esc` key is pressed
     * @default true
     */
    closeOnEsc?: boolean;
    /**
     * Callback fired when the overlay is clicked.
     */
    onOverlayClick?(): void;
    /**
     * Callback fired when the escape key is pressed and focus is within modal
     */
    onEsc?(): void;
    /**
     * A11y: If `true`, the siblings of the `modal` will have `aria-hidden`
     * set to `true` so that screen readers can only see the `modal`.
     *
     * This is commonly known as making the other elements **inert**
     *
     * @default true
     */
    useInert?: boolean;
    scrollBehavior?: "inside" | "outside";
}

/**
 * Modal hook that manages all the logic for the modal dialog widget
 * and returns prop getters, state and actions.
 *
 * @param props
 */
export function useModal(props: UseModalProps) {
    const {
        isOpen,
        onClose,
        id: idProp,
        closeOnOverlayClick = true,
        closeOnEsc = true,
        useInert = true,
        onOverlayClick: onOverlayClickProp,
        onEsc,
        scrollBehavior
    } = props;

    const dialogRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const [id, dialogId, headerId, bodyId] = useIds(
        idProp,
        "dreamy-modal",
        "dreamy-modal--header",
        "dreamy-modal--body"
    );

    /**
     * Hook used to polyfill `aria-modal` for older browsers.
     * It uses `aria-hidden` to all other nodes.
     *
     * @see https://developer.paciellogroup.com/blog/2018/06/the-current-state-of-modal-dialog-accessibility/
     */
    useAriaHidden(dialogRef as any, isOpen && useInert);

    /**
     * Hook used to manage multiple or nested modals
     */
    const index = useModalManager(dialogRef, isOpen);

    const mouseDownTarget = useRef<EventTarget | null>(null);

    const onMouseDown = useCallback((event: React.MouseEvent) => {
        mouseDownTarget.current = event.target;
    }, []);

    const onKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === "Escape") {
                event.stopPropagation();

                if (closeOnEsc) {
                    onClose?.();
                }

                onEsc?.();
            }
        },
        [closeOnEsc, onClose, onEsc]
    );

    const [headerMounted, setHeaderMounted] = useState(false);
    const [bodyMounted, setBodyMounted] = useState(false);

    const getDialogProps = useCallback(
        (props: Record<string, any> = {}, ref: ForwardedRef<HTMLDivElement> | null = null): any =>
            ({
                role: "dialog",
                ...props,
                ref: mergeRefs(ref, dialogRef),
                id: dialogId,
                tabIndex: -1,
                "aria-modal": true,
                "aria-labelledby": headerMounted ? headerId : undefined,
                "aria-describedby": bodyMounted ? bodyId : undefined,
                onClick: callAllHandlers(props?.onClick, (event: React.MouseEvent) =>
                    event.stopPropagation()
                )
            }) as const,
        [bodyId, bodyMounted, dialogId, headerId, headerMounted]
    );

    const onOverlayClick = useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            /**
             * Make sure the event starts and ends on the same DOM element.
             *
             * This is used to prevent the modal from closing when you
             * start dragging from the content, and release drag outside the content.
             *
             * We prevent this because it is technically not a considered "click outside"
             */
            if (mouseDownTarget.current !== event.target) return;

            /**
             * When you click on the overlay, we want to remove only the topmost modal
             */
            if (!modalManager.isTopModal(dialogRef.current)) return;

            if (closeOnOverlayClick) {
                onClose?.();
            }

            onOverlayClickProp?.();
        },
        [onClose, closeOnOverlayClick, onOverlayClickProp]
    );

    const getDialogContainerProps = useCallback(
        (props: Record<string, any> = {}, ref = null) => {
            return {
                ...props,
                ref: mergeRefs(ref, overlayRef),
                onClick: callAllHandlers(props.onClick, onOverlayClick),
                onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown),
                onMouseDown: callAllHandlers(props.onMouseDown, onMouseDown),
                style: {
                    overflow: scrollBehavior === "inside" ? "hidden" : "auto",
                    overscrollBehaviorY: "none"
                }
            };
        },
        [onKeyDown, onMouseDown, onOverlayClick, scrollBehavior]
    );

    return {
        isOpen,
        onClose,
        headerId,
        bodyId,
        setBodyMounted,
        setHeaderMounted,
        dialogRef,
        overlayRef,
        getDialogProps,
        getDialogContainerProps,
        useInert,
        index,
        id
    };
}

export type UseModalReturn = ReturnType<typeof useModal>;

function useIds(idProp?: string, ...prefixes: string[]) {
    const reactId = useId();
    const id = idProp || reactId;
    return useMemo(() => {
        return [id, ...prefixes.map((prefix) => `${prefix}-${id}`)];
    }, [id, prefixes]);
}

/**
 * Modal hook to polyfill `aria-modal`.
 *
 * It applies `aria-hidden` to elements behind the modal
 * to indicate that they're `inert`.
 *
 * @param ref React ref of the node
 * @param shouldHide whether `aria-hidden` should be applied
 */
export function useAriaHidden(ref: React.RefObject<HTMLElement>, shouldHide: boolean) {
    // save current ref in a local var to trigger the effect on identity change
    const currentElement = ref.current;

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        // keep using `ref.current` inside the effect
        // it may have changed during render and the execution of the effect
        if (!ref.current || !shouldHide) return undefined;

        return hideOthers(ref.current);
    }, [shouldHide, ref, currentElement]);
}

class ModalManager {
    modals: Map<HTMLElement, number>;
    constructor() {
        this.modals = new Map();
    }

    add(modal: HTMLElement) {
        this.modals.set(modal, this.modals.size + 1);
        return this.modals.size;
    }

    remove(modal: HTMLElement) {
        this.modals.delete(modal);
    }

    isTopModal(modal: HTMLElement | null) {
        if (!modal) return false;
        return this.modals.get(modal) === this.modals.size;
    }
}

export const modalManager = new ModalManager();

export function useModalManager(ref: RefObject<HTMLElement | null>, isOpen?: boolean) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const node = ref.current;

        if (!node) return;

        if (isOpen) {
            const index = modalManager.add(node);
            setIndex(index);
        }

        return () => {
            modalManager.remove(node);
            setIndex(0);
        };
    }, [isOpen, ref]);

    return index;
}
