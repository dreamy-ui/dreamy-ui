import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
    zoomedWrapper: { selector: '[data-part="wrapper-zoomed"]:has(&)' },
    wrapper: { selector: '[data-part="wrapper"]:has(&)' },
    image: { selector: "&" },
    blurredImg: { selector: '[data-part="wrapper"]:has(&) [data-part="blurred"]' }
});

export { parts as imageParts };

export const image = defineRecipe({
    className: "dreamy-image",
    jsx: ["Image"],
    staticCss: ["*"],
    base: parts({
        image: {
            "&[data-zoomed]": {
                transition: "transform {durations.normal} {easings.ease-in-out}",
                _hover: {
                    transform: "scale(1.1)"
                }
            }
        },
        wrapper: {
            position: "relative",
            maxW: "fit-content",
            rounded: "inherit"
        },
        zoomedWrapper: {
            overflow: "hidden",
            position: "relative",
            maxW: "fit-content"
        },
        blurredImg: {
            filter: "auto",
            blur: "{blurs.lg}",
            position: "absolute",
            inset: "0",
            zIndex: -1,
            translate: "auto",
            scale: "1.05",
            saturate: "150%",
            opacity: 0.4,
            y: "1"
        }
    })
});
