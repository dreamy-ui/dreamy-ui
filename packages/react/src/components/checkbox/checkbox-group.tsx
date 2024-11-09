import { createContext } from "@/provider/create-context";
import type { CheckboxVariantProps } from "@dreamy-ui/system/recipes";
import { useMemo } from "react";
import { Stack, type StackProps } from "../stack";
import {
    type UseCheckboxGroupProps,
    type UseCheckboxGroupReturn,
    useCheckboxGroup
} from "./use-checkbox-group";

export interface CheckboxGroupContext
    extends Pick<
            UseCheckboxGroupReturn,
            "onChange" | "value" | "isDisabled" | "isInvalid" | "isRequired" | "isReadOnly"
        >,
        CheckboxVariantProps {
    /**
     * Should reduce motion
     */
    reduceMotion?: boolean;
}

export const [CheckboxGroupProvider, useCheckboxGroupContext] = createContext<CheckboxGroupContext>(
    {
        name: "CheckboxGroupContext",
        strict: false
    }
);

export interface CheckboxGroupProps
    extends UseCheckboxGroupProps,
        CheckboxVariantProps,
        Omit<StackProps, "defaultValue" | "onChange"> {}

/**
 * CheckboxGroup component. Useful for grouping multiple checkboxes together.
 *
 * @See Docs https://dream-ui.com/docs/components/checkbox-group
 */
export function CheckboxGroup(props: CheckboxGroupProps) {
    const {
        scheme,
        size,
        variant,
        children,
        isDisabled,
        isRequired,
        isReadOnly,
        isInvalid,
        reduceMotion
    } = props;
    const { value, onChange } = useCheckboxGroup(props);

    const group = useMemo(
        () => ({
            size,
            scheme,
            variant,
            value,
            onChange,
            isDisabled,
            isRequired,
            isReadOnly,
            isInvalid,
            reduceMotion
        }),
        [
            size,
            onChange,
            scheme,
            value,
            variant,
            isDisabled,
            isRequired,
            isReadOnly,
            isInvalid,
            reduceMotion
        ]
    );

    return (
        <CheckboxGroupProvider value={group}>
            <Stack
                direction={"column"}
                /**
                 * Added className, incase someone wants to style globally the CheckboxGroup
                 * since it doesn't have own recipe
                 */
                className="dream-checkbox-group"
            >
                {children}
            </Stack>
        </CheckboxGroupProvider>
    );
}

CheckboxGroup.displayName = "CheckboxGroup";
