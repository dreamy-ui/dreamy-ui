import type { PositioningProps } from "@dreamy-ui/react";
import type { PopoverContentProps as UiSdkPopoverContentProps } from "@ui-sdk/react/popover";

export type UiSdkPositioning = Pick<
    UiSdkPopoverContentProps,
    "side" | "align" | "sideOffset" | "alignOffset" | "collisionPadding" | "arrowPadding"
> & {
    matchWidth?: boolean;
};

const UI_SDK_SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * Maps Dreamy's floating-ui style `PositioningProps` onto UI SDK popover
 * content props (`side`/`align`/offsets). `flip`, `shift`, `strategy`,
 * `boundary`, and `dir` have no UI SDK equivalent; the popup always flips and
 * shifts within `collisionPadding`.
 */
export function mapUiSdkPositioning(positioning?: PositioningProps): UiSdkPositioning {
    if (!positioning) return {};

    const {
        placement = "bottom",
        gutter = 8,
        offset,
        shiftPadding = 8,
        arrowPadding,
        matchWidth
    } = positioning;

    const [sideToken, alignToken] = placement.split("-");
    const side = (UI_SDK_SIDES as readonly string[]).includes(sideToken)
        ? (sideToken as UiSdkPositioning["side"])
        : "bottom";
    const align =
        alignToken === "start" || alignToken === "end"
            ? alignToken
            : ("center" as const);

    let sideOffset = gutter;
    let alignOffset: number | undefined;
    if (typeof offset === "number") {
        sideOffset = offset;
    } else if (offset) {
        if (offset.mainAxis !== undefined) sideOffset = offset.mainAxis;
        alignOffset = offset.crossAxis;
    }

    return {
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding: shiftPadding,
        arrowPadding,
        matchWidth
    };
}
