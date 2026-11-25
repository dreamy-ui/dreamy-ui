import type { ChangeDetails } from "@ui-sdk/core";
import { assertType } from "vitest";
import type {
    ActionBarCloseTriggerProps,
    ActionBarContentProps,
    ActionBarOpenChangeReason,
    ActionBarRootProps,
    ActionBarSelectionTriggerProps,
    ActionBarSeparatorProps
} from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<boolean | undefined>({} as ActionBarRootProps["open"]);
assertType<boolean | undefined>({} as ActionBarRootProps["defaultOpen"]);
assertType<
    ((open: boolean, details: ChangeDetails<ActionBarOpenChangeReason>) => void) | undefined
>({} as ActionBarRootProps["onOpenChange"]);
assertType<boolean | undefined>({} as ActionBarRootProps["closeOnEscape"]);
assertType<ActionBarRootProps["portalProps"]>({} as ActionBarRootProps["portalProps"]);
assertType<ActionBarRootProps["size"]>({} as ActionBarRootProps["size"]);

assertType<string | undefined>({} as ActionBarContentProps["aria-label"]);
assertType<React.AriaRole | undefined>({} as ActionBarContentProps["role"]);

assertType<ActionBarSelectionTriggerProps["children"]>(
    {} as ActionBarSelectionTriggerProps["children"]
);
assertType<ActionBarSeparatorProps["role"]>({} as ActionBarSeparatorProps["role"]);
assertType<string | undefined>({} as ActionBarCloseTriggerProps["aria-label"]);

type _HasOpenProps = ExpectTrue<
    "open" extends KnownKeys<ActionBarRootProps>
        ? "defaultOpen" extends KnownKeys<ActionBarRootProps>
            ? "onOpenChange" extends KnownKeys<ActionBarRootProps>
                ? "closeOnEscape" extends KnownKeys<ActionBarRootProps>
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasNoLegacyProps = ExpectTrue<
    "isOpen" extends KnownKeys<ActionBarRootProps>
        ? false
        : "defaultIsOpen" extends KnownKeys<ActionBarRootProps>
          ? false
          : true
>;

type _HasA11ySurfaceProps = ExpectTrue<
    "aria-label" extends KnownKeys<ActionBarContentProps>
        ? "role" extends KnownKeys<ActionBarContentProps>
            ? true
            : false
        : false
>;

type _HasCloseName = ExpectTrue<
    "aria-label" extends KnownKeys<ActionBarCloseTriggerProps> ? true : false
>;

type _HasRecipeProps = ExpectTrue<"size" extends KnownKeys<ActionBarRootProps> ? true : false>;

const _open: _HasOpenProps = true;
const _noLegacy: _HasNoLegacyProps = true;
const _a11y: _HasA11ySurfaceProps = true;
const _close: _HasCloseName = true;
const _recipe: _HasRecipeProps = true;

void (_open && _noLegacy && _a11y && _close && _recipe);

assertType<ActionBarRootProps>({
    open: true,
    defaultOpen: false,
    onOpenChange: () => {},
    closeOnEscape: true,
    size: "md",
    portalProps: { appendToParentPortal: true }
});

assertType<ActionBarContentProps>({
    "aria-label": "Actions",
    role: "toolbar",
    className: "content"
});

assertType<ActionBarCloseTriggerProps>({
    "aria-label": "Close action bar"
});

assertType<ActionBarRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<ActionBarContentProps>({
    // @ts-expect-error role must be a valid ARIA role string when provided
    role: 123
});
