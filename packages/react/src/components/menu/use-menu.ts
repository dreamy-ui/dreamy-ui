import { type DescendantsManager, createDescendantContext } from "@/components/descendant";
import { useControllable, type useControllableProps } from "@/hooks";
import { type ReactRef, mergeRefs } from "@/hooks/use-merge-refs";
import { createContext, useReducedMotion } from "@/provider";
import { type PropGetter, callAllHandlers, cx } from "@/utils";
import { dataAttr } from "@/utils/attr";
import {
    type DOMAttributes,
    type KeyboardEvent,
    type ReactNode,
    type RefAttributes,
    useCallback,
    useId,
    useRef,
    useState
} from "react";
import type { UserFeedbackProps } from "../field";
import type { UsePopoverProps } from "../popover";

interface MenuContext extends Omit<UseMenuReturn, "rest"> {}

export interface UseMenuProps<T extends any> extends UserFeedbackProps, useControllableProps {
    /**
     * Menu trigger and content children.
     */
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
    popoverProps?: UsePopoverProps & T;
    /**
     * Whether to close the popover when a menu button is clicked.
     * @default true
     */
    closeOnClick?: boolean;
}

export function useMenu<T extends any>(props: UseMenuProps<T>): UseMenuReturn {
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
        (props = {}) => {
            const { ref, className, ...rest } = props;
            return {
                ...rest,
                "data-slot": "root",
                "data-open": dataAttr(isOpen),
                ref,
                className: cx(className, "group")
            };
        },
        [isOpen]
    );

    const getTriggerProps: PropGetter = useCallback(
        (props = {}) => {
            const { ref, onKeyDown: propsOnKeyDown, ...rest } = props;
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
                ...rest,
                "aria-haspopup": "menu",
                onKeyDown: callAllHandlers(propsOnKeyDown, onKeyDown)
            };
        },
        [focusedIndex, descendants, isOpen, popoverProps, onClose]
    );

    const getContentProps = useCallback((props: Record<string, any> = {}) => {
        const { ref, ...rest } = props;
        return {
            ref: mergeRefs(popoverRef, ref),
            ...rest,
            role: "menu",
            rootProps: {
                style: {
                    zIndex: "var(--z-index-dropdown)"
                }
            }
        } as const;
    }, []);

    const getItemProps: PropGetter = useCallback(
        (props = {}) => {
            const { ref, onClick, role, ...rest } = props;
            return {
                "data-slot": "item",
                ...rest,
                role: role ?? "menuitem",
                ref: mergeRefs(ref),
                onClick: callAllHandlers(onClick, () => {
                    if (closeOnClick) {
                        onClose();
                    }
                    if (triggerRef.current) {
                        requestAnimationFrame(() => {
                            triggerRef.current?.focus();
                        });
                    }
                })
            };
        },
        [closeOnClick, onClose]
    );

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

export interface UseMenuReturn {
    triggerRef: React.RefObject<HTMLButtonElement | null>;
    reduceMotion: boolean;
    focusedIndex: number;
    setFocusedIndex: (index: number) => void;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
    popoverRef: React.RefObject<HTMLDivElement | null>;
    getRootProps: PropGetter;
    getTriggerProps: PropGetter;
    getContentProps: (
        props?: Record<string, any>
    ) => {
        rootProps: {
            style: {
                zIndex: "var(--z-index-dropdown)";
            };
        };
    };
    id: string;
    getItemProps: PropGetter;
    descendants: DescendantsManager<HTMLButtonElement>;
    rest: UseMenuProps<any>;
}

export const [MenuProvider, useMenuContext] = createContext<MenuContext>({
    name: "MenuContext",
    hookName: "useMenuContext",
    providerName: "Menu"
});

export const [
    MenuDescendantsProvider,
    useMenuDescendantsContext,
    useMenuDescendants,
    useMenuDescendant
] = createDescendantContext<HTMLButtonElement>();

export interface UseMenuItemProps {
    /**
     * Ref to the menu item button element.
     */
    ref?: React.Ref<HTMLButtonElement>;
    /**
     * If `true`, the menu item is disabled and not focusable.
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Native `disabled` attribute. Prefer `isDisabled`.
     *
     * @default false
     */
    disabled?: boolean;
    /**
     * Pointer enter handler. Also used internally to update keyboard focus index.
     */
    onPointerEnter?: (event: React.PointerEvent<HTMLButtonElement>) => void;
    /**
     * Descendant index within the menu. Usually set automatically by the hook.
     */
    index?: number;
    /**
     * Data attribute reflecting whether this item currently has keyboard focus.
     */
    "data-focused"?: string;
}

// interface UseMenuItemReturn extends UseMenuItemProps {
//     isDisabled: boolean;
//     onPointerEnter: (event: React.PointerEvent<HTMLButtonElement>) => void;
//     index: number;
//     "data-focused"?: string;
// }

export function useMenuItem(props: UseMenuItemProps): DOMAttributes<HTMLButtonElement> & RefAttributes<HTMLButtonElement> {
    const { ref, ...rest } = props;
    const { getItemProps, focusedIndex, setFocusedIndex } = useMenuContext();
    const { index, register } = useMenuDescendant({
        disabled: props?.isDisabled || props?.disabled || false
    });

    return getItemProps({
        ...rest,
        ref: mergeRefs(register, ref),
        index,
        "data-focused": dataAttr(focusedIndex === index),
        onPointerEnter: callAllHandlers(props?.onPointerEnter, () => {
            setFocusedIndex(index);
        })
    });
}
