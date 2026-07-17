import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";

export interface BoxProps extends HTMLDreamyProps<"div"> {}

/**
 * Box component
 *
 * @See Docs https://dreamy-ui.com/docs/components/box
 */
export function Box(props: BoxProps) {
    return <dreamy.div {...props} />;
}
