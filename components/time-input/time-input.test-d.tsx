import type { ReactNode } from "react";
import { assertType } from "vitest";
import type { TimeInputProps, TimeInputTriggerProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<((value: string) => void) | undefined>({} as TimeInputProps["onChange"]);
assertType<string | undefined>({} as TimeInputProps["value"]);
assertType<string | undefined>({} as TimeInputProps["defaultValue"]);
assertType<boolean | undefined>({} as TimeInputProps["hour12"]);
assertType<number | undefined>({} as TimeInputProps["minuteStep"]);
assertType<number | undefined>({} as TimeInputProps["secondStep"]);
assertType<number | undefined>({} as TimeInputProps["millisecondStep"]);
assertType<("hour" | "minute" | "second" | "millisecond")[] | undefined>(
    {} as TimeInputProps["fields"]
);
assertType<boolean | undefined>({} as TimeInputProps["isDisabled"]);
assertType<boolean | undefined>({} as TimeInputProps["isInvalid"]);
assertType<boolean | undefined>({} as TimeInputProps["isRequired"]);

const _size: TimeInputProps["size"] = "md";
const _variant: TimeInputProps["variant"] = "outline";
const _fields: TimeInputProps["fields"] = ["hour", "minute", "second", "millisecond"];

assertType<ReactNode | null | undefined>({} as TimeInputTriggerProps["icon"]);

type _HasCallbackProps = ExpectTrue<"onChange" extends keyof TimeInputProps ? true : false>;

type _HasRecipeProps = ExpectTrue<
    "size" extends keyof TimeInputProps
        ? "variant" extends keyof TimeInputProps
            ? true
            : false
        : false
>;

type _HasHour12 = ExpectTrue<"hour12" extends keyof TimeInputProps ? true : false>;
type _HasFields = ExpectTrue<"fields" extends keyof TimeInputProps ? true : false>;
