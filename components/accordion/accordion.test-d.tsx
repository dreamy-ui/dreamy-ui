import { assertType } from "vitest";
import type { AccordionRootProps } from "@ark-ui/react/accordion";
import type {
    AccordionContentProps,
    AccordionItemProps,
    AccordionProps,
    AccordionTriggerProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean | undefined>({} as AccordionProps["multiple"]);
assertType<boolean | undefined>({} as AccordionProps["collapsible"]);
assertType<string[] | undefined>({} as AccordionProps["value"]);
assertType<string[] | undefined>({} as AccordionProps["defaultValue"]);
assertType<AccordionRootProps["onValueChange"]>({} as AccordionProps["onValueChange"]);

assertType<boolean | undefined>({} as AccordionItemProps["disabled"]);
assertType<string>({} as AccordionItemProps["value"]);
assertType<"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | undefined>(
    {} as AccordionTriggerProps["headingTag"]
);
assertType<AccordionContentProps["collapseProps"]>({} as AccordionContentProps["collapseProps"]);

type _HasStateProps = ExpectTrue<
    "value" extends keyof AccordionProps
        ? "onValueChange" extends keyof AccordionProps
            ? "multiple" extends keyof AccordionProps
                ? "collapsible" extends keyof AccordionProps
                    ? true
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

assertType<AccordionProps>({
    // @ts-expect-error headingTag belongs on Trigger, not Root
    headingTag: "h2"
});

assertType<AccordionTriggerProps>({
    // @ts-expect-error invalid heading tag
    headingTag: "div"
});
