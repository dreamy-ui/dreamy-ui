import { splitProps } from "@dreamy-ui/react/rsc";

import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import {
    type GridItemProperties,
    type GridProperties,
    grid,
    gridItem
} from "styled-system/patterns";

export interface GridProps
    extends Omit<HTMLDreamyProps<"div">, keyof GridProperties>,
        GridProperties {}

/**
 * Grid component — responsive CSS grid layout container.
 *
 * @see Docs https://dreamy-ui.com/docs/components/grid
 *
 * @example
 * ```tsx
 * <Grid columns={3} gap={4}>
 *   <GridItem>1</GridItem>
 *   <GridItem>2</GridItem>
 *   <GridItem>3</GridItem>
 * </Grid>
 * ```
 */
export function Grid(props: GridProps) {
    const [patternProps, restProps] = splitProps(props, [
        "gap",
        "columnGap",
        "rowGap",
        "columns",
        "minChildWidth"
    ]);

    const styles = grid.raw(patternProps);

    return (
        <dreamy.div
            {...styles}
            {...restProps}
        />
    );
}

export interface GridItemProps
    extends Omit<HTMLDreamyProps<"div">, keyof GridItemProperties>,
        GridItemProperties {}

/**
 * Grid Item — child cell within a grid layout.
 */
export function GridItem(props: GridItemProps) {
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
        <dreamy.div
            {...styles}
            {...restProps}
        />
    );
}
