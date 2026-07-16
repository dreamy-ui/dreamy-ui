import { assertType } from "vitest";
import type { ImageProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<string | undefined>({} as ImageProps["alt"]);
assertType<string | undefined>({} as ImageProps["src"]);
assertType<string | undefined>({} as ImageProps["fallbackSrc"]);
assertType<boolean | undefined>({} as ImageProps["zoomOnHover"]);
assertType<boolean | undefined>({} as ImageProps["blurShadow"]);
assertType<ImageProps["wrapperProps"]>({} as ImageProps["wrapperProps"]);
assertType<ImageProps["zoomOptions"]>({} as ImageProps["zoomOptions"]);
assertType<ImageProps["blurOptions"]>({} as ImageProps["blurOptions"]);

type _HasHelperProps = ExpectTrue<
    "fallbackSrc" extends keyof ImageProps
        ? "zoomOnHover" extends keyof ImageProps
            ? "blurShadow" extends keyof ImageProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof ImageProps
        ? "color" extends keyof ImageProps
            ? "p" extends keyof ImageProps
                ? "m" extends keyof ImageProps
                    ? "w" extends keyof ImageProps
                        ? "h" extends keyof ImageProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _helperProps: _HasHelperProps = true;
const _styleProps: _HasStyleProps = true;

void (_helperProps && _styleProps);

assertType<ImageProps>({
    alt: "Coffee",
    src: "/coffee.webp",
    fallbackSrc: "/fallback.webp",
    zoomOnHover: true,
    blurShadow: true,
    zoomOptions: { scale: 1.1, duration: "200ms" },
    blurOptions: { scale: 1.05, radius: "12px", opacity: 0.5 },
    wrapperProps: { className: "image-wrapper" },
    className: "custom-image",
    loading: "lazy",
    bg: "transparent",
    color: "fg",
    p: 0,
    m: 1,
    w: "250px",
    h: "auto",
    rounded: "lg"
});

assertType<ImageProps>({
    alt: "Coffee",
    // @ts-expect-error zoomOnHover must be boolean
    zoomOnHover: "yes"
});
