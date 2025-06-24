"use client";

import {
    type HTMLDreamProps,
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
import { select } from "styled-system/recipes";
import { Box } from "./box";
import { createStyleContext } from "./style-context";

import { splitCssProps } from "styled-system/jsx";
import { type FocusableElement, type HTMLDreamyProps, dreamy } from "./factory";
import { Popover, PopoverContent, type PopoverContentProps, PopoverTrigger } from "./popover";
import { VisuallyHidden } from "./visually-hidden";
const { withProvider, withContext } = createStyleContext(select);

export interface HiddenSelectProps {
    placeholder: string;
    multiple: boolean;
    autoComplete: string;
    triggerRef: RefObject<FocusableElement>;
    domRef: RefObject<HTMLSelectElement>;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onChangeValue: (value: string | string[]) => void;
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
                                value={item.node.value}
                                selected={isSelected}
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
    extends UseSelectProps<T>,
        Omit<HTMLDreamProps<"div">, keyof UseSelectProps<T>> {
    children?: ReactNode;
}

/**
 * Select component
 *
 * @See Docs https://dreamy-ui.com/docs/components/select
 */
export const Select: <T extends boolean = false>(props: SelectProps<T>) => React.JSX.Element =
    withProvider(function SelectRoot<T extends boolean = false>({
        children,
        ...props
    }: SelectProps<T>) {
        const [cssProps, restProps] = splitCssProps(props);
        const ctx = useSelect<T>(restProps);

        return (
            <SelectProvider value={ctx as any}>
                <Box
                    {...ctx.getRootProps({
                        ...cssProps,
                        className: restProps.className
                    })}
                >
                    <HiddenSelect {...(ctx.getHiddenSelectProps() as any)} />
                    <Popover
                        placement="bottom"
                        isOpen={ctx.isOpen}
                        onOpen={ctx.onOpen}
                        onClose={ctx.onClose}
                        hasArrow={false}
                        initialFocusRef={ctx.triggerRef}
                        lazyBehavior="keepMounted"
                        reduceMotion={ctx.reduceMotion}
                        {...props.popoverProps}
                    >
                        <SelectDescendantsProvider value={ctx.descendants}>
                            {children}
                        </SelectDescendantsProvider>
                    </Popover>
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

export const SelectTrigger = withContext(
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
        }, []);

        return (
            <>
                <PopoverTrigger>
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
                </PopoverTrigger>
            </>
        );
    }),
    "trigger"
);

export interface SelectContentProps extends PopoverContentProps {}

export const SelectContent = withContext(
    forwardRef<HTMLDivElement, SelectContentProps>(function SelectContent(props, ref) {
        const { children, ...rest } = props;

        const { getContentProps } = useSelectContext();

        return <PopoverContent {...getContentProps(rest, ref)}>{children}</PopoverContent>;
    }),
    "content"
);

export interface SelectItemProps extends UseSelectItemProps {}

export const SelectItem = withContext(
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

/**
 * @internal
 */
const SelectIndicatorGroup = withContext(Box, "indicatorGroup");

const CheckIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
    function CheckIcon(props, ref) {
        return (
            <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                {...props}
                ref={ref}
            >
                <path d="M20 6 9 17l-5-5" />
            </svg>
        );
    }
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
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
const SelectItemIndicator = withContext(CheckIcon, "itemIndicator");
