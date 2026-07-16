import { assertType } from "vitest";
import type {
    ActionBarCloseTriggerProps,
    ActionBarContentProps,
    ActionBarRootProps,
    ActionBarSelectionTriggerProps,
    ActionBarSeparatorProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean | undefined>({} as ActionBarRootProps["isOpen"]);
assertType<boolean | undefined>({} as ActionBarRootProps["defaultIsOpen"]);
assertType<(() => void) | undefined>({} as ActionBarRootProps["onOpen"]);
assertType<(() => void) | undefined>({} as ActionBarRootProps["onClose"]);
assertType<ActionBarRootProps["portalProps"]>({} as ActionBarRootProps["portalProps"]);
assertType<ActionBarRootProps["size"]>({} as ActionBarRootProps["size"]);

assertType<string | undefined>({} as ActionBarContentProps["aria-label"]);
assertType<string | undefined>({} as ActionBarContentProps["role"]);

assertType<ActionBarSelectionTriggerProps["children"]>(
    {} as ActionBarSelectionTriggerProps["children"]
);
assertType<ActionBarSeparatorProps["role"]>({} as ActionBarSeparatorProps["role"]);
assertType<string | undefined>({} as ActionBarCloseTriggerProps["aria-label"]);

type _HasOpenProps = ExpectTrue<
    "isOpen" extends keyof ActionBarRootProps
        ? "defaultIsOpen" extends keyof ActionBarRootProps
            ? "onOpen" extends keyof ActionBarRootProps
                ? "onClose" extends keyof ActionBarRootProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasA11ySurfaceProps = ExpectTrue<
    "aria-label" extends keyof ActionBarContentProps
        ? "role" extends keyof ActionBarContentProps
            ? true
            : false
        : false
>;

type _HasCloseName = ExpectTrue<"aria-label" extends keyof ActionBarCloseTriggerProps ? true : false>;

type _HasRecipeProps = ExpectTrue<"size" extends keyof ActionBarRootProps ? true : false>;

const _open: _HasOpenProps = true;
const _a11y: _HasA11ySurfaceProps = true;
const _close: _HasCloseName = true;
const _recipe: _HasRecipeProps = true;

void (_open && _a11y && _close && _recipe);

assertType<ActionBarRootProps>({
    isOpen: true,
    defaultIsOpen: false,
    onOpen: () => {},
    onClose: () => {},
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
