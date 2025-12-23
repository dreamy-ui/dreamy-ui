"use client";

import {
	type UseControllableReturn,
	useControllable,
	type useControllableProps,
	useMotionVariants
} from "@dreamy-ui/react";
import { AnimatePresence } from "motion/react";
import { createContext, forwardRef, useCallback, useContext } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import type { ActionBarVariantProps } from "styled-system/recipes";
import { actionBar } from "styled-system/recipes";
import { Box, type BoxProps } from "./box";
import { CloseButton, type CloseButtonProps } from "./close-button";
import { MotionBox, type MotionBoxProps } from "./motion";

const { withProvider, withContext } = createStyleContext(actionBar);

const ActionBarContext = createContext<UseControllableReturn | null>(null);

function useActionBarContext() {
	const context = useContext(ActionBarContext);
	if (!context) {
		throw new Error("useActionBarContext must be used within ActionBar.Root");
	}
	return context;
}

export interface ActionBarRootProps extends BoxProps, ActionBarVariantProps, useControllableProps {}

export const Root = withProvider(
	forwardRef<HTMLDivElement, ActionBarRootProps>(function ActionBarRoot(props, ref) {
		const { children, isOpen, defaultIsOpen, onOpen, onClose, ...rest } = props;
		const actionBarProps = useControllable({
			isOpen,
			defaultIsOpen,
			onOpen,
			onClose
		});

		return (
			<ActionBarContext.Provider value={actionBarProps}>
				<AnimatePresence>
					{isOpen && (
						<Box
							data-state={actionBarProps.isOpen ? "open" : "closed"}
							ref={ref}
							{...rest}
						>
							{children}
						</Box>
					)}
				</AnimatePresence>
			</ActionBarContext.Provider>
		);
	}),
	"root"
);

export interface ActionBarContentProps extends MotionBoxProps {}

const ActionBarContent = withContext(
	forwardRef<HTMLDivElement, ActionBarContentProps>(function ActionBarContent(props, ref) {
		const { children, ...rest } = props;
		const { isOpen } = useActionBarContext();

		const {
			actionBar: { default: variants }
		} = useMotionVariants();

		return (
			<AnimatePresence propagate>
				{isOpen && (
					<MotionBox
						animate="animate"
						aria-label="Action bar"
						data-state={isOpen ? "open" : "closed"}
						exit="exit"
						initial="initial"
						ref={ref}
						role="dialog"
						variants={variants}
						{...rest}
					>
						{children}
					</MotionBox>
				)}
			</AnimatePresence>
		);
	}),
	"content"
);

export interface ActionBarSelectionTriggerProps extends HTMLDreamyProps<"span"> {}

export const SelectionTrigger = withContext(
	forwardRef<HTMLSpanElement, ActionBarSelectionTriggerProps>(
		function ActionBarSelectionTrigger(props, ref) {
			const { children, ...rest } = props;
			const { isOpen } = useActionBarContext();

			return (
				<dreamy.span data-state={isOpen ? "open" : "closed"} ref={ref} {...rest}>
					{children}
				</dreamy.span>
			);
		}
	),
	"selectionTrigger"
);

export interface ActionBarSeparatorProps extends HTMLDreamyProps<"div"> {}

export const Separator = withContext(
	forwardRef<HTMLDivElement, ActionBarSeparatorProps>(function ActionBarSeparator(props, ref) {
		return <Box aria-orientation="vertical" ref={ref} role="separator" {...props} />;
	}),
	"separator"
);

export interface ActionBarCloseTriggerProps extends CloseButtonProps {}

export const CloseTrigger = withContext(
	forwardRef<HTMLButtonElement, ActionBarCloseTriggerProps>(
		function ActionBarCloseTrigger(props, ref) {
			const { children, onClick, ...rest } = props;
			const { onClose } = useActionBarContext();

			const handleClick = useCallback(
				(event: React.MouseEvent<HTMLButtonElement>) => {
					onClick?.(event);
					onClose();
				},
				[onClick, onClose]
			);

			return (
				<CloseButton
					aria-label="Close action bar"
					onClick={handleClick}
					ref={ref}
					{...rest}
				/>
			);
		}
	),
	"closeTrigger"
);

