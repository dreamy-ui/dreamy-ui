import { splitProps } from "@dreamy-ui/react/rsc";

import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { visuallyHidden } from "styled-system/patterns";

export interface VisuallyHiddenProps extends HTMLDreamyProps<"span"> {}

/**
 * VisuallyHidden component
 *
 * @See Docs https://dreamy-ui.com/docs/components/visually-hidden
 */
export function VisuallyHidden(props: VisuallyHiddenProps) {
    const [patternProps, restProps] = splitProps(props, []);

    const styleProps = visuallyHidden.raw(patternProps);

    return (
        <dreamy.span
            {...styleProps}
            {...restProps}
        />
    );
}

export interface VisuallyHiddenInputProps extends HTMLDreamyProps<"input"> {}

/**
 * VisuallyHiddenInput component
 *
 * @See Docs https://dreamy-ui.com/docs/components/visually-hidden
 */
export function VisuallyHiddenInput(props: VisuallyHiddenInputProps) {
    const [patternProps, restProps] = splitProps(props, []);

    const styleProps = visuallyHidden.raw(patternProps);

    return (
        <dreamy.input
            readOnly
            {...styleProps}
            {...restProps}
        />
    );
}
