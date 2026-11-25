import type { ChangeDetails } from "@ui-sdk/core";
import type { TimeInputValueChangeReason } from "@ui-sdk/react/time-input";
import type { ReactNode } from "react";
import { assertType } from "vitest";
import type { TimeInputProps, TimeInputTriggerProps } from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<
    ((value: string | null, details: ChangeDetails<TimeInputValueChangeReason>) => void) | undefined
>({} as TimeInputProps["onValueChange"]);
assertType<string | null | undefined>({} as TimeInputProps["value"]);
assertType<string | null | undefined>({} as TimeInputProps["defaultValue"]);
assertType<12 | 24 | undefined>({} as TimeInputProps["hourCycle"]);
assertType<"hour" | "minute" | "second" | undefined>({} as TimeInputProps["granularity"]);
assertType<number | undefined>({} as TimeInputProps["minuteStep"]);
assertType<number | undefined>({} as TimeInputProps["secondStep"]);
assertType<boolean | undefined>({} as TimeInputProps["disabled"]);
assertType<boolean | undefined>({} as TimeInputProps["readOnly"]);
assertType<boolean | undefined>({} as TimeInputProps["invalid"]);
assertType<boolean | undefined>({} as TimeInputProps["required"]);

const _size: TimeInputProps["size"] = "md";
const _variant: TimeInputProps["variant"] = "outline";

assertType<ReactNode | null | undefined>({} as TimeInputTriggerProps["icon"]);

type _HasCallbackProps = ExpectTrue<
    "onValueChange" extends KnownKeys<TimeInputProps>
        ? "hourCycle" extends KnownKeys<TimeInputProps>
            ? "granularity" extends KnownKeys<TimeInputProps>
                ? true
                : false
            : false
        : false
>;

type _NoLegacyProps = ExpectTrue<
    "onChange" extends KnownKeys<TimeInputProps>
        ? false
        : "isDisabled" extends KnownKeys<TimeInputProps>
          ? false
          : "hour12" extends KnownKeys<TimeInputProps>
            ? false
            : "popoverProps" extends KnownKeys<TimeInputProps>
              ? false
              : true
>;

type _HasRecipeProps = ExpectTrue<
    "size" extends KnownKeys<TimeInputProps>
        ? "variant" extends KnownKeys<TimeInputProps>
            ? true
            : false
        : false
>;

const _callbackProps: _HasCallbackProps = true;
const _noLegacyProps: _NoLegacyProps = true;
const _recipeProps: _HasRecipeProps = true;

void (_callbackProps && _noLegacyProps && _recipeProps && _size && _variant);
