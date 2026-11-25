import type { FileInputValueChangeDetails } from "@ui-sdk/react/file-input";
import { assertType } from "vitest";
import type { FileUploadRootProps, FileUploadTriggerProps } from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<FileUploadRootProps["accept"]>({} as FileUploadRootProps["accept"]);
assertType<number | undefined>({} as FileUploadRootProps["maxFiles"]);
assertType<number | undefined>({} as FileUploadRootProps["maxSize"]);
assertType<number | undefined>({} as FileUploadRootProps["minSize"]);
assertType<boolean | undefined>({} as FileUploadRootProps["multiple"]);
assertType<boolean | undefined>({} as FileUploadRootProps["disabled"]);
assertType<boolean | undefined>({} as FileUploadRootProps["required"]);
assertType<boolean | undefined>({} as FileUploadRootProps["invalid"]);
assertType<string | undefined>({} as FileUploadRootProps["name"]);
assertType<((value: File[], details: FileInputValueChangeDetails) => void) | undefined>(
    {} as FileUploadRootProps["onValueChange"]
);

type _HasControlProps = ExpectTrue<
    "accept" extends KnownKeys<FileUploadRootProps>
        ? "disabled" extends KnownKeys<FileUploadRootProps>
            ? "required" extends KnownKeys<FileUploadRootProps>
                ? "invalid" extends KnownKeys<FileUploadRootProps>
                    ? "onValueChange" extends KnownKeys<FileUploadRootProps>
                        ? "onReject" extends KnownKeys<FileUploadRootProps>
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _NoLegacyProps = ExpectTrue<
    "onFileChange" extends KnownKeys<FileUploadRootProps>
        ? false
        : "onFileReject" extends KnownKeys<FileUploadRootProps>
          ? false
          : "maxFileSize" extends KnownKeys<FileUploadRootProps>
            ? false
            : "asChild" extends KnownKeys<FileUploadTriggerProps>
              ? false
              : true
>;

const _controlProps: _HasControlProps = true;
const _noLegacyProps: _NoLegacyProps = true;

void (_controlProps && _noLegacyProps);

assertType<FileUploadRootProps>({
    accept: ".pdf",
    maxFiles: 3,
    maxSize: 5_000_000,
    multiple: true,
    disabled: false,
    required: true,
    invalid: false,
    name: "resume",
    onValueChange: () => {},
    onReject: () => {},
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
