"use client";

import { type DreamyHostProps, type UseFieldProps, useField } from "@dreamy-ui/react";
import { Textarea as UiSdkTextarea } from "@ui-sdk/react/textarea";
import type { ComponentProps, CSSProperties } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type TextareaVariantProps, textarea } from "styled-system/recipes";

type UiSdkTextareaProps = ComponentProps<typeof UiSdkTextarea>;

const StyledTextarea = dreamy(UiSdkTextarea, textarea);

function rowsToStyle(minRows?: number, maxRows?: number): CSSProperties {
    return {
        minHeight: minRows ? `${minRows * 1.5}em` : undefined,
        maxHeight: maxRows ? `${maxRows * 1.5}em` : undefined
    };
}

type UiSdkPickedTextareaProps = Pick<
    UiSdkTextareaProps,
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "controller"
    | "debug"
    | "autoResize"
    | "onSubmit"
    | "submitShortcut"
>;

export interface TextareaProps
    extends DreamyHostProps<HTMLDreamyProps<"textarea">, UiSdkPickedTextareaProps, "size" | "style">,
        TextareaVariantProps,
        UiSdkPickedTextareaProps {
    /**
     * Minimum number of rows used to derive the textarea's min-height.
     */
    minRows?: number;
    /**
     * Maximum number of rows used to derive the textarea's max-height.
     */
    maxRows?: number;
    style?: CSSProperties;
}

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
    const { minRows, maxRows, autoResize = true, style, ...restProps } = props;
    const field = useField(restProps as UseFieldProps<HTMLTextAreaElement>);

    return (
        <StyledTextarea
            {...field}
            autoResize={autoResize}
            style={{ ...rowsToStyle(minRows, maxRows), ...style }}
        />
    );
}

type UiSdkPickedTextareaNoAutoSizeProps = Pick<
    UiSdkTextareaProps,
    "value" | "defaultValue" | "onValueChange" | "controller" | "debug" | "onSubmit" | "submitShortcut"
>;

export interface TextareaNoAutoSizeProps
    extends DreamyHostProps<
            HTMLDreamyProps<"textarea">,
            UiSdkPickedTextareaNoAutoSizeProps,
            "size" | "style"
        >,
        TextareaVariantProps,
        UiSdkPickedTextareaNoAutoSizeProps {
    style?: CSSProperties;
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
    const { style, ...restProps } = props;
    const field = useField(restProps as UseFieldProps<HTMLTextAreaElement>);

    return <StyledTextarea {...field} style={style} />;
}
