import { dream } from "@/components/factory";
import { splitProps } from "@/utils";
import { styled } from "@dreamy-ui/system/jsx";
import { visuallyHidden } from "@dreamy-ui/system/patterns";
import { type ComponentProps, forwardRef } from "react";

export type VisuallyHiddenProps = ComponentProps<typeof DreamVisuallyHidden>;

const DreamVisuallyHidden = styled(dream.span);

/**
 * VisuallyHidden component.
 *
 * @See Docs https://dream-ui.com/docs/components/visually-hidden
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>((props, ref) => {
    const [patternProps, restProps] = splitProps(props, []);

    const styleProps = visuallyHidden.raw(patternProps);

    return (
        <DreamVisuallyHidden
            ref={ref}
            {...styleProps}
            {...restProps}
        />
    );
});

export type VisuallyHiddenInputProps = ComponentProps<typeof DreamVisuallyHiddenInput>;

/**
 * VisuallyHiddenInput component.
 *
 * @See Docs https://dream-ui.com/docs/components/visually-hidden
 */
export const VisuallyHiddenInput = forwardRef<HTMLInputElement, VisuallyHiddenInputProps>(
    (props, ref) => {
        const [patternProps, restProps] = splitProps(props, []);

        const styleProps = visuallyHidden.raw(patternProps);

        return (
            <DreamVisuallyHiddenInput
                ref={ref}
                readOnly
                {...styleProps}
                {...restProps}
            />
        );
    }
);

const DreamVisuallyHiddenInput = styled(dream.input);
