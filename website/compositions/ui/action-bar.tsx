"use client";

import { type UseActionBarProps, type UseActionBarReturn, useActionBar } from "@dreamy-ui/react";
import { AnimatePresence } from "motion/react";
import { createContext, forwardRef, useCallback, useContext } from "react";
import { createStyleContext } from "styled-system/jsx";
import type { ActionBarVariantProps } from "styled-system/recipes";
import { actionBar } from "styled-system/recipes";
import { Box, type BoxProps } from "./box";
import { CloseButton, type CloseButtonProps } from "./close-button";
import { type HTMLDreamyProps, dreamy } from "./factory";
import { MotionBox, type MotionBoxProps } from "./motion";

const { withProvider, withContext } = createStyleContext(actionBar);

const ActionBarContext = createContext<UseActionBarReturn | null>(null);

function useActionBarContext() {
    const context = useContext(ActionBarContext);
    if (!context) {
        throw new Error("useActionBarContext must be used within ActionBar.Root");
    }
    return context;
}

export interface ActionBarRootProps extends BoxProps, ActionBarVariantProps, UseActionBarProps {}

const ActionBarRoot = withProvider(
    forwardRef<HTMLDivElement, ActionBarRootProps>(function ActionBarRoot(props, ref) {
        const { children, isOpen, defaultIsOpen, onOpen, onClose, ...rest } = props;
        const actionBarProps = useActionBar({
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
                            ref={ref}
                            data-state={actionBarProps.isOpen ? "open" : "closed"}
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

        return (
            <AnimatePresence propagate>
                {isOpen && (
                    <MotionBox
                        ref={ref}
                        role="dialog"
                        aria-label="Action bar"
                        data-state={isOpen ? "open" : "closed"}
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
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

const ActionBarSelectionTrigger = withContext(
    forwardRef<HTMLSpanElement, ActionBarSelectionTriggerProps>(
        function ActionBarSelectionTrigger(props, ref) {
            const { children, ...rest } = props;
            const { isOpen } = useActionBarContext();

            return (
                <dreamy.span
                    ref={ref}
                    data-state={isOpen ? "open" : "closed"}
                    {...rest}
                >
                    {children}
                </dreamy.span>
            );
        }
    ),
    "selectionTrigger"
);

export interface ActionBarSeparatorProps extends HTMLDreamyProps<"div"> {}

const ActionBarSeparator = withContext(
    forwardRef<HTMLDivElement, ActionBarSeparatorProps>(function ActionBarSeparator(props, ref) {
        return (
            <Box
                ref={ref}
                role="separator"
                aria-orientation="vertical"
                {...props}
            />
        );
    }),
    "separator"
);

export interface ActionBarCloseTriggerProps extends CloseButtonProps {}

const ActionBarCloseTrigger = withContext(
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
                    ref={ref}
                    aria-label="Close action bar"
                    onClick={handleClick}
                    {...rest}
                />
            );
        }
    ),
    "closeTrigger"
);

export namespace ActionBar {
    export const Root = ActionBarRoot;
    export const Content = ActionBarContent;
    export const SelectionTrigger = ActionBarSelectionTrigger;
    export const Separator = ActionBarSeparator;
    export const CloseTrigger = ActionBarCloseTrigger;
}
