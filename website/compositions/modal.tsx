"use client";

import {
	FocusLock,
	ModalContextProvider,
	Portal,
	PortalProps,
	RemoveScroll,
	useDefaultTransition,
	useModal,
	useModalContext,
	UseModalProps,
	UseModalReturn,
	useMotionVariants
} from "@dreamy-ui/react";
import { AnimatePresence, usePresence } from "motion/react";
import { forwardRef, RefObject, useEffect, useMemo, useState } from "react";
import { modal } from "styled-system/recipes";
import { Box, BoxProps } from "./box";
import { CloseButton, CloseButtonProps } from "./close-button";
import { Flex, FlexProps } from "./flex";
import { Heading } from "./heading";
import {
	MotionBox,
	MotionBoxProps,
	MotionFlex,
	MotionFlexProps
} from "./motion";
import { createStyleContext } from "./style-context";

const { withProvider, withContext } = createStyleContext(modal);

interface ModalContext extends ModalOptions, UseModalReturn {
	scrollBehavior?: "inside" | "outside";
}

/**
 * Modal component
 *
 * @See Docs https://dreamy-ui.com/docs/components/modal
 */
export const Modal = withProvider(function ModalRoot(props: ModalProps) {
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
					<Portal key={context.id} {...portalProps}>
						{children}
					</Portal>
				)}
			</AnimatePresence>
		</ModalContextProvider>
	);
});

export interface ModalOverlayProps extends MotionBoxProps {}

export const ModalOverlay = withContext(
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

export interface ModalContainerProps extends MotionFlexProps {}

export const ModalContainer = withContext(
	forwardRef<HTMLDivElement, BoxProps>(({ children, ...props }, ref) => {
		const { getDialogContainerProps } = useModalContext();

		return <Box {...getDialogContainerProps(props, ref)}>{children}</Box>;
	}),
	"container"
);

export interface ModalContentProps extends MotionFlexProps {}

export const ModalContent = withContext(
	forwardRef<HTMLDivElement, MotionFlexProps>(
		({ children, ...props }, ref) => {
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
								{...(getDialogProps(props as any, ref) as any)}
							>
								{children}
							</MotionFlex>
						</ModalContainer>
					</ModalFocusScope>
				</>
			);
		}
	),
	"content"
);

export interface ModalHeaderProps extends FlexProps {}

export const ModalHeader = withContext(
	forwardRef<HTMLDivElement, ModalHeaderProps>(
		({ children, ...props }, ref) => {
			return (
				<Flex as={"header"} {...props} ref={ref}>
					{typeof children === "string" ? (
						<Heading variant={"heading"} size="lg">
							{children}
						</Heading>
					) : (
						children
					)}
				</Flex>
			);
		}
	),
	"header"
);

export interface ModalBodyProps extends FlexProps {}

export const ModalBody = withContext(
	forwardRef<HTMLDivElement, ModalBodyProps>(
		({ children, style, ...props }, ref) => {
			const { scrollBehavior } = useModalContext();

			return (
				<Flex
					ref={ref}
					{...props}
					style={{
						maxHeight:
							scrollBehavior === "inside"
								? "calc(100vh - 10rem)"
								: undefined,
						overflow:
							scrollBehavior === "inside" ? "auto" : undefined,
						...style
					}}
				>
					{children}
				</Flex>
			);
		}
	),
	"body"
);

export interface ModalFooterProps extends FlexProps {}

export const ModalFooter = withContext(
	forwardRef<HTMLDivElement, ModalFooterProps>(
		({ children, ...props }, ref) => {
			return (
				<Flex as={"footer"} {...props} ref={ref}>
					{children}
				</Flex>
			);
		}
	),
	"footer"
);

export interface ModalCloseButtonProps extends CloseButtonProps {}

export const ModalCloseButton = withContext(
	forwardRef<HTMLButtonElement, ModalCloseButtonProps>(
		({ ...props }, ref) => {
			const { onClose } = useModalContext();

			return <CloseButton ref={ref} onClick={onClose} {...props} />;
		}
	),
	"close"
);

interface ModalFocusScopeProps {
	children: React.ReactElement;
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

export function useModalManager(
	ref: RefObject<HTMLElement | null>,
	isOpen?: boolean
) {
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

type ScrollBehavior = "inside" | "outside";

export interface FocusLockProps {
	/**
	 * `ref` of the element to receive focus initially
	 */
	initialFocusRef?: React.RefObject<FocusableElement | null>;
	/**
	 * `ref` of the element to return focus to when `FocusLock`
	 * unmounts
	 */
	finalFocusRef?: React.RefObject<FocusableElement | null>;
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
