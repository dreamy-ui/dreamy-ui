import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";

export interface SpanProps extends HTMLDreamyProps<"span"> {}

/**
 * Span component
 *
 * @See Docs https://dreamy-ui.com/docs/components/span
 */
export function Span(props: SpanProps) {
    return <dreamy.span {...props} />;
}
