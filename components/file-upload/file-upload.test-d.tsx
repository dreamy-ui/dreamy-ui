import type { FileChangeDetails } from "@dreamy-ui/react";
import type { ComponentProps } from "react";
import { assertType } from "vitest";
import * as FileUpload from "./index";

type ExpectTrue<T extends true> = T;
type FileUploadRootProps = ComponentProps<typeof FileUpload.Root>;

assertType<FileUploadRootProps["accept"]>({} as FileUploadRootProps["accept"]);
assertType<number | undefined>({} as FileUploadRootProps["maxFiles"]);
assertType<boolean | undefined>({} as FileUploadRootProps["disabled"]);
assertType<boolean | undefined>({} as FileUploadRootProps["required"]);
assertType<boolean | undefined>({} as FileUploadRootProps["invalid"]);
assertType<string | undefined>({} as FileUploadRootProps["name"]);
assertType<((details: FileChangeDetails) => void) | undefined>(
    {} as FileUploadRootProps["onFileChange"]
);

type _HasControlProps = ExpectTrue<
    "accept" extends keyof FileUploadRootProps
        ? "disabled" extends keyof FileUploadRootProps
            ? "required" extends keyof FileUploadRootProps
                ? "invalid" extends keyof FileUploadRootProps
                    ? "name" extends keyof FileUploadRootProps
                        ? true
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof FileUploadRootProps
        ? "color" extends keyof FileUploadRootProps
            ? "p" extends keyof FileUploadRootProps
                ? "m" extends keyof FileUploadRootProps
                    ? "w" extends keyof FileUploadRootProps
                        ? "h" extends keyof FileUploadRootProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _controlProps: _HasControlProps = true;
const _styleProps: _HasStyleProps = true;

void (_controlProps && _styleProps);

assertType<FileUploadRootProps>({
    accept: ".pdf",
    maxFiles: 1,
    disabled: false,
    required: true,
    invalid: false,
    name: "resume",
    onFileChange: () => {},
    className: "custom-upload",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<FileUploadRootProps>({
    // @ts-expect-error disabled must be boolean
    disabled: "yes"
});

assertType<FileUploadRootProps>({
    // @ts-expect-error maxFiles must be a number
    maxFiles: "many"
});
