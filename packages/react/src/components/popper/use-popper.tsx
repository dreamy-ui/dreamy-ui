"use client";

import {
    arrow,
    autoUpdate,
    flip,
    offset,
    shift,
    size as sizeMiddleware,
    useFloating,
    type Middleware,
    type OffsetOptions
} from "@floating-ui/react";
import { mergeRefs } from "@/hooks/use-merge-refs";
import type { PropGetter } from "@/utils";
import { useCallback, useRef } from "react";
import type { PositioningProps } from "./positioning";
import { cssVars, getBoxShadow, toTransformOrigin } from "./utils";

function mirrorRTLPlacement(
    placement: PositioningProps["placement"],
    dir?: "ltr" | "rtl"
): PositioningProps["placement"] {
    if (!placement || dir !== "rtl") return placement;
    return placement
        .replace("left", "___TEMP___")
        .replace("right", "left")
        .replace("___TEMP___", "right") as PositioningProps["placement"];
}

export interface UsePopperProps extends PositioningProps {
    /**
     * Whether the popper is active. When `false`, auto-update is disabled.
     * @default true
     */
    enabled?: boolean;
}

export function usePopper(props: UsePopperProps = {}) {
    const {
        enabled = true,
        placement: placementProp = "bottom",
        gutter = 8,
        offset: offsetProp,
        flip: enableFlip = true,
        shift: enableShift = true,
        shiftPadding = 8,
        matchWidth: enableMatchWidth = false,
        strategy = "absolute",
        arrowPadding = 8,
        boundary,
        dir
    } = props;

    const arrowRef = useRef<HTMLElement | null>(null);

    const resolvedPlacement = mirrorRTLPlacement(placementProp, dir) ?? "bottom";

    const computedOffset: OffsetOptions =
        offsetProp !== undefined ? offsetProp : { mainAxis: gutter };

    const middleware: Middleware[] = [
        offset(computedOffset),
        ...(enableFlip
            ? [flip({ padding: 8, ...(boundary ? { boundary } : {}) })]
            : []),
        ...(enableShift
            ? [shift({ padding: shiftPadding, ...(boundary ? { boundary } : {}) })]
            : []),
        ...(enableMatchWidth
            ? [
                  sizeMiddleware({
                      apply({ rects, elements }) {
                          elements.floating.style.width = `${rects.reference.width}px`;
                      }
                  })
              ]
            : []),
        arrow({ element: arrowRef, padding: arrowPadding })
    ];

    const { refs, floatingStyles, placement, middlewareData, update } = useFloating({
        placement: resolvedPlacement,
        strategy,
        middleware,
        whileElementsMounted: enabled ? autoUpdate : undefined
    });

    const referenceRef = useCallback(
        <T extends Element>(node: T | null) => {
            refs.setReference(node);
        },
        [refs.setReference]
    );

    const getReferenceProps: PropGetter = useCallback(
        (props = {}) => {
            const { ref, ...rest } = props;
            return {
                ...rest,
                ref: mergeRefs(referenceRef, ref)
            };
        },
        [referenceRef]
    );

    const popperRef = useCallback(
        <T extends HTMLElement>(node: T | null) => {
            refs.setFloating(node);
        },
        [refs.setFloating]
    );

    const getPopperProps: PropGetter = useCallback(
        (props = {}) => {
            const { ref, style, ...rest } = props;
            return {
                ...rest,
                ref: mergeRefs(popperRef, ref),
                style: {
                    ...floatingStyles,
                    ...style,
                    [cssVars.transformOrigin.var]: toTransformOrigin(placement),
                    minWidth: enableMatchWidth ? undefined : "max-content"
                } as React.CSSProperties
            };
        },
        [floatingStyles, popperRef, placement, enableMatchWidth]
    );

    const getArrowProps: PropGetter = useCallback(
        (props: any = {}) => {
            const { size, shadowColor, bg, style, ref, ...rest } = props;

            const arrowData = middlewareData.arrow;
            const side = placement.split("-")[0] as "top" | "right" | "bottom" | "left";
            const staticSide =
                ({ top: "bottom", right: "left", bottom: "top", left: "right" } as const)[side] ??
                "bottom";

            // Build the style object without duplicate keys.
            // Setting `left: undefined` or `top: undefined` after `[staticSide]` in an
            // object literal would silently overwrite the static-side value, because
            // JavaScript last-key-wins semantics apply before React sees the object.
            const computedStyle: Record<string, unknown> = {
                position: "absolute",
                [staticSide]: `calc(${cssVars.arrowSize.varRef} / -2 + 1px)`,
                width: cssVars.arrowSize.varRef,
                height: cssVars.arrowSize.varRef,
                zIndex: -1,
                [cssVars.arrowSizeHalf.var]: `calc(${cssVars.arrowSize.varRef} / 2 - 1px)`,
                [cssVars.arrowOffset.var]: `calc(${cssVars.arrowSizeHalf.varRef} * -1)`,
                ...style
            };

            // Only add left/top from the arrow middleware when they are defined.
            // This avoids overriding the static-side position set above.
            if (arrowData?.x != null) computedStyle.left = `${arrowData.x}px`;
            if (arrowData?.y != null) computedStyle.top = `${arrowData.y}px`;

            if (size)
                computedStyle[cssVars.arrowSize.var] =
                    typeof size === "number" ? `${size}px` : size;
            if (shadowColor) computedStyle[cssVars.arrowShadowColor.var] = shadowColor;
            if (bg) computedStyle[cssVars.arrowBg.var] = bg;

            return {
                ...rest,
                ref: mergeRefs(arrowRef, ref),
                "data-popper-arrow": "",
                style: computedStyle as React.CSSProperties
            };
        },
        [middlewareData.arrow, placement]
    );

    const getArrowInnerProps: PropGetter = useCallback(
        (props = {}) => {
            const { style, ref, ...rest } = props;
            const boxShadow = getBoxShadow(placement);

            return {
                ...rest,
                ref,
                "data-popper-arrow-inner": "",
                style: {
                    transform: "rotate(45deg)",
                    background: cssVars.arrowBg.varRef,
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    position: "absolute" as const,
                    zIndex: "inherit",
                    boxShadow: "var(--popper-arrow-shadow, var(--popper-arrow-default-shadow))",
                    "--popper-arrow-default-shadow": boxShadow,
                    ...style
                } as React.CSSProperties
            };
        },
        [placement]
    );

    return {
        update,
        forceUpdate: update,
        transformOrigin: cssVars.transformOrigin.varRef,
        referenceRef,
        popperRef,
        getPopperProps,
        getArrowProps,
        getArrowInnerProps,
        getReferenceProps
    };
}

export type UsePopperReturn = ReturnType<typeof usePopper>;
