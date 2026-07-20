import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";

export interface BoxProps extends HTMLDreamyProps<"div"> {}

/**
 * Box component — primitive layout container with style props.
 *
 * @see Docs https://dreamy-ui.com/docs/components/box
 *
 * @example
 * ```tsx
 * <Box p="4" bg="bg.subtle">
 *   Content
 * </Box>
 * ```
 */
export function Box(props: BoxProps) {
    return <dreamy.div {...props} />;
}
