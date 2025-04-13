import { createContext } from "@/provider/create-context";
import { Flex, type FlexProps } from "@/rsc";
import { useMemo } from "react";
import { cx } from "styled-system/css";
import type { RadioVariantProps } from "styled-system/recipes";
import {
    type UseRadioGroupProps,
    type UseRadioGroupReturn,
    useRadioGroup
} from "./use-radio-group";

export interface RadioGroupContext
    extends Pick<
            UseRadioGroupReturn,
            "onChange" | "value" | "isDisabled" | "isInvalid" | "isRequired" | "isReadOnly"
        >,
        RadioVariantProps {
    /**
     * Should reduce motion
     */
    reduceMotion?: boolean;
}

export const [RadioGroupProvider, useRadioGroupContext] = createContext<RadioGroupContext>({
    name: "RadioGroupContext",
    strict: false
});

export interface RadioGroupProps
    extends UseRadioGroupProps,
        RadioVariantProps,
        Omit<FlexProps, "defaultValue" | "onChange"> {}

/**
 * RadioGroup component. Useful for grouping multiple Radioes together.
 *
 * @See Docs https://dreamy-ui.com/docs/components/radio
 */
export function RadioGroup(props: RadioGroupProps) {
    const {
        scheme,
        size,
        variant,
        children,
        isDisabled,
        isRequired,
        isReadOnly,
        isInvalid,
        reduceMotion,
        onChange: onChangeProp,
        ...rest
    } = props;
    const { value, onChange } = useRadioGroup({ onChange: onChangeProp, ...props });

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
        <RadioGroupProvider value={group}>
            <Flex
                {...rest}
                className={cx("dreamy-radio-group", rest.className)}
            >
                {children}
            </Flex>
        </RadioGroupProvider>
    );
}

RadioGroup.displayName = "RadioGroup";
