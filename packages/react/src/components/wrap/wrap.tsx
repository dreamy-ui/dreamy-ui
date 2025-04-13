import { dreamy } from "@/components/factory";
import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import type { WrapProperties } from "styled-system/patterns";
import { wrap } from "styled-system/patterns/wrap";

export interface WrapProps
    extends Omit<HTMLDreamProps<"div">, keyof WrapProperties>,
        WrapProperties {}

const DreamWrap = dreamy.div;

/**
 * Wrap component
 *
 * @See Docs https://dreamy-ui.com/docs/components/wrap
 */
export const Wrap = forwardRef<HTMLDivElement, WrapProps>((props, ref) => {
    const [patternProps, restProps] = splitProps(props, [
        "gap",
        "rowGap",
        "columnGap",
        "align",
        "justify"
    ]);

    const styles = wrap.raw(patternProps);

    return (
        <DreamWrap
            ref={ref}
            {...styles}
            {...restProps}
        />
    );
});
