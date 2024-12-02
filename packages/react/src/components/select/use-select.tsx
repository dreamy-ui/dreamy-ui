import { createDescendantContext } from "@/components/descendant";
import type { PopoverProps } from "@/components/popover";
import { useControllable, type useControllableProps, useSafeLayoutEffect } from "@/hooks";
import { type ReactRef, mergeRefs } from "@/hooks/use-merge-refs";
import { useReducedMotion } from "@/provider";
import { type PropGetter, callAllHandlers } from "@/utils";
import { dataAttr } from "@/utils/attr";
import { useDOMRef } from "@/utils/dom";
import { nextTick } from "@/utils/ticks";
import type { HTMLDreamProps } from "@/utils/types";
import { cx } from "@dreamy-ui/system/css";
import {
    type KeyboardEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import type { UserFeedbackProps } from "../input/input";
import { useSelectContext } from "./select-context";

export interface UseSelectProps<T extends boolean = false>
    extends HTMLDreamProps<"select">,
        UserFeedbackProps,
        useControllableProps {
    /**
     * Ref to the DOM node.
     */
    ref?: ReactRef<HTMLSelectElement>;
    /**
     * If `true`, the select will allow multiple selections.
     * @default false
     */
    isMultiple?: T;
    /**
     * The strategy to indicate the selected state.
     * @default "both"
     */
    selectedStrategy?: "checkmark" | "background" | "both";
    /**
     * The icon that represents the select open state. Usually a chevron icon.
     */
    selectorIcon?: ReactNode;
    /**
     * Callback fired when the select menu is closed.
     */
    onClose?: () => void;
    /**
     * Handler that is called when the selection changes.
     */
    onChangeValue?: (value: T extends true ? string[] : string) => void;
    /**
     * Whether to disable animation.
     * @default false
     */
    reduceMotion?: boolean;
    popoverProps?: PopoverProps;
}

export function useSelect(props: UseSelectProps) {
    let {
        reduceMotion,
        isOpen: isOpenProp,
        onOpen: onOpenProp,
        onClose: onCloseProp,
        defaultIsOpen: defaultIsOpenProp,
        ref,
        isMultiple = false,
        name,
        selectedStrategy = "both",
        isInvalid,
        onChangeValue,
        onChange,
        popoverProps,
        ...rest
    } = props;

    const globalReduceMotion = useReducedMotion();
    reduceMotion ??= globalReduceMotion ?? false;

    const descendants = useSelectDescendants();

    const { isOpen, onOpen, onClose, onToggle } = useControllable({
        isOpen: isOpenProp,
        defaultIsOpen: defaultIsOpenProp,
        onOpen: onOpenProp,
        onClose: onCloseProp
    });

    const domRef = useDOMRef(ref);
    const triggerRef = useRef<HTMLElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    useSafeLayoutEffect(() => {
        if (!domRef.current?.value) return;

        setSelectedKeys([domRef.current.value]);
    }, [domRef.current]);

    const [contentWidth, setContentWidth] = useState(0);

    // apply the same with to the popover as the select
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        function updateContentWidth() {
            if (popoverRef.current && triggerRef.current) {
                nextTick(() => {
                    if (!triggerRef.current) return;

                    const { width } = triggerRef.current.getBoundingClientRect();

                    if (width !== contentWidth) {
                        setContentWidth(width);
                    }
                });
            }
        }

        updateContentWidth();

        window.addEventListener("resize", updateContentWidth);
        return () => {
            window.removeEventListener("resize", updateContentWidth);
        };
    }, [isOpen]);

    const handleItemChange = useCallback(
        (value: string) => {
            setSelectedKeys((prev) =>
                prev.includes(value)
                    ? prev.filter((v) => v !== value)
                    : isMultiple
                      ? [...prev, value]
                      : [value]
            );
        },
        [isMultiple]
    );

    const getRootProps: PropGetter = useCallback(
        (props, ref) => {
            return {
                "data-slot": "root",
                "data-open": dataAttr(isOpen),
                "data-selected-strategy": selectedStrategy,
                ref,
                ...props,
                className: cx(props?.className, "group")
            };
        },
        [isOpen, selectedStrategy]
    );

    const getTriggerProps: PropGetter = useCallback(
        (props, ref) => {
            const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
                if (!isOpen) return;
                switch (e.key) {
                    case "ArrowUp":
                        e.preventDefault();
                        if (focusedIndex === -1) {
                            setFocusedIndex(0);
                        } else {
                            setFocusedIndex((prev) => prev - 1);
                        }
                        break;
                    case "ArrowDown":
                        e.preventDefault();
                        setFocusedIndex((prev) =>
                            prev + 1 >= descendants.count() ? prev : prev + 1
                        );
                        break;
                    case "Enter":
                        if (focusedIndex === -1) return;
                        e.preventDefault();
                        // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
                        const value = (descendants.item(focusedIndex) as any).node.value;
                        handleItemChange(value);
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
                "aria-invalid": isInvalid,
                ref: mergeRefs(triggerRef, ref),
                "data-placeholder-shown": dataAttr(selectedKeys.length === 0),
                ...props,
                onKeyDown: callAllHandlers(props?.onKeyDown, onKeyDown)
            };
        },
        [
            isInvalid,
            selectedKeys.length,
            focusedIndex,
            descendants,
            isOpen,
            popoverProps,
            onClose,
            handleItemChange
        ]
    );

    const getContentProps: PropGetter = useCallback(
        (props, ref) => {
            return {
                ref: mergeRefs(popoverRef, ref),
                ...props,
                style: {
                    ...props?.style,
                    width: contentWidth + "px"
                }
            };
        },
        [contentWidth]
    );

    const getItemProps: PropGetter = useCallback(
        (props, ref) => {
            return {
                ref: mergeRefs(ref),
                "data-slot": "item",
                ...props,
                onClick: callAllHandlers(props?.onClick, () => {
                    const value = props!.value;
                    handleItemChange(value);

                    if (triggerRef.current) {
                        requestAnimationFrame(() => {
                            triggerRef.current?.focus();
                        });
                    }
                })
            };
        },
        [handleItemChange]
    );

    return {
        domRef,
        name,
        triggerRef,
        reduceMotion,
        isInvalid,
        selectedKeys,
        focusedIndex,
        setSelectedKeys,
        setFocusedIndex,
        isOpen,
        onOpen,
        selectedStrategy,
        onClose,
        popoverRef,
        onToggle,
        getRootProps,
        getTriggerProps,
        getContentProps,
        getItemProps,
        descendants,
        rest
    };
}

export type UseSelectReturn = ReturnType<typeof useSelect>;

export const [
    SelectDescendantsProvider,
    useSelectDescendantsContext,
    useSelectDescendants,
    useSelectDescendant
] = createDescendantContext<HTMLButtonElement>();

export interface UseSelectItemProps extends HTMLDreamProps<"button"> {
    isDisabled?: boolean;
    value: string;
}

/**
 * @internal
 */
export function useSelectItem(props: UseSelectItemProps, ref: React.Ref<any> = null) {
    const { getItemProps, focusedIndex, setFocusedIndex } = useSelectContext();
    const { index, register } = useSelectDescendant({
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
