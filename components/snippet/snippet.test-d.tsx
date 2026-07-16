import type { ComponentProps } from "react";
import { assertType } from "vitest";
import type { SnippetBodyProps, SnippetHeaderProps, SnippetRootProps } from "./index";
import * as Snippet from "./index";

type ExpectTrue<T extends true> = T;
type RootProps = ComponentProps<typeof Snippet.Root>;

assertType<number | undefined>({} as SnippetRootProps["timeout"]);
assertType<boolean | undefined>({} as SnippetRootProps["disableCopy"]);
assertType<((value: string) => void) | undefined>({} as SnippetRootProps["onCopy"]);
assertType<boolean | undefined>({} as SnippetHeaderProps["hideCopyButton"]);
assertType<string | undefined>({} as SnippetBodyProps["codeString"]);

const _size: SnippetRootProps["size"] = "md";

type _HasRecipeProps = ExpectTrue<"size" extends keyof SnippetRootProps ? true : false>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof RootProps
        ? "color" extends keyof RootProps
            ? "p" extends keyof RootProps
                ? "m" extends keyof RootProps
                    ? "w" extends keyof RootProps
                        ? "h" extends keyof RootProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_recipeProps && _styleProps && _size);

assertType<SnippetRootProps>({
    size: "lg",
    timeout: 2000,
    disableCopy: false,
    onCopy: (_value: string) => {},
    className: "custom-snippet",
    bg: "#1a1a1a",
    color: "fg",
    p: 0,
    m: 2,
    w: "full",
    h: "auto"
});

assertType<SnippetHeaderProps>({
    hideCopyButton: true,
    children: "Terminal"
});

assertType<SnippetBodyProps>({
    codeString: "pnpm dreamy add",
    children: "pnpm dreamy add"
});

assertType<SnippetRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<SnippetRootProps>({
    // @ts-expect-error onCopy receives the copied string
    onCopy: (_value: number) => {}
});
