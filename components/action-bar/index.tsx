"use client";

import {
    Portal,
    type PortalProps,
    type UseActionBarProps,
    type UseActionBarReturn,
    transformReducedMotion,
    useActionBar,
    useMotionVariants,
    useReducedMotion
} from "@dreamy-ui/react";
import { AnimatePresence } from "motion/react";
import { createContext, useCallback, useContext } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import type { ActionBarVariantProps } from "styled-system/recipes";
import { actionBar } from "styled-system/recipes";
import { Box, type BoxProps } from "../box";
import { CloseButton, type CloseButtonProps } from "../close-button";
import { MotionBox, type MotionBoxProps } from "../motion";

const { withProvider, withContext } = createStyleContext(actionBar);

const ActionBarContext = createContext<UseActionBarReturn | null>(null);

function useActionBarContext() {
    const context = useContext(ActionBarContext);
    if (!context) {
        throw new Error("useActionBarContext must be used within ActionBar.Root");
    }
    return context;
}

export interface ActionBarRootProps extends BoxProps, ActionBarVariantProps, UseActionBarProps {
    /**
     * Props forwarded to the shared overlay portal.
     */
    portalProps?: Omit<PortalProps, "children">;
}

/**
 * ActionBar component — floating toolbar for bulk selection actions.
 *
 * @see Docs https://dreamy-ui.com/docs/components/action-bar
 *
 * @example
 * ```tsx
 * <ActionBar.Root isOpen={hasSelection}>
 *   <ActionBar.Content>
 *     <ActionBar.SelectionTrigger>{count} selected</ActionBar.SelectionTrigger>
 *     <ActionBar.CloseTrigger />
 *   </ActionBar.Content>
 * </ActionBar.Root>
 * ```
 */
export const Root = withProvider(function ActionBarRoot(props: ActionBarRootProps) {
    const { children, isOpen, defaultIsOpen, onOpen, onClose, portalProps, ...rest } = props;
    const actionBarProps = useActionBar({
        isOpen,
        defaultIsOpen,
        onOpen,
        onClose
    });

    return (
        <ActionBarContext.Provider value={actionBarProps}>
            <Portal
                isActive={actionBarProps.isOpen}
                zIndex="var(--z-index-modal)"
                {...portalProps}
            >
                <AnimatePresence>
                    {actionBarProps.isOpen && (
                        <Box
                            data-state={actionBarProps.isOpen ? "open" : "closed"}
                            {...rest}
                        >
                            {children}
                        </Box>
                    )}
                </AnimatePresence>
            </Portal>
        </ActionBarContext.Provider>
    );
}, "root");

export interface ActionBarContentProps extends MotionBoxProps {}

const StyledContent = withContext(MotionBox, "content");

/**
 * ActionBar Content — animated toolbar panel.
 */
/**
 * Action Bar Content — animated toolbar surface.
 */
export const Content = function ActionBarContent(props: ActionBarContentProps) {
    const { children, ...rest } = props;
    const { isOpen, getContentProps } = useActionBarContext();
    const reduceMotion = useReducedMotion() ?? false;

    const { actionBar: variants } = useMotionVariants();
    const contentProps = getContentProps(rest);
    const motionVariants = transformReducedMotion(variants, reduceMotion);

    return (
        <AnimatePresence propagate>
            {isOpen && (
                <StyledContent
                    animate="animate"
                    data-state={isOpen ? "open" : "closed"}
                    exit="exit"
                    // Avoid animating from opacity 0 when reduced motion is on so
                    // toolbar actions are immediately focusable / operable.
                    initial={reduceMotion ? false : "initial"}
                    variants={motionVariants}
                    {...contentProps}
                >
                    {children}
                </StyledContent>
            )}
        </AnimatePresence>
    );
};

export interface ActionBarSelectionTriggerProps extends HTMLDreamyProps<"span"> {}

/**
 * ActionBar SelectionTrigger — shows the current selection summary.
 */
/**
 * Action Bar Selection Trigger — displays the selection count or status.
 */
export const SelectionTrigger = withContext(function ActionBarSelectionTrigger(
    props: ActionBarSelectionTriggerProps
) {
    const { children, ...rest } = props;
    const { isOpen } = useActionBarContext();

    return (
        <dreamy.span
            data-state={isOpen ? "open" : "closed"}
            {...rest}
        >
            {children}
        </dreamy.span>
    );
}, "selectionTrigger");

export interface ActionBarSeparatorProps extends HTMLDreamyProps<"div"> {}

/**
 * ActionBar Separator — vertical divider between toolbar sections.
 */
/**
 * Action Bar Separator — vertical divider between toolbar sections.
 */
export const Separator = withContext(function ActionBarSeparator(props: ActionBarSeparatorProps) {
    return (
        <Box
            aria-orientation="vertical"
            role="separator"
            {...props}
        />
    );
}, "separator");

export interface ActionBarCloseTriggerProps extends CloseButtonProps {}

/**
 * ActionBar CloseTrigger — closes the action bar.
 */
/**
 * Action Bar Close Trigger — button that dismisses the action bar.
 */
export const CloseTrigger = withContext(function ActionBarCloseTrigger(
    props: ActionBarCloseTriggerProps
) {
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
            {...rest}
        />
    );
}, "closeTrigger");
