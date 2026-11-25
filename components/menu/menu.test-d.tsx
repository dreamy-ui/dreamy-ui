import type { ChangeDetails } from "@ui-sdk/core";
import type { MenuOpenChangeReason } from "@ui-sdk/react/menu";
import { assertType } from "vitest";
import type {
    MenuButtonProps,
    MenuContentProps,
    MenuProps,
    MenuTriggerItemProps,
    MenuTriggerProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean | undefined>({} as MenuProps["open"]);
assertType<boolean | undefined>({} as MenuProps["defaultOpen"]);
assertType<((open: boolean, details: ChangeDetails<MenuOpenChangeReason>) => void) | undefined>(
    {} as MenuProps["onOpenChange"]
);
assertType<boolean | undefined>({} as MenuProps["closeOnSelect"]);
assertType<boolean | undefined>({} as MenuProps["reduceMotion"]);
assertType<MenuProps["positioning"]>({} as MenuProps["positioning"]);

assertType<boolean | undefined>({} as MenuButtonProps["disabled"]);
assertType<string | undefined>({} as MenuButtonProps["command"]);
assertType<string | undefined>({} as MenuButtonProps["value"]);
assertType<MenuTriggerItemProps["positioning"]>({} as MenuTriggerItemProps["positioning"]);
assertType<MenuTriggerItemProps["label"]>({} as MenuTriggerItemProps["label"]);

type _HasOpenProps = ExpectTrue<
    "open" extends keyof MenuProps
        ? "onOpenChange" extends keyof MenuProps
            ? "positioning" extends keyof MenuProps
                ? "onAction" extends keyof MenuProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

type _NoLegacyProps = ExpectTrue<
    "closeOnClick" extends KnownKeys<MenuProps>
        ? false
        : "popoverProps" extends KnownKeys<MenuProps>
          ? false
          : "isDisabled" extends KnownKeys<MenuButtonProps>
            ? false
            : true
>;

type _HasPartProps = ExpectTrue<
    MenuContentProps extends object
        ? MenuButtonProps extends object
            ? MenuTriggerProps extends object
                ? MenuTriggerItemProps extends object
                    ? true
                    : false
                : false
            : false
        : false
>;

const _openProps: _HasOpenProps = true;
const _noLegacyProps: _NoLegacyProps = true;
const _partProps: _HasPartProps = true;

void (_openProps && _noLegacyProps && _partProps);

assertType<MenuProps>({
    open: true,
    defaultOpen: false,
    onOpenChange: () => {},
    onAction: () => {},
    closeOnSelect: true,
    reduceMotion: true,
    positioning: { placement: "bottom" }
});

assertType<MenuButtonProps>({
    children: "Item",
    value: "item",
    command: "{actionKey} k",
    disabled: false,
    onSelect: () => {}
});
