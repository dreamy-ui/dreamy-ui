import { dreamy } from "@/components/factory";
import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import { type FlexProperties, flex } from "styled-system/patterns";

export interface FlexProps
    extends Omit<HTMLDreamProps<"div">, keyof FlexProperties>,
        FlexProperties {}

const DreamFlex = dreamy.div;

/**
 * Flex component
 *
 * @See Docs https://dreamy-ui.com/docs/components/flex
 */
export const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
    const [patternProps, restProps] = splitProps(props, [
        "align",
        "justify",
        "direction",
        "wrap",
        "basis",
        "grow",
        "shrink"
    ]);

    const styles = flex.raw(patternProps);

    return (
        <DreamFlex
            ref={ref}
            {...styles}
            {...restProps}
        />
    );
});
