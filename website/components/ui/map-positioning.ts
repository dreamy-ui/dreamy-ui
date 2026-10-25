import type { PositioningProps } from "@dreamy-ui/react";
import type { PopoverRootProps } from "@ark-ui/react/popover";

export type MappedPositioning = NonNullable<PopoverRootProps["positioning"]>;

function resolveOffset(
    offset: PositioningProps["offset"],
    gutter: number
): MappedPositioning["offset"] {
    if (offset === undefined) {
        return { mainAxis: gutter };
    }
    if (typeof offset === "number") {
        return { mainAxis: offset };
    }
    return {
        mainAxis: offset.mainAxis,
        crossAxis: offset.crossAxis
    };
}

export function mapPositioningProps(positioning?: PositioningProps): MappedPositioning | undefined {
    if (!positioning) return undefined;

    const {
        placement,
        gutter = 8,
        offset,
        flip = true,
        shift = true,
        shiftPadding = 8,
        matchWidth,
        strategy,
        boundary,
        arrowPadding
    } = positioning;

    const mapped: MappedPositioning = {
        placement,
        offset: resolveOffset(offset, gutter),
        strategy,
        boundary,
        arrowPadding
    };

    if (matchWidth !== undefined) {
        mapped.sameWidth = matchWidth;
    }

    if (!flip) {
        mapped.flip = false;
    }

    if (shift) {
        mapped.shift = shiftPadding;
    } else {
        mapped.shift = false;
    }

    return mapped;
}
