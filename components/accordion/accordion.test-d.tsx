import type { ChangeDetails } from "@ui-sdk/core";
import type { AccordionValueChangeReason } from "@ui-sdk/react/accordion";
import { assertType } from "vitest";
import type {
    AccordionContentProps,
    AccordionItemProps,
    AccordionProps,
    AccordionTriggerProps
} from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<boolean | undefined>({} as AccordionProps["multiple"]);
assertType<boolean | undefined>({} as AccordionProps["collapsible"]);
assertType<string[] | undefined>({} as AccordionProps["value"]);
assertType<string[] | undefined>({} as AccordionProps["defaultValue"]);
assertType<
    ((value: string[], details: ChangeDetails<AccordionValueChangeReason>) => void) | undefined
>({} as AccordionProps["onValueChange"]);

assertType<boolean | undefined>({} as AccordionItemProps["disabled"]);
assertType<string>({} as AccordionItemProps["value"]);
assertType<"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | undefined>(
    {} as AccordionTriggerProps["headingTag"]
);

type _HasStateProps = ExpectTrue<
    "value" extends KnownKeys<AccordionProps>
        ? "onValueChange" extends KnownKeys<AccordionProps>
            ? "multiple" extends KnownKeys<AccordionProps>
                ? "collapsible" extends KnownKeys<AccordionProps>
                    ? "keepMounted" extends KnownKeys<AccordionProps>
                        ? true
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    AccordionItemProps extends object
        ? AccordionTriggerProps extends object
            ? AccordionContentProps extends object
                ? true
                : false
            : false
        : false
>;

const _stateProps: _HasStateProps = true;
const _partProps: _HasPartProps = true;

void (_stateProps && _partProps);

assertType<AccordionProps>({
    multiple: true,
    collapsible: true,
    value: ["one"],
    defaultValue: ["one"],
    onValueChange: () => {}
});

assertType<AccordionTriggerProps>({
    headingTag: "h3",
    children: "Title"
});

assertType<AccordionItemProps>({
    disabled: true,
    value: "item",
    children: null
});

assertType<AccordionTriggerProps>({
    // @ts-expect-error invalid heading tag
    headingTag: "div"
});
