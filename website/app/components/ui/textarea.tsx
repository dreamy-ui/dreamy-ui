"use client";

import {
    TextareaAutosize,
    type TextareaAutosizeProps,
    type UserFeedbackProps,
    callAllHandlers,
    useField
} from "@dreamy-ui/react";
import { type ComponentType, forwardRef } from "react";
import { type TextareaVariantProps, textarea } from "styled-system/recipes";
import { type HTMLDreamyProps, dreamy } from "./factory";

export interface TextareaProps
    extends HTMLDreamyProps<"textarea">,
        TextareaVariantProps,
        Omit<TextareaAutosizeProps, keyof HTMLDreamyProps<"textarea">>,
        UserFeedbackProps {
    /**
     * The callback function that is called when the textarea value changes.
     */
    onChangeValue?: (value: string) => void;
}

const StyledTextarea = dreamy(TextareaAutosize as any, textarea);

/**
 * Textarea component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/textarea
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
    const field = useField(props);

    return (
        <StyledTextarea
            ref={ref}
            {...field}
            onChange={callAllHandlers(props.onChange, (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                props.onChangeValue?.(e.target.value)
            )}
        />
    );
});

const StyledTextareaNoAutoSize = dreamy("textarea", textarea);

export type TextareaNoAutoSizeProps = HTMLDreamyProps<"textarea"> &
    TextareaVariantProps &
    UserFeedbackProps & {
        /**
         * The callback function that is called when the textarea value changes.
         */
        onChangeValue?: (value: string) => void;
    };

/**
 * Textarea component without autosize.
 *
 * @See Docs https://dreamy-ui.com/docs/components/textarea
 */
export const TextareaNoAutoSize: ComponentType<TextareaNoAutoSizeProps> = forwardRef<
    HTMLTextAreaElement,
    TextareaNoAutoSizeProps
>((props, ref) => {
    const field = useField(props);

    return (
        <StyledTextareaNoAutoSize
            ref={ref}
            {...field}
            onChange={callAllHandlers(props.onChange, (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                props.onChangeValue?.(e.target.value)
            )}
        />
    );
});
