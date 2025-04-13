import { dreamy } from "@/components/factory";
import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import { visuallyHidden } from "styled-system/patterns";

const DreamVisuallyHidden = dreamy.span;

export interface VisuallyHiddenProps extends HTMLDreamProps<"span"> {}

/**
 * VisuallyHidden component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/visually-hidden
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

const DreamVisuallyHiddenInput = dreamy.input;

export interface VisuallyHiddenInputProps extends HTMLDreamProps<"input"> {}

/**
 * VisuallyHiddenInput component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/visually-hidden
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
