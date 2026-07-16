import type { IToast } from "@dreamy-ui/react";
import type { ReactNode } from "react";
import { assertType } from "vitest";
import type { ToastProviderProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<ReactNode>({} as ToastProviderProps["children"]);
assertType<Partial<IToast> | undefined>({} as ToastProviderProps["defaultToastProps"]);

type _HasProviderProps = ExpectTrue<
    "children" extends keyof ToastProviderProps
        ? "defaultToastProps" extends keyof ToastProviderProps
            ? true
            : false
        : false
>;

const _providerProps: _HasProviderProps = true;
void _providerProps;

assertType<ToastProviderProps>({
    children: null,
    defaultToastProps: {
        status: "info",
        position: "bottom-right",
        duration: 5000,
        isClosable: true
    }
});

assertType<ToastProviderProps>({
    children: null,
    defaultToastProps: {
        // @ts-expect-error invalid default status
        status: "critical"
    }
});

assertType<ToastProviderProps>({
    children: null,
    defaultToastProps: {
        // @ts-expect-error invalid default position
        position: "center"
    }
});
