import type { MotionProps } from "motion/react";
import { assertType } from "vitest";
import { type SwitchController, type SwitchProps, createSwitchController } from "./index";

type ExpectTrue<T extends true> = T;

assertType<CheckedStateLike | undefined>({} as SwitchProps["checked"]);
assertType<CheckedStateLike | undefined>({} as SwitchProps["defaultChecked"]);
assertType<((checked: boolean, details: never) => void) | undefined>(
    {} as SwitchProps["onCheckedChange"]
);

assertType<boolean | undefined>({} as SwitchProps["disabled"]);
assertType<boolean | undefined>({} as SwitchProps["readOnly"]);
assertType<boolean | undefined>({} as SwitchProps["required"]);
assertType<boolean | undefined>({} as SwitchProps["isInvalid"]);

assertType<React.ReactNode | ((state: never) => React.ReactNode) | undefined>(
    {} as SwitchProps["icon"]
);
assertType<SwitchProps>({
    icon: (state) => (state.checked ? "On" : "Off")
});
const _controller = createSwitchController();
assertType<SwitchController>(_controller);
assertType<MotionProps | undefined>({} as SwitchProps["thumbProps"]);

assertType<string | undefined>({} as SwitchProps["name"]);
assertType<string | undefined>({} as SwitchProps["value"]);
assertType<string | undefined>({} as SwitchProps["form"]);
assertType<SwitchController | undefined>({} as SwitchProps["controller"]);
assertType<boolean | undefined>({} as SwitchProps["debug"]);

const _scheme: SwitchProps["scheme"] = "primary";
const _size: SwitchProps["size"] = "md";

assertType<string | undefined>({} as SwitchProps["aria-label"]);
assertType<string | undefined>({} as SwitchProps["aria-labelledby"]);
assertType<string | undefined>({} as SwitchProps["aria-describedby"]);
assertType<boolean | undefined>({} as SwitchProps["reduceMotion"]);

type _HasCallbackProps = ExpectTrue<
    "checked" extends keyof SwitchProps
        ? "onCheckedChange" extends keyof SwitchProps
            ? true
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "scheme" extends keyof SwitchProps
        ? "size" extends keyof SwitchProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof SwitchProps
        ? "color" extends keyof SwitchProps
            ? "p" extends keyof SwitchProps
                ? "m" extends keyof SwitchProps
                    ? "w" extends keyof SwitchProps
                        ? "h" extends keyof SwitchProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _callbackProps: _HasCallbackProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_callbackProps && _recipeProps && _styleProps && _scheme && _size);

assertType<SwitchProps>({
    checked: true,
    defaultChecked: false,
    onCheckedChange: () => {},
    disabled: false,
    readOnly: false,
    required: false,
    isInvalid: false,
    icon: null,
    thumbProps: { layout: false },
    name: "notifications",
    value: "on",
    reduceMotion: true,
    "aria-label": "Notifications",
    "aria-labelledby": "label-id",
    "aria-describedby": "hint-id",
    className: "custom-switch",
    id: "switch-root",
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<SwitchProps>({
    // @ts-expect-error invalid color scheme
    scheme: "invalid"
});

assertType<SwitchProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

type CheckedStateLike = boolean | "indeterminate";
