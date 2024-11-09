"use client";

import { dream } from "@/components/factory";
import { useField } from "@/components/field/use-field";
import { useInputGroup } from "@/components/input/input-group";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { type InputVariantProps, input } from "@dreamy-ui/system/recipes";
import { forwardRef, useMemo } from "react";

export interface UserFeedbackProps {
    /**
     * If `true`, the form control will be required. This has 2 side effects:
     * - The `FormLabel` will show a required indicator
     * - The form element (e.g, Input) will have `aria-required` set to `true`
     *
     * @default false
     */
    isRequired?: boolean;
    /**
     * If `true`, the form control will be disabled. This has 2 side effects:
     * - The `FormLabel` will have `data-disabled` attribute
     * - The form element (e.g, Input) will be disabled
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * If `true`, the form control will be invalid. This has 2 side effects:
     * - The `FormLabel` and `FormErrorIcon` will have `data-invalid` set to `true`
     * - The form element (e.g, Input) will have `aria-invalid` set to `true`
     *
     * @default false
     */
    isInvalid?: boolean;
    /**
     * If `true`, the form control will be readonly
     *
     * @default false
     */
    isReadOnly?: boolean;
}

export interface InputProps extends HTMLDreamProps<"input">, InputVariantProps, UserFeedbackProps {}

const StyledInput = styled(dream.input, input);

/**
 * Input component
 *
 * @See Docs https://dream-ui.com/docs/components/input
 */
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const inputGroup = useInputGroup();
    const field = useField(
        useMemo(() => {
            return {
                ...inputGroup,
                ...props
            };
        }, [inputGroup, props])
    );

    return (
        <StyledInput
            ref={ref}
            {...field}
        />
    );
});
