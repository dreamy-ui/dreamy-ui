import { assertType } from "vitest";
import type {
    AccordionContentProps,
    AccordionItemProps,
    AccordionProps,
    AccordionTriggerProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean | undefined>({} as AccordionProps["allowMultiple"]);
assertType<boolean | undefined>({} as AccordionProps["allowToggle"]);
assertType<boolean | undefined>({} as AccordionProps["reduceMotion"]);
assertType<number | number[] | undefined>({} as AccordionProps["index"]);
assertType<number | number[] | undefined>({} as AccordionProps["defaultIndex"]);
assertType<((index: number | number[]) => void) | undefined>({} as AccordionProps["onChange"]);

assertType<boolean | undefined>({} as AccordionItemProps["isDisabled"]);
assertType<"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | undefined>(
    {} as AccordionTriggerProps["headingTag"]
);
assertType<AccordionContentProps["collapseProps"]>({} as AccordionContentProps["collapseProps"]);

type _HasStateProps = ExpectTrue<
    "index" extends keyof AccordionProps
        ? "onChange" extends keyof AccordionProps
            ? "allowMultiple" extends keyof AccordionProps
                ? "allowToggle" extends keyof AccordionProps
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
    allowMultiple: true,
    allowToggle: true,
    reduceMotion: true,
    index: 0,
    defaultIndex: [0],
    onChange: () => {}
});

assertType<AccordionTriggerProps>({
    headingTag: "h3",
    children: "Title"
});

assertType<AccordionItemProps>({
    isDisabled: true,
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
