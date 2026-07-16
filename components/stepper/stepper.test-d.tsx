import { assertType } from "vitest";
import type {
    StepperContentProps,
    StepperItemProps,
    StepperNextTriggerProps,
    StepperPrevTriggerProps,
    StepperRootProps,
    StepperTriggerProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<number>({} as StepperRootProps["count"]);
assertType<number | undefined>({} as StepperRootProps["step"]);
assertType<number | undefined>({} as StepperRootProps["defaultStep"]);
assertType<((step: number) => void) | undefined>({} as StepperRootProps["onStepChange"]);
assertType<"horizontal" | "vertical" | undefined>({} as StepperRootProps["orientation"]);

assertType<number>({} as StepperItemProps["index"]);
assertType<number>({} as StepperTriggerProps["index"]);
assertType<number>({} as StepperContentProps["index"]);

const _size: StepperRootProps["size"] = "md";
const _scheme: StepperRootProps["scheme"] = "primary";
const _variant: StepperRootProps["variant"] = "solid";

type _HasCallbackProps = ExpectTrue<"onStepChange" extends keyof StepperRootProps ? true : false>;

type _HasRecipeProps = ExpectTrue<
    "size" extends keyof StepperRootProps
        ? "scheme" extends keyof StepperRootProps
            ? "variant" extends keyof StepperRootProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof StepperRootProps
        ? "color" extends keyof StepperRootProps
            ? "p" extends keyof StepperRootProps
                ? "m" extends keyof StepperRootProps
                    ? "w" extends keyof StepperRootProps
                        ? "h" extends keyof StepperRootProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    StepperItemProps extends object
        ? StepperTriggerProps extends object
            ? StepperNextTriggerProps extends object
                ? StepperPrevTriggerProps extends object
                    ? true
                    : false
                : false
            : false
        : false
>;

const _callbackProps: _HasCallbackProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _partProps: _HasPartProps = true;

void (_callbackProps && _recipeProps && _styleProps && _partProps && _size && _scheme && _variant);

assertType<StepperRootProps>({
    count: 3,
    step: 1,
    defaultStep: 0,
    onStepChange: () => {},
    orientation: "horizontal",
    size: "md",
    scheme: "primary",
    variant: "solid",
    className: "custom-stepper",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<StepperRootProps>({
    count: 3,
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<StepperRootProps>({
    count: 3,
    // @ts-expect-error invalid scheme
    scheme: "invalid"
});
