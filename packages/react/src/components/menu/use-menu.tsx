import { createDescendantContext } from "@/components/descendant";
import type { PopoverProps } from "@/components/popover";
import { useControllable, type useControllableProps } from "@/hooks";
import { type ReactRef, mergeRefs } from "@/hooks/use-merge-refs";
import { useReducedMotion } from "@/provider";
import { type PropGetter, callAllHandlers } from "@/utils";
import { dataAttr } from "@/utils/attr";
import type { HTMLDreamProps } from "@/utils/types";
import { cx } from "@dreamy-ui/system/css";
import { type KeyboardEvent, type ReactNode, useCallback, useId, useRef, useState } from "react";
import type { UserFeedbackProps } from "../input/input";
import { useMenuContext } from "./menu-context";

export interface UseMenuProps extends UserFeedbackProps, useControllableProps {
    children?: ReactNode;
    /**
     * The class name for the wrapper. You probably want to style the Menu trigger, use `MenuTrigger` instead.
     */
    className?: string;
    /**
     * Ref to the DOM node.
     */
    ref?: ReactRef<HTMLMenuElement>;
    /**
     * Callback fired when the Menu menu is closed.
     */
    onClose?: () => void;
    /**
     * Whether to disable animation.
     * @default false
     */
    reduceMotion?: boolean;
    /**
     * The props to be passed to the popover.
     */
    popoverProps?: PopoverProps;
    /**
     * Whether to close the popover when a menu button is clicked.
     * @default true
     */
    closeOnClick?: boolean;
}

export function useMenu(props: UseMenuProps) {
    const globalReduceMotion = useReducedMotion();

    const {
        reduceMotion = globalReduceMotion ?? false,
        isOpen: isOpenProp,
        onOpen: onOpenProp,
        onClose: onCloseProp,
        defaultIsOpen: defaultIsOpenProp,
        ref,
        closeOnClick = true,
        popoverProps,
        ...rest
    } = props;

    const descendants = useMenuDescendants();

    const { isOpen, onOpen, onClose, onToggle } = useControllable({
        isOpen: isOpenProp,
        defaultIsOpen: defaultIsOpenProp,
        onOpen: onOpenProp,
        onClose: onCloseProp
    });

    /**
     * Id for the hidden Menu key mapping.
     */
    const id = useId();

    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const [focusedIndex, setFocusedIndex] = useState(-1);

    const getRootProps: PropGetter = useCallback(
        (props, ref) => {
            return {
                "data-slot": "root",
                "data-open": dataAttr(isOpen),
                ref,
                ...props,
                className: cx(props?.className, "group")
            };
        },
        [isOpen]
    );

    const getTriggerProps: PropGetter = useCallback(
        (props, ref) => {
            const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
                if (!isOpen) return;

                function scrollToFocusedItem(index: number) {
                    if (index === -1) return;
                    const item = descendants.item(index);
                    if (!item) return;
                    item.node.scrollIntoView({ block: "nearest" });
                }

                switch (e.key) {
                    case "ArrowUp":
                        e.preventDefault();
                        if (focusedIndex === -1) {
                            setFocusedIndex(0);
                        } else {
                            setFocusedIndex((prev) => {
                                scrollToFocusedItem(prev - 1);
                                return prev - 1;
                            });
                        }
                        break;
                    case "ArrowDown":
                        e.preventDefault();
                        setFocusedIndex((prev) => {
                            const val = prev + 1 >= descendants.count() ? prev : prev + 1;
                            scrollToFocusedItem(val);
                            return val;
                        });
                        break;
                    case "Enter":
                        if (focusedIndex === -1) return;
                        e.preventDefault();

                        // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
                        const item = descendants.item(focusedIndex);
                        if (item) {
                            item.node.click();
                        }
                        break;
                    case "Escape":
                        if (popoverProps?.closeOnEsc ?? true) {
                            onClose();
                        }
                        break;
                }
            };

            return {
                "data-slot": "trigger",
                ref: mergeRefs(triggerRef, ref),
                ...props,
                onKeyDown: callAllHandlers(props?.onKeyDown, onKeyDown)
            };
        },
        [focusedIndex, descendants, isOpen, popoverProps, onClose]
    );

    const getContentProps: PropGetter = useCallback((props, ref) => {
        return {
            ref: mergeRefs(popoverRef, ref),
            ...props,
            rootProps: {
                style: {
                    zIndex: "var(--z-index-dropdown)"
                }
            }
        };
    }, []);

    const getItemProps: PropGetter = useCallback((props, ref) => {
        return {
            ref: mergeRefs(ref),
            "data-slot": "item",
            ...props,
            onClick: callAllHandlers(props?.onClick, () => {
                if (triggerRef.current) {
                    requestAnimationFrame(() => {
                        triggerRef.current?.focus();
                    });
                }
            })
        };
    }, []);

    return {
        triggerRef,
        reduceMotion,
        focusedIndex,
        setFocusedIndex,
        isOpen,
        onOpen,
        onClose,
        popoverRef,
        onToggle,
        getRootProps,
        getTriggerProps,
        getContentProps,
        id,
        getItemProps,
        descendants,
        rest
    };
}

export type UseMenuReturn = ReturnType<typeof useMenu>;

export const [
    MenuDescendantsProvider,
    useMenuDescendantsContext,
    useMenuDescendants,
    useMenuDescendant
] = createDescendantContext<HTMLButtonElement>();

export interface UseMenuItemProps extends HTMLDreamProps<"button"> {
    isDisabled?: boolean;
}

/**
 * @internal
 */
export function useMenuItem(props: UseMenuItemProps, ref: React.Ref<any> = null): any {
    const { getItemProps, focusedIndex, setFocusedIndex } = useMenuContext();
    const { index, register } = useMenuDescendant({
        disabled: props?.isDisabled || props?.disabled || false
    });

    return getItemProps({
        ...props,
        ref: mergeRefs(register, ref),
        index,
        "data-focused": dataAttr(focusedIndex === index),
        onPointerEnter: callAllHandlers(props?.onPointerEnter, () => {
            setFocusedIndex(index);
        })
    });
}
