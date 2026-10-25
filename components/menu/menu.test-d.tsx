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
assertType<((details: { open: boolean }) => void) | undefined>({} as MenuProps["onOpenChange"]);
assertType<boolean | undefined>({} as MenuProps["closeOnClick"]);
assertType<boolean | undefined>({} as MenuProps["reduceMotion"]);
assertType<MenuProps["positioning"]>({} as MenuProps["positioning"]);
assertType<MenuProps["popoverProps"]>({} as MenuProps["popoverProps"]);

assertType<boolean | undefined>({} as MenuButtonProps["disabled"]);
assertType<string | undefined>({} as MenuButtonProps["command"]);
assertType<MenuTriggerItemProps["positioning"]>({} as MenuTriggerItemProps["positioning"]);
assertType<MenuTriggerItemProps["label"]>({} as MenuTriggerItemProps["label"]);

type _HasOpenProps = ExpectTrue<
    "open" extends keyof MenuProps
        ? "onOpenChange" extends keyof MenuProps
            ? "positioning" extends keyof MenuProps
                ? true
                : false
            : false
        : false
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
const _partProps: _HasPartProps = true;

void (_openProps && _partProps);

assertType<MenuProps>({
    open: true,
    defaultOpen: false,
    onOpenChange: () => {},
    closeOnClick: true,
    reduceMotion: true,
    positioning: { placement: "bottom" },
    popoverProps: { usePortal: false, closeOnEscape: true }
});

assertType<MenuButtonProps>({
    children: "Item",
    command: "{actionKey} k",
    disabled: false,
    onClick: () => {}
});
