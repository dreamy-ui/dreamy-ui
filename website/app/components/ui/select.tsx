"use client";

import {
    type FocusableElement,
    SelectDescendantsProvider,
    SelectProvider,
    type UseSelectItemProps,
    type UseSelectProps,
    useHiddenSelect,
    useSafeLayoutEffect,
    useSelect,
    useSelectContext,
    useSelectItem
} from "@dreamy-ui/react";
import type React from "react";
import { type ReactNode, type RefObject, type SVGProps, forwardRef, useState } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy, splitCssProps } from "styled-system/jsx";
import { select } from "styled-system/recipes";
import { Box } from "./box";
import { Popover, type PopoverContentProps, type PopoverProps } from "./popover";
import { VisuallyHidden } from "./visually-hidden";

const { withProvider, withContext } = createStyleContext(select);

export interface HiddenSelectProps {
    placeholder: string;
    multiple: boolean;
    autoComplete: string;
    triggerRef: RefObject<FocusableElement | null>;
    domRef: RefObject<HTMLSelectElement | null>;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onChangeValue?: (value: string | string[]) => void;
}

function HiddenSelect(props: HiddenSelectProps) {
    const { domRef, placeholder } = props;

    const { containerProps, selectProps, descendants, id, selectedKeys } = useHiddenSelect({
        ...props,
        domRef
    });

    const [, forceUpdate] = useState({});

    useSafeLayoutEffect(() => {
        forceUpdate({});
    }, []);

    const items = Array.from(descendants.values());

    return (
        <VisuallyHidden {...containerProps}>
            <label>
                {placeholder}
                <select
                    {...selectProps}
                    ref={domRef}
                >
                    <option />
                    {items.map((item: any) => {
                        const isSelected = selectProps.multiple
                            ? selectedKeys.includes(item.node.value)
                            : undefined;

                        return (
                            <option
                                key={`${id}-${item.node.value}`}
                                selected={isSelected}
                                value={item.node.value}
                            >
                                {item.textValue}
                            </option>
                        );
                    })}
                </select>
            </label>
        </VisuallyHidden>
    );
}

export interface SelectProps<T extends boolean>
    extends UseSelectProps<T, PopoverProps>,
        Omit<HTMLDreamyProps<"div">, keyof UseSelectProps<T, PopoverProps>> {
    children?: ReactNode;
}

/**
 * Select component
 *
 * @See Docs https://dreamy-ui.com/docs/components/select
 */
const SelectRoot: <T extends boolean = false>(props: SelectProps<T>) => React.JSX.Element =
    withProvider(function SelectRoot<T extends boolean = false>({
        children,
        ...props
    }: SelectProps<T>) {
        const [cssProps, restProps] = splitCssProps(props);
        const ctx = useSelect<T, PopoverProps>(restProps);

        return (
            <SelectProvider value={ctx as any}>
                <Box
                    {...ctx.getRootProps({
                        ...cssProps,
                        className: restProps.className
                    })}
                >
                    <HiddenSelect {...ctx.getHiddenSelectProps()} />
                    <Popover.Root
                        hasArrow={false}
                        initialFocusRef={ctx.triggerRef}
                        isOpen={ctx.isOpen}
                        lazyBehavior="keepMounted"
                        onClose={ctx.onClose}
                        onOpen={ctx.onOpen}
                        placement="bottom"
                        reduceMotion={ctx.reduceMotion}
                        {...props.popoverProps}
                    >
                        <SelectDescendantsProvider value={ctx.descendants}>
                            {children}
                        </SelectDescendantsProvider>
                    </Popover.Root>
                </Box>
            </SelectProvider>
        );
    }, "root") as any;

export interface SelectTriggerProps extends HTMLDreamyProps<"button"> {
    /**
     * Icon to show in the trigger.
     */
    icon?: React.ReactNode;
    /**
     * Placeholder text to show when no item is selected.
     */
    placeholder?: string;
    /**
     * Text to show when multiple items are selected.
     */
    multipleSelectedText?: (selectedKeys: string[]) => string;
}

const SelectTrigger = withContext(
    forwardRef<HTMLButtonElement, SelectTriggerProps>(function SelectTrigger(
        {
            children,
            placeholder,
            icon,
            multipleSelectedText = (selectedKeys) => `${selectedKeys.length} Selected`,
            ...rest
        },
        ref
    ) {
        const { getTriggerProps, selectedKeys, descendants, isClearable } = useSelectContext();

        const selectedNames = selectedKeys.map((key) => {
            const item: any = Array.from(descendants.values()).find((node: any) => {
                return node.node.value === key;
            });
            return item?.textValue;
        });

        const [, forceUpdate] = useState({});

        useSafeLayoutEffect(() => {
            forceUpdate({});
        }, [JSON.stringify(Array.from(descendants.values()).map((node: any) => node.node.value))]);

        return (
            <>
                <Popover.Trigger>
                    <dreamy.button {...(getTriggerProps(rest, ref) as any)}>
                        {icon && icon}

                        <span>
                            {selectedNames.length === 1
                                ? selectedNames[0]
                                : selectedNames.length > 1
                                  ? multipleSelectedText(selectedNames)
                                  : placeholder}
                        </span>
                        <SelectIndicatorGroup>
                            {isClearable && selectedKeys.length > 0 && <SelectClearButton />}
                            <SelectIndicator />
                        </SelectIndicatorGroup>
                    </dreamy.button>
                </Popover.Trigger>
            </>
        );
    }),
    "trigger"
);

export interface SelectContentProps extends PopoverContentProps {}

const SelectContent = withContext(
    forwardRef<HTMLDivElement, SelectContentProps>(function SelectContent(props, ref) {
        const { children, ...rest } = props;

        const { getContentProps } = useSelectContext();
        const contentPropsResult = getContentProps(rest, ref);

        return <Popover.Content {...contentPropsResult}>{children}</Popover.Content>;
    }),
    "content"
);

export interface SelectItemProps extends UseSelectItemProps {}

/**
 * @internal
 */
const SelectIndicatorGroup = withContext(Box, "indicatorGroup");

const CheckIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
    function CheckIcon(props, ref) {
        return (
            <svg
                aria-hidden="true"
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
                {...props}
                ref={ref}
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
        );
    }
);

const SelectItemIndicator = withContext(CheckIcon, "itemIndicator");
const SelectItem = withContext(
    forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(props, ref) {
        const { selectedStrategy, selectedKeys } = useSelectContext();
        const itemProps = useSelectItem(props, ref);

        return (
            <dreamy.button {...(itemProps as any)}>
                {itemProps.children}

                {(selectedStrategy === "checkmark" || selectedStrategy === "both") &&
                    selectedKeys.includes(itemProps.value) && <SelectItemIndicator />}
            </dreamy.button>
        );
    }),
    "item"
);

const SelectIndicator = withContext(CheckIcon, "indicator");

export interface SelectClearButtonProps extends HTMLDreamyProps<"button"> {}

const SelectClearButton = withContext(
    forwardRef<HTMLButtonElement, SelectClearButtonProps>(function SelectClearButton(props, ref) {
        const { getClearButtonProps } = useSelectContext();

        return (
            <dreamy.button {...getClearButtonProps(props, ref)}>
                <dreamy.svg asChild>
                    <svg
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </dreamy.svg>
            </dreamy.button>
        );
    }),
    "clearButton"
);

export namespace Select {
    export const Root = SelectRoot;
    export const Trigger = SelectTrigger;
    export const Content = SelectContent;
    export const Item = SelectItem;
}
