import { assertType } from "vitest";
import type {
    AutocompleteContentProps,
    AutocompleteInputProps,
    AutocompleteProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<((value: string | null) => void) | undefined>({} as AutocompleteProps["onChangeValue"]);
assertType<string | null | undefined>({} as AutocompleteProps["value"]);
assertType<string | undefined>({} as AutocompleteProps["defaultValue"]);
assertType<boolean | undefined>({} as AutocompleteProps["isClearable"]);
assertType<boolean | undefined>({} as AutocompleteProps["isOpen"]);
assertType<(() => void) | undefined>({} as AutocompleteProps["onOpen"]);
assertType<(() => void) | undefined>({} as AutocompleteProps["onClose"]);

assertType<string | undefined>({} as AutocompleteInputProps["placeholder"]);
assertType<string | undefined>({} as AutocompleteContentProps["noResultsText"]);

const _size: AutocompleteProps["size"] = "md";
const _variant: AutocompleteProps["variant"] = "plain";

type _HasCallbackProps = ExpectTrue<
    "onChangeValue" extends keyof AutocompleteProps
        ? "onOpen" extends keyof AutocompleteProps
            ? "onClose" extends keyof AutocompleteProps
                ? true
                : false
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "size" extends keyof AutocompleteProps
        ? "variant" extends keyof AutocompleteProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof AutocompleteProps
        ? "color" extends keyof AutocompleteProps
            ? "p" extends keyof AutocompleteProps
                ? "m" extends keyof AutocompleteProps
                    ? "w" extends keyof AutocompleteProps
                        ? "h" extends keyof AutocompleteProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    "placeholder" extends keyof AutocompleteInputProps
        ? "noResultsText" extends keyof AutocompleteContentProps
            ? true
            : false
        : false
>;

const _callbackProps: _HasCallbackProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _partProps: _HasPartProps = true;

void (_callbackProps && _recipeProps && _styleProps && _partProps && _size && _variant);

assertType<AutocompleteProps>({
    items: [{ value: "a", label: "A" }],
    onChangeValue: () => {},
    value: "a",
    defaultValue: "a",
    isClearable: true,
    size: "md",
    variant: "plain",
    triggerVariant: "outline",
    className: "custom-autocomplete",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "xs",
    h: "auto"
});

assertType<AutocompleteProps["onChangeValue"]>(
    // @ts-expect-error onChangeValue receives string | null, not a boolean
    (_value: boolean) => {}
);

assertType<AutocompleteProps>({
    items: [{ value: "a", label: "A" }],
    // @ts-expect-error invalid size
    size: "xxl"
});

assertType<AutocompleteProps>({
    items: [{ value: "a", label: "A" }],
    // @ts-expect-error invalid variant
    variant: "ghost"
});
