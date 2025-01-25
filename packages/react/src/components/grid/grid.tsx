import { dreamy } from "@/components/factory";
import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import {
    type GridItemProperties,
    type GridProperties,
    grid,
    gridItem
} from "@dreamy-ui/system/patterns";
import { forwardRef } from "react";

export interface GridProps
    extends Omit<HTMLDreamProps<"div">, keyof GridProperties>,
        GridProperties {}

const DreamGrid = dreamy.div;

/**
 * Flex component
 *
 * @See Docs https://dreamy-ui.com/docs/components/grid
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>((props, ref) => {
    const [patternProps, restProps] = splitProps(props, [
        "gap",
        "columnGap",
        "rowGap",
        "columns",
        "minChildWidth"
    ]);

    const styles = grid.raw(patternProps);

    return (
        <DreamGrid
            ref={ref}
            {...styles}
            {...restProps}
        />
    );
});

Grid.displayName = "Grid";

export interface GridItemProps
    extends Omit<HTMLDreamProps<"div">, keyof GridItemProperties>,
        GridItemProperties {}

/**
 * GridItem component
 *
 * @See Docs https://dreamy-ui.com/docs/components/grid
 */
export const GridItem = forwardRef<HTMLDivElement, GridItemProps>((props, ref) => {
    const [patternProps, restProps] = splitProps(props, [
        "colSpan",
        "rowSpan",
        "colStart",
        "rowStart",
        "colEnd",
        "rowEnd"
    ]);

    const styles = gridItem.raw(patternProps);

    return (
        <DreamGrid
            ref={ref}
            {...styles}
            {...restProps}
        />
    );
});

GridItem.displayName = "GridItem";
