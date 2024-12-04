import { useSelectContext } from "@/components/select/select-context";
import { VisuallyHidden } from "@/components/visually-hidden";
import { useSafeLayoutEffect } from "@/hooks";
import type { FocusableElement } from "@/utils/types";
import { type RefObject, useState } from "react";

export interface HiddenSelectProps {
    selectionMode: "multiple" | "single";
    placeholder: string;
    multiple: boolean;
    autoComplete: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    triggerRef: RefObject<FocusableElement>;
    selectRef: RefObject<HTMLSelectElement>;
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
        isInvalid,
        selectRef
    } = useSelectContext();
    const { autoComplete, selectionMode, onChange } = props;

    useSafeLayoutEffect(() => {
        const el = selectRef.current;
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
            value:
                selectionMode === "multiple"
                    ? [...selectedKeys].map((k) => String(k))
                    : ([...selectedKeys][0] ?? ""),
            multiple: selectionMode === "multiple",
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedKeys(
                    typeof e.target.value === "string"
                        ? e.target.value.includes(",")
                            ? e.target.value.split(",")
                            : [e.target.value]
                        : e.target.value
                );
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
    const { selectRef, placeholder } = props;

    const { containerProps, selectProps, descendants } = useHiddenSelect({
        ...props,
        selectRef
    });

    const [, forceUpdate] = useState({});

    useSafeLayoutEffect(() => {
        forceUpdate({});
    }, []);

    const items = Array.from(descendants.values());

    return (
        <VisuallyHidden
            {...containerProps}
            data-testid="hidden-select-container"
        >
            <label>
                {placeholder}
                <select
                    {...selectProps}
                    ref={selectRef}
                >
                    <option />
                    {items.map((item: any) => {
                        return (
                            <option
                                key={item.node.key}
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
