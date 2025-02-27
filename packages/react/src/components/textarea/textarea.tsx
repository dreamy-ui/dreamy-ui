import { dreamy } from "@/components/factory";
import { useField } from "@/components/field/use-field";
import type { UserFeedbackProps } from "@/components/input";
import { callAllHandlers } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { type ComponentType, forwardRef } from "react";
import TextareaAutosize, { type TextareaAutosizeProps } from "react-textarea-autosize";
import { type TextareaVariantProps, textarea } from "styled-system/recipes";

export interface TextareaProps
    extends HTMLDreamProps<"textarea">,
        TextareaVariantProps,
        Omit<TextareaAutosizeProps, keyof HTMLDreamProps<"textarea">>,
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

export type TextareaNoAutoSizeProps = HTMLDreamProps<"textarea"> &
    TextareaVariantProps &
    UserFeedbackProps & {
        /**
         * The callback function that is called when the textarea value changes.
         */
        onChangeValue?: (value: string) => void;
    };

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
