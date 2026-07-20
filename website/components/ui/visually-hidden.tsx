import { splitProps } from "@dreamy-ui/react/rsc";

import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { visuallyHidden } from "styled-system/patterns";

export interface VisuallyHiddenProps extends HTMLDreamyProps<"span"> {}

/**
 * VisuallyHidden component — hides content visually while keeping it accessible.
 *
 * @see Docs https://dreamy-ui.com/docs/components/visually-hidden
 *
 * @example
 * ```tsx
 * <VisuallyHidden>Screen reader only</VisuallyHidden>
 * ```
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
 * VisuallyHiddenInput component — visually hidden form input for a11y/forms.
 *
 * @see Docs https://dreamy-ui.com/docs/components/visually-hidden
 *
 * @example
 * ```tsx
 * <VisuallyHiddenInput name="token" value={token} />
 * ```
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
