import { assertType } from "vitest";
import type {
    MenuButtonProps,
    MenuContentProps,
    MenuProps,
    MenuTriggerItemProps,
    MenuTriggerProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean | undefined>({} as MenuProps["isOpen"]);
assertType<boolean | undefined>({} as MenuProps["defaultIsOpen"]);
assertType<(() => void) | undefined>({} as MenuProps["onOpen"]);
assertType<(() => void) | undefined>({} as MenuProps["onClose"]);
assertType<boolean | undefined>({} as MenuProps["closeOnClick"]);
assertType<boolean | undefined>({} as MenuProps["reduceMotion"]);
assertType<MenuProps["positioning"]>({} as MenuProps["positioning"]);
assertType<MenuProps["popoverProps"]>({} as MenuProps["popoverProps"]);

assertType<boolean | undefined>({} as MenuButtonProps["disabled"]);
assertType<string | undefined>({} as MenuButtonProps["command"]);
assertType<MenuTriggerItemProps["positioning"]>({} as MenuTriggerItemProps["positioning"]);
assertType<MenuTriggerItemProps["label"]>({} as MenuTriggerItemProps["label"]);

type _HasOpenProps = ExpectTrue<
    "isOpen" extends keyof MenuProps
        ? "onClose" extends keyof MenuProps
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
    isOpen: true,
    defaultIsOpen: false,
    onOpen: () => {},
    onClose: () => {},
    closeOnClick: true,
    reduceMotion: true,
    positioning: { placement: "bottom" },
    popoverProps: { usePortal: false, closeOnEsc: true }
});

assertType<MenuButtonProps>({
    children: "Item",
    command: "{actionKey} k",
    disabled: false,
    onClick: () => {}
});

assertType<MenuTriggerItemProps>({
    label: "More",
    positioning: { placement: "right-start" },
    children: null
});

assertType<MenuProps>({
    // @ts-expect-error placement must use PositioningProps object
    positioning: "bottom"
});
