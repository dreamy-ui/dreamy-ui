import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";

export interface SpanProps extends HTMLDreamyProps<"span"> {}

/**
 * Span component — inline text wrapper with style props.
 *
 * @see Docs https://dreamy-ui.com/docs/components/span
 *
 * @example
 * ```tsx
 * <Span color="fg.muted">Muted text</Span>
 * ```
 */
export function Span(props: SpanProps) {
    return <dreamy.span {...props} />;
}
