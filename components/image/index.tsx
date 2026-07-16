"use client";

import { ariaAttr, callAllHandlers, objectToDeps, omit } from "@dreamy-ui/react";
import { cloneElement, useMemo, useRef, type SyntheticEvent } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { image } from "styled-system/recipes";
import type { SystemProperties } from "styled-system/types";
import { Box, type BoxProps } from "../box";

export interface ImageProps extends HTMLDreamyProps<"img">, SystemProperties {
    /**
     * Fallback image `src` to show if image fails.
     */
    fallbackSrc?: string;
    /**
     * If `true`, image will zoom in on hover
     *
     * @default false
     */
    zoomOnHover?: boolean;
    /**
     * If `true`, 2nd image will be placed behind with a blur effect
     *
     * @default false
     */
    blurShadow?: boolean;
    /**
     * The props of the wrapper
     */
    wrapperProps?: BoxProps;
    /**
     * The options of the hover on zoom
     */
    zoomOptions?: {
        scale?: number;
        duration?: string;
    };
    /**
     * The options of the blur shadow
     */
    blurOptions?: {
        scale?: number;
        radius?: string;
        opacity?: number;
    };
}

const StyledImage = dreamy("img", image);

/**
 * Native image with useful helpers.
 *
 * @See Docs https://dreamy-ui.com/docs/components/image
 */
export function Image(props: ImageProps) {
    const {
        fallbackSrc,
        src,
        srcSet,
        loading,
        crossOrigin,
        referrerPolicy,
        zoomOnHover,
        blurShadow,
        wrapperProps,
        zoomOptions,
        blurOptions,
        ...rest
    } = props;

    const hasErrored = useRef(false);

    const shared = useMemo(() => {
        return {
            "data-zoomed": zoomOnHover,
            ...omit(rest, ["onError", "onLoad"])
        };
    }, [zoomOnHover, ...objectToDeps(rest)]);

    const img = useMemo(
        () => (
            <StyledImage
                src={src}
                srcSet={srcSet}
                crossOrigin={crossOrigin}
                loading={loading}
                referrerPolicy={referrerPolicy}
                {...shared}
                onError={callAllHandlers((e: SyntheticEvent<HTMLImageElement>) => {
                    if (fallbackSrc && !hasErrored.current) {
                        hasErrored.current = true;
                        e.currentTarget.src = fallbackSrc;
                    }
                }, rest.onError)}
            />
        ),
        [shared, src, srcSet, crossOrigin, loading, referrerPolicy, rest.onError, fallbackSrc]
    );

    const zoomed = useMemo(() => {
        if (!zoomOnHover) return null;

        return (
            <Box
                as={"div"}
                data-part={"wrapper-zoomed"}
                {...shared}
            >
                {img}
            </Box>
        );
    }, [img, zoomOnHover, shared]);

    if (blurShadow || zoomOnHover) {
        return (
            <Box
                as={"div"}
                data-part={"wrapper"}
                {...wrapperProps}
                style={{
                    // @ts-expect-error
                    "--hover-zoom-scale": zoomOptions?.scale,
                    "--blurred-zoom-scale": blurOptions?.scale,
                    "--blur-radius": blurOptions?.radius,
                    "--blurred-opacity": blurOptions?.opacity,
                    ...wrapperProps?.style
                }}
            >
                {zoomOnHover ? zoomed : img}
                {blurShadow &&
                    cloneElement(img, {
                        "data-part": "blurred",
                        className: shared.className?.replace("dreamy-image", ""),
                        "aria-hidden": ariaAttr(true)
                    })}
            </Box>
        );
    }

    return img;
}
