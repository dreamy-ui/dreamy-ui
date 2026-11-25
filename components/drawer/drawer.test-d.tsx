import type { DialogOpenChangeDetails } from "@ui-sdk/react/dialog";
import type { DrawerOpenChangeReason, SnapPoint } from "@ui-sdk/react/drawer";
import { assertType } from "vitest";
import type {
    DrawerBodyProps,
    DrawerCloseButtonProps,
    DrawerContentProps,
    DrawerFooterProps,
    DrawerHeaderProps,
    DrawerOverlayProps,
    DrawerProps
} from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<boolean | undefined>({} as DrawerProps["open"]);
assertType<boolean | undefined>({} as DrawerProps["defaultOpen"]);
assertType<
    ((open: boolean, details: DialogOpenChangeDetails<DrawerOpenChangeReason>) => void) | undefined
>({} as DrawerProps["onOpenChange"]);
assertType<boolean | undefined>({} as DrawerProps["dismissible"]);
assertType<boolean | "trap-focus" | undefined>({} as DrawerProps["modal"]);
assertType<SnapPoint[] | undefined>({} as DrawerProps["snapPoints"]);
assertType<"inside" | "outside" | undefined>({} as DrawerProps["scrollBehavior"]);
assertType<((open: boolean) => void) | undefined>({} as DrawerProps["onOpenChangeComplete"]);

type _HasUiSdkProps = ExpectTrue<
    "dismissible" extends KnownKeys<DrawerProps>
        ? "snapPoints" extends KnownKeys<DrawerProps>
            ? "side" extends KnownKeys<DrawerProps>
                ? "onOpenChange" extends KnownKeys<DrawerProps>
                    ? true
                    : false
                : false
            : false
        : false
>;

type _NoLegacyProps = ExpectTrue<
    "closeOnEscape" extends KnownKeys<DrawerProps>
        ? false
        : "closeOnInteractOutside" extends KnownKeys<DrawerProps>
          ? false
          : "trapFocus" extends KnownKeys<DrawerProps>
            ? false
            : "initialFocusRef" extends KnownKeys<DrawerProps>
              ? false
              : "finalFocusRef" extends KnownKeys<DrawerProps>
                ? false
                : "portalProps" extends KnownKeys<DrawerProps>
                  ? false
                  : true
>;

type _HasPartProps = ExpectTrue<
    DrawerOverlayProps extends object
        ? DrawerContentProps extends object
            ? DrawerHeaderProps extends object
                ? DrawerBodyProps extends object
                    ? DrawerFooterProps extends object
                        ? DrawerCloseButtonProps extends object
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

assertType<DrawerProps>({
    open: true,
    onOpenChange: () => {},
    dismissible: true,
    modal: true,
    placement: "right",
    snapPoints: [0.25, 0.5, 1],
    scrollBehavior: "inside",
    onOpenChangeComplete: () => {},
    children: null
});

assertType<DrawerProps>({
    open: false,
    children: null,
    // @ts-expect-error scrollBehavior must be inside or outside
    scrollBehavior: "center"
});
