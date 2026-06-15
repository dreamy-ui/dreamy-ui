"use client";

import { type UserFeedbackProps, callAllHandlers, useField } from "@dreamy-ui/react";

import TextareaAutosize, { type TextareaAutosizeProps } from "react-textarea-autosize";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type TextareaVariantProps, textarea } from "styled-system/recipes";

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

const StyledTextarea = dreamy(TextareaAutosize, textarea);

/**
 * Textarea component
 *
 * @See Docs https://dreamy-ui.com/docs/components/textarea
 */
export function Textarea(props: TextareaProps) {
    const field = useField(props);

    return (
        <StyledTextarea
            {...field}
            onChange={callAllHandlers(props.onChange, (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                props.onChangeValue?.(e.target.value)
            )}
        />
    );
}

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
 * Textarea component without autosize
 *
 * @See Docs https://dreamy-ui.com/docs/components/textarea
 */
export function TextareaNoAutoSize(props: TextareaNoAutoSizeProps) {
    const field = useField(props);

    return (
        <StyledTextareaNoAutoSize
            {...field}
            onChange={callAllHandlers(props.onChange, (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                props.onChangeValue?.(e.target.value)
            )}
        />
    );
}
