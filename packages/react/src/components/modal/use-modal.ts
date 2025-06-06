import {
	modalManager,
	useModalManager
} from "@/components/modal/modal-manager";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { callAllHandlers } from "@/utils/call-all";
import type { PropGetter } from "@/utils/props";
import { hideOthers } from "aria-hidden";
import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState
} from "react";

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

	const getDialogProps: PropGetter = useCallback(
		(props: Record<string, any> = {}, ref = null): any => ({
			role: "dialog",
			...props,
			ref: mergeRefs(ref, dialogRef),
			id: dialogId,
			tabIndex: -1,
			"aria-modal": true,
			"aria-labelledby": headerMounted ? headerId : undefined,
			"aria-describedby": bodyMounted ? bodyId : undefined,
			onClick: callAllHandlers(
				props?.onClick,
				(event: React.MouseEvent) => event.stopPropagation()
			)
		}),
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

	const getDialogContainerProps: PropGetter = useCallback(
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
export function useAriaHidden(
	ref: React.RefObject<HTMLElement>,
	shouldHide: boolean
) {
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
