import type { IToast } from "@dreamy-ui/react";
import { assertType } from "vitest";
import type { Toast } from "./index";

type ExpectTrue<T extends true> = T;

type ToastComponentProps = Parameters<typeof Toast>[0];

assertType<IToast>({} as ToastComponentProps["toast"]);
assertType<string>({} as IToast["id"]);
assertType<string | undefined>({} as IToast["title"]);
assertType<string | undefined>({} as IToast["description"]);
assertType<"success" | "error" | "info" | "warning" | "loading">({} as IToast["status"]);
assertType<number | undefined>({} as IToast["duration"]);
assertType<
    "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right"
>({} as IToast["position"]);
assertType<boolean | undefined>({} as IToast["isClosable"]);

type _HasToastShape = ExpectTrue<
    "toast" extends keyof ToastComponentProps
        ? "id" extends keyof IToast
            ? "status" extends keyof IToast
                ? "position" extends keyof IToast
                    ? true
                    : false
                : false
            : false
        : false
>;

const _toastShape: _HasToastShape = true;
void _toastShape;

assertType<ToastComponentProps>({
    toast: {
        id: "toast-1",
        title: "Saved",
        description: "Done",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true
    }
});

assertType<ToastComponentProps>({
    toast: {
        id: "toast-2",
        status: "info",
        position: "top",
        render: (toast) => toast.title
    }
});

assertType<ToastComponentProps>({
    toast: {
        id: "bad-status",
        position: "top",
        // @ts-expect-error invalid toast status
        status: "critical"
    }
});

assertType<ToastComponentProps>({
    toast: {
        id: "bad-position",
        status: "info",
        // @ts-expect-error invalid position
        position: "middle"
    }
});
