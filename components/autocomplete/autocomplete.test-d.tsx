import type { ChangeDetails } from "@ui-sdk/core";
import type {
    ComboboxOpenChangeReason,
    ComboboxValueChangeReason
} from "@ui-sdk/react/combobox";
import { assertType } from "vitest";
import type {
    AutocompleteContentProps,
    AutocompleteInputProps,
    AutocompleteProps
} from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<
    ((value: string | null, details: ChangeDetails<ComboboxValueChangeReason>) => void) | undefined
>({} as AutocompleteProps["onValueChange"]);
assertType<string | null | undefined>({} as AutocompleteProps["value"]);
assertType<string | null | undefined>({} as AutocompleteProps["defaultValue"]);
assertType<boolean | undefined>({} as AutocompleteProps["clearable"]);
assertType<boolean | undefined>({} as AutocompleteProps["open"]);
assertType<boolean | undefined>({} as AutocompleteProps["defaultOpen"]);
assertType<
    ((open: boolean, details: ChangeDetails<ComboboxOpenChangeReason>) => void) | undefined
>({} as AutocompleteProps["onOpenChange"]);

assertType<string | undefined>({} as AutocompleteInputProps["placeholder"]);
assertType<string | undefined>({} as AutocompleteContentProps["noResultsText"]);

const _size: AutocompleteProps["size"] = "md";
const _variant: AutocompleteProps["variant"] = "plain";

type _HasCallbackProps = ExpectTrue<
    "onValueChange" extends KnownKeys<AutocompleteProps>
        ? "onOpenChange" extends KnownKeys<AutocompleteProps>
            ? "open" extends KnownKeys<AutocompleteProps>
                ? true
                : false
            : false
        : false
>;

type _NoLegacyProps = ExpectTrue<
    "onChangeValue" extends KnownKeys<AutocompleteProps>
        ? false
        : "isClearable" extends KnownKeys<AutocompleteProps>
          ? false
          : "isDisabled" extends KnownKeys<AutocompleteProps>
            ? false
            : "popoverProps" extends KnownKeys<AutocompleteProps>
              ? false
              : true
>;

type _HasRecipeProps = ExpectTrue<
    "size" extends KnownKeys<AutocompleteProps>
        ? "variant" extends KnownKeys<AutocompleteProps>
            ? true
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    "placeholder" extends KnownKeys<AutocompleteInputProps>
        ? "noResultsText" extends KnownKeys<AutocompleteContentProps>
            ? true
            : false
        : false
>;

const _callbackProps: _HasCallbackProps = true;
const _noLegacyProps: _NoLegacyProps = true;
const _recipeProps: _HasRecipeProps = true;
const _partProps: _HasPartProps = true;

void (
    _callbackProps &&
    _noLegacyProps &&
    _recipeProps &&
    _partProps &&
    _size &&
    _variant
);

assertType<AutocompleteProps>({
    items: [{ value: "a", label: "A" }],
    onValueChange: () => {},
    value: "a",
    defaultValue: "a",
    clearable: true,
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
