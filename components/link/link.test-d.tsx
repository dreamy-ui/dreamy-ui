import { assertType } from "vitest";
import type { LinkProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean | undefined>({} as LinkProps["isExternal"]);
assertType<string | undefined>({} as LinkProps["href"]);

const _size: LinkProps["size"] = "md";

type _HasLinkProps = ExpectTrue<
    "isExternal" extends keyof LinkProps ? ("href" extends keyof LinkProps ? true : false) : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof LinkProps
        ? "color" extends keyof LinkProps
            ? "p" extends keyof LinkProps
                ? "m" extends keyof LinkProps
                    ? "w" extends keyof LinkProps
                        ? "h" extends keyof LinkProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _linkProps: _HasLinkProps = true;
const _styleProps: _HasStyleProps = true;

void (_linkProps && _styleProps && _size);

assertType<LinkProps>({
    href: "/docs",
    isExternal: true,
    size: "lg",
    children: "Docs",
    "aria-label": "Documentation",
    rel: "noopener noreferrer",
    className: "custom-link",
    bg: "transparent",
    color: "fg",
    p: 1,
    m: 0,
    w: "fit-content",
    h: "auto"
});

assertType<LinkProps>({
    // @ts-expect-error invalid size
    size: "huge"
});

assertType<LinkProps>({
    // @ts-expect-error isExternal must be boolean
    isExternal: "true"
});
