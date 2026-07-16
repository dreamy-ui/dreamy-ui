import { assertType } from "vitest";
import type {
    StatDownIndicatorProps,
    StatHintProps,
    StatLabelProps,
    StatRootProps,
    StatUpIndicatorProps,
    StatValueTextProps,
    StatValueUnitProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<StatRootProps["size"]>({} as StatRootProps["size"]);
assertType<string | undefined>({} as StatUpIndicatorProps["aria-label"]);
assertType<string | undefined>({} as StatDownIndicatorProps["aria-label"]);

type _HasRecipeProps = ExpectTrue<"size" extends keyof StatRootProps ? true : false>;

type _HasIndicatorA11y = ExpectTrue<
    "aria-label" extends keyof StatUpIndicatorProps
        ? "aria-label" extends keyof StatDownIndicatorProps
            ? true
            : false
        : false
>;

const _recipe: _HasRecipeProps = true;
const _indicator: _HasIndicatorA11y = true;
const _size: StatRootProps["size"] = "md";

void (_recipe && _indicator && _size);

assertType<StatRootProps>({
    size: "md",
    className: "stat"
});

assertType<StatLabelProps>({
    children: "Revenue"
});

assertType<StatValueTextProps>({
    children: "100"
});

assertType<StatValueUnitProps>({
    children: "%"
});

assertType<StatHintProps>({
    children: "from last month"
});

assertType<StatUpIndicatorProps>({
    "aria-label": "increased",
    "aria-hidden": true
});

assertType<StatDownIndicatorProps>({
    "aria-label": "decreased"
});

assertType<StatRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<StatUpIndicatorProps>({
    // @ts-expect-error aria-hidden must be booleanish
    "aria-hidden": 1
});
