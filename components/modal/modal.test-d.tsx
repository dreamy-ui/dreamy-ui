import type { DialogOpenChangeDetails, DialogOpenChangeReason } from "@ui-sdk/react/dialog";
import { assertType } from "vitest";
import type {
    ModalBodyProps,
    ModalCloseButtonProps,
    ModalContentProps,
    ModalFooterProps,
    ModalHeaderProps,
    ModalOverlayProps,
    ModalProps
} from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<boolean | undefined>({} as ModalProps["open"]);
assertType<boolean | undefined>({} as ModalProps["defaultOpen"]);
assertType<
    ((open: boolean, details: DialogOpenChangeDetails<DialogOpenChangeReason>) => void) | undefined
>({} as ModalProps["onOpenChange"]);
assertType<boolean | undefined>({} as ModalProps["dismissible"]);
assertType<boolean | "trap-focus" | undefined>({} as ModalProps["modal"]);
assertType<boolean | undefined>({} as ModalProps["closeOnOutsidePress"]);
assertType<"inside" | "outside" | undefined>({} as ModalProps["scrollBehavior"]);
assertType<((open: boolean) => void) | undefined>({} as ModalProps["onOpenChangeComplete"]);

type _HasUiSdkProps = ExpectTrue<
    "dismissible" extends KnownKeys<ModalProps>
        ? "modal" extends KnownKeys<ModalProps>
            ? "onOpenChange" extends KnownKeys<ModalProps>
                ? "onOpenChangeComplete" extends KnownKeys<ModalProps>
                    ? true
                    : false
                : false
            : false
        : false
>;

type _NoLegacyProps = ExpectTrue<
    "closeOnEscape" extends KnownKeys<ModalProps>
        ? false
        : "closeOnInteractOutside" extends KnownKeys<ModalProps>
          ? false
          : "trapFocus" extends KnownKeys<ModalProps>
            ? false
            : "initialFocusRef" extends KnownKeys<ModalProps>
              ? false
              : "finalFocusRef" extends KnownKeys<ModalProps>
                ? false
                : "portalProps" extends KnownKeys<ModalProps>
                  ? false
                  : true
>;

type _HasPartProps = ExpectTrue<
    ModalOverlayProps extends object
        ? ModalContentProps extends object
            ? ModalHeaderProps extends object
                ? ModalBodyProps extends object
                    ? ModalFooterProps extends object
                        ? ModalCloseButtonProps extends object
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _uiSdkProps: _HasUiSdkProps = true;
const _noLegacyProps: _NoLegacyProps = true;
const _partProps: _HasPartProps = true;

void (_uiSdkProps && _noLegacyProps && _partProps);

assertType<ModalProps>({
    open: true,
    onOpenChange: () => {},
    dismissible: true,
    modal: true,
    closeOnOutsidePress: true,
    scrollBehavior: "inside",
    onOpenChangeComplete: () => {},
    size: "md",
    placement: "center",
    children: null
});

assertType<ModalProps>({
    open: false,
    children: null,
    // @ts-expect-error scrollBehavior must be inside or outside
    scrollBehavior: "center"
});
