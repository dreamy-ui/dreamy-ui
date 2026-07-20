"use client";

import { type UserFeedbackProps, callAllHandlers, useField } from "@dreamy-ui/react";

import type React from "react";
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
 * Textarea component — multi-line text input with autosize.
 *
 * @see Docs https://dreamy-ui.com/docs/components/textarea
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Write something…" />
 * ```
 */
export function Textarea(props: TextareaProps) {
    const { onChangeValue, onChange, ...restProps } = props;
    const field = useField(restProps);

    return (
        <StyledTextarea
            {...field}
            onChange={callAllHandlers(onChange, function handleChangeValue(
                e: React.ChangeEvent<HTMLTextAreaElement>
            ) {
                onChangeValue?.(e.target.value);
            })}
        />
    );
}

const StyledTextareaNoAutoSize = dreamy("textarea", textarea);

export interface TextareaNoAutoSizeProps
    extends HTMLDreamyProps<"textarea">,
        TextareaVariantProps,
        UserFeedbackProps {
    /**
     * The callback function that is called when the textarea value changes.
     */
    onChangeValue?: (value: string) => void;
}

/**
 * TextareaNoAutoSize component — multi-line text input without autosize.
 *
 * @see Docs https://dreamy-ui.com/docs/components/textarea
 *
 * @example
 * ```tsx
 * <TextareaNoAutoSize rows={4} />
 * ```
 */
export function TextareaNoAutoSize(props: TextareaNoAutoSizeProps) {
    const { onChangeValue, onChange, ...restProps } = props;
    const field = useField(restProps);

    return (
        <StyledTextareaNoAutoSize
            {...field}
            onChange={callAllHandlers(onChange, function handleChangeValue(
                e: React.ChangeEvent<HTMLTextAreaElement>
            ) {
                onChangeValue?.(e.target.value);
            })}
        />
    );
}
