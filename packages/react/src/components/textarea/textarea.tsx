import { dreamy } from "@/components/factory";
import { useField } from "@/components/field/use-field";
import type { UserFeedbackProps } from "@/components/input";
import type { HTMLDreamProps } from "@/utils/types";
import { type TextareaVariantProps, textarea } from "@dreamy-ui/system/recipes";
import { type ComponentType, forwardRef } from "react";
import TextareaAutosize, { type TextareaAutosizeProps } from "react-textarea-autosize";

export interface TextareaProps
    extends HTMLDreamProps<"textarea">,
        TextareaVariantProps,
        Omit<TextareaAutosizeProps, keyof HTMLDreamProps<"textarea">>,
        UserFeedbackProps {}

const StyledTextarea = dreamy(TextareaAutosize as any, textarea);

/**
 * Textarea component.
 *
 * @See Docs https://dream-ui.com/docs/components/textarea
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
    const field = useField(props);

    return (
        <StyledTextarea
            ref={ref}
            {...field}
        />
    );
});

const StyledTextareaNoAutoSize = dreamy("textarea", textarea);

export type TextareaNoAutoSizeProps = HTMLDreamProps<"textarea"> &
    TextareaVariantProps &
    UserFeedbackProps;

export const TextareaNoAutoSize: ComponentType<TextareaNoAutoSizeProps> = forwardRef<
    HTMLTextAreaElement,
    TextareaNoAutoSizeProps
>((props, ref) => {
    const field = useField(props);

    return (
        <StyledTextareaNoAutoSize
            ref={ref}
            {...field}
        />
    );
});
