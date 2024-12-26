import { useSelectContext } from "@/components/select/select-context";
import { VisuallyHidden } from "@/components/visually-hidden";
import { useSafeLayoutEffect } from "@/hooks";
import type { FocusableElement } from "@/utils/types";
import { type RefObject, useState } from "react";

export interface HiddenSelectProps {
    placeholder: string;
    multiple: boolean;
    autoComplete: string;
    triggerRef: RefObject<FocusableElement>;
    domRef: RefObject<HTMLSelectElement>;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onChangeValue: (value: string | string[]) => void;
}

/**
 * Provides the behavior and accessibility implementation for a hidden `<select>` element, which
 * can be used in combination with `useSelect` to support browser form autofill, mobile form
 * navigation, and native HTML form submission.
 */
export function useHiddenSelect(props: HiddenSelectProps) {
    const {
        selectedKeys,
        setSelectedKeys,
        defaultValue,
        descendants,
        name,
        isDisabled,

        isRequired,
        onChange,
        onChangeValue,
        isInvalid,
        isMultiple,
        id
    } = useSelectContext();
    const { autoComplete, domRef } = props;

    useSafeLayoutEffect(() => {
        const el = domRef.current;
        if (!el?.form) return;
        const formResetListener = () => {
            setSelectedKeys(
                defaultValue
                    ? typeof defaultValue === "string"
                        ? [defaultValue]
                        : defaultValue
                    : []
            );
        };
        el.form.addEventListener("reset", formResetListener);
        return () => el.form?.removeEventListener("reset", formResetListener);
    }, []);

    return {
        descendants,
        selectedKeys,
        id,
        containerProps: {
            "aria-hidden": true,
            "data-a11y-ignore": "aria-hidden-focus"
        },
        selectProps: {
            name,
            tabIndex: -1,
            autoComplete,
            disabled: isDisabled,
            required: isRequired,
            invalid: isInvalid,
            value: isMultiple ? selectedKeys.map((k) => String(k)) : (selectedKeys[0] ?? ""),
            multiple: isMultiple,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                const val = isMultiple
                    ? Array.from(e.target.selectedOptions).map((o) => o.value)
                    : [e.target.value];

                setSelectedKeys(val);
                domRef.current!.value = isMultiple ? val.join(",") : val[0];
                onChangeValue?.((isMultiple ? val : val[0]) as any);
                onChange?.(e);
            }
        }
    };
}

/**
 * Renders a hidden native `<select>` element, which can be used to support browser
 * form autofill, mobile form navigation, and native form submission.
 */
export function HiddenSelect(props: HiddenSelectProps) {
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
