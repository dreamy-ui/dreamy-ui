import { splitProps } from "@dreamy-ui/react/rsc";

import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type DividerProperties, divider } from "styled-system/patterns";

export interface DividerProps
    extends Omit<HTMLDreamyProps<"hr">, keyof DividerProperties>,
        DividerProperties {}

/**
 * Divider component — visual separator between content.
 *
 * @see Docs https://dreamy-ui.com/docs/components/divider
 *
 * @example
 * ```tsx
 * <Divider />
 * ```
 */
export function Divider(props: DividerProps) {
    const [patternProps, restProps] = splitProps(props, ["orientation", "thickness", "color"]);

    const styleProps = divider.raw(patternProps);

    return (
        <dreamy.hr
            {...styleProps}
            {...restProps}
        />
    );
}
