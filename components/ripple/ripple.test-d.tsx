import type { IRipple } from "@dreamy-ui/react";
import type { Key } from "react";
import { assertType } from "vitest";
import type { RippleProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<IRipple[]>({} as RippleProps["ripples"]);
assertType<string | null>({} as RippleProps["currentRipple"]);
assertType<(key: Key) => void>({} as RippleProps["onClear"]);
assertType<string | undefined>({} as RippleProps["color"]);
assertType<RippleProps["motionProps"]>({} as RippleProps["motionProps"]);
assertType<RippleProps["style"]>({} as RippleProps["style"]);

type _HasRequiredProps = ExpectTrue<
    "ripples" extends keyof RippleProps
        ? "currentRipple" extends keyof RippleProps
            ? "onClear" extends keyof RippleProps
                ? true
                : false
            : false
        : false
>;

type _HasOptionalVisualProps = ExpectTrue<
    "color" extends keyof RippleProps
        ? "motionProps" extends keyof RippleProps
            ? "style" extends keyof RippleProps
                ? true
                : false
            : false
        : false
>;

const _required: _HasRequiredProps = true;
const _optional: _HasOptionalVisualProps = true;

void (_required && _optional);

assertType<RippleProps>({
    ripples: [{ key: "1", x: 0, y: 0, size: 40 }],
    currentRipple: null,
    onClear: (_key) => {},
    color: "currentColor",
    style: { opacity: 0.2 },
    motionProps: { transition: { duration: 0.2 } }
});

assertType<RippleProps>({
    ripples: [{ key: "1", x: 0, y: 0, size: 40 }],
    currentRipple: "1",
    // @ts-expect-error onClear must accept a React key
    onClear: (_key: boolean) => {}
});

assertType<RippleProps>({
    // @ts-expect-error ripples must be an array of IRipple
    ripples: "none",
    currentRipple: null,
    onClear: () => {}
});
