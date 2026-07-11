import type { Placement as FloatingPlacement } from "@floating-ui/react";

/**
 * Standard 12-point placement for floating elements, powered by Floating UI.
 */
export type Placement = FloatingPlacement;

/**
 * Unified positioning configuration object.
 * Used by all floating UI-backed components (Tooltip, Popover, HoverCard, Menu, Select, Autocomplete, DatePicker, etc.)
 * to control how the floating element is positioned relative to its reference.
 */
export interface PositioningProps {
    /**
     * Placement of the floating element relative to the reference element.
     * @default "bottom"
     */
    placement?: Placement;
    /**
     * Distance (in px) between the reference and floating element.
     * Overridden by `offset` when both are provided.
     * @default 8
     */
    gutter?: number;
    /**
     * Fine-grained offset control.
     * When provided, takes precedence over `gutter`.
     */
    offset?: number | { mainAxis?: number; crossAxis?: number; alignmentAxis?: number };
    /**
     * Flip to the opposite placement when the floating element would overflow the boundary.
     * @default true
     */
    flip?: boolean;
    /**
     * Shift along the cross-axis to keep the floating element in view when it would overflow.
     * @default true
     */
    shift?: boolean;
    /**
     * Minimum distance (in px) between the floating element and the viewport edge when shifting.
     * @default 8
     */
    shiftPadding?: number;
    /**
     * Make the floating element's width match the reference element's width.
     * Useful for Select, Autocomplete, DatePicker.
     * @default false
     */
    matchWidth?: boolean;
    /**
     * The CSS `position` strategy for the floating element.
     * Use `"fixed"` when the reference is inside a container with `overflow: hidden`.
     * @default "absolute"
     */
    strategy?: "absolute" | "fixed";
    /**
     * Padding (in px) to prevent the arrow from reaching the very edge of the floating element.
     * @default 8
     */
    arrowPadding?: number;
    /**
     * The clipping boundary element used for overflow detection.
     * Defaults to the viewport.
     */
    boundary?: Element | "clippingAncestors";
    /**
     * Text direction. When `"rtl"`, `left` and `right` placements are mirrored.
     * @default "ltr"
     */
    dir?: "ltr" | "rtl";
}
