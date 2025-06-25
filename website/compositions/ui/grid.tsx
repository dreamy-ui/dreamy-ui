import { splitProps } from "@dreamy-ui/react";
import { forwardRef } from "react";
import {
	type GridItemProperties,
	type GridProperties,
	grid,
	gridItem
} from "styled-system/patterns";
import { type HTMLDreamyProps, dreamy } from "./factory";

export interface GridProps
	extends Omit<HTMLDreamyProps<"div">, keyof GridProperties>,
		GridProperties {}

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

	return <dreamy.div ref={ref} {...styles} {...restProps} />;
});

Grid.displayName = "Grid";

export interface GridItemProps
	extends Omit<HTMLDreamyProps<"div">, keyof GridItemProperties>,
		GridItemProperties {}

/**
 * GridItem component
 *
 * @See Docs https://dreamy-ui.com/docs/components/grid
 */
export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
	(props, ref) => {
		const [patternProps, restProps] = splitProps(props, [
			"colSpan",
			"rowSpan",
			"colStart",
			"rowStart",
			"colEnd",
			"rowEnd"
		]);

		const styles = gridItem.raw(patternProps);

		return <dreamy.div ref={ref} {...styles} {...restProps} />;
	}
);

GridItem.displayName = "GridItem";
