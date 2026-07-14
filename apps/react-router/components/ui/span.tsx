import { forwardRef } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";

export interface SpanProps extends HTMLDreamyProps<"span"> {}

/**
 * Span component
 *
 * @See Docs https://dreamy-ui.com/docs/components/span
 */
export const Span = forwardRef<HTMLSpanElement, SpanProps>((props, ref) => {
    return (
        <dreamy.span
            ref={ref}
            {...props}
        />
    );
});
