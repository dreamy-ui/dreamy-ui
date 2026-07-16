import { assertType } from "vitest";
import type {
    BreadcrumbCurrentLinkProps,
    BreadcrumbEllipsisProps,
    BreadcrumbItemProps,
    BreadcrumbLinkProps,
    BreadcrumbListProps,
    BreadcrumbRootProps,
    BreadcrumbSeparatorProps
} from "./index";

type ExpectTrue<T extends true> = T;

const _size: BreadcrumbRootProps["size"] = "md";
const _variant: BreadcrumbRootProps["variant"] = "underline";

assertType<string | undefined>({} as BreadcrumbRootProps["aria-label"]);
assertType<string | undefined>({} as BreadcrumbLinkProps["href"]);
assertType<BreadcrumbCurrentLinkProps["aria-current"]>("page");
assertType<BreadcrumbCurrentLinkProps["aria-current"]>(undefined);
type _HasRecipeProps = ExpectTrue<
    "size" extends keyof BreadcrumbRootProps
        ? "variant" extends keyof BreadcrumbRootProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof BreadcrumbRootProps
        ? "color" extends keyof BreadcrumbRootProps
            ? "p" extends keyof BreadcrumbRootProps
                ? "m" extends keyof BreadcrumbRootProps
                    ? "w" extends keyof BreadcrumbRootProps
                        ? "h" extends keyof BreadcrumbRootProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    BreadcrumbListProps extends object
        ? BreadcrumbItemProps extends object
            ? BreadcrumbLinkProps extends object
                ? BreadcrumbSeparatorProps extends object
                    ? BreadcrumbEllipsisProps extends object
                        ? true
                        : false
                    : false
                : false
            : false
        : false
>;

const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _partProps: _HasPartProps = true;

void (_recipeProps && _styleProps && _partProps && _size && _variant);

assertType<BreadcrumbRootProps>({
    "aria-label": "Breadcrumb",
    size: "md",
    variant: "underline",
    className: "custom-breadcrumb",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<BreadcrumbRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<BreadcrumbRootProps>({
    // @ts-expect-error invalid variant
    variant: "solid"
});
