import { Box } from "@/components/box/box";
import { ariaAttr } from "@/utils/attr";
import { objectToDeps } from "@/utils/object";
import { cloneElement, forwardRef, useMemo } from "react";
import { image } from "styled-system/recipes";
import { dreamy } from "../factory";
import type { ImageProps } from "./image";

export interface ImageRSCProps extends Omit<ImageProps, "onError" | "onLoad" | "fallbackSrc"> {}

const StyledImage = dreamy("img", image);

/**
 * RSC compatible version of Image component.
 * It lacks of `fallbackSrc` prop and event handlers.
 *
 * @See Docs https://dreamy-ui.com/docs/components/image
 */
export const ImageRSC = forwardRef<HTMLImageElement, ImageRSCProps>(function ImageRSC(props, ref) {
    const { src, srcSet, loading, crossOrigin, referrerPolicy, zoomOnHover, blurShadow, ...rest } =
        props;

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const shared = useMemo(() => {
        return {
            ref,
            "data-zoomed": zoomOnHover,
            ...rest
        };
    }, [zoomOnHover, ref, ...objectToDeps(rest)]);

    const img = useMemo(
        () => (
            <StyledImage
                src={src}
                srcSet={srcSet}
                crossOrigin={crossOrigin}
                loading={loading}
                referrerPolicy={referrerPolicy}
                {...shared}
            />
        ),
        [shared, src, srcSet, crossOrigin, loading, referrerPolicy]
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
});
