"use client";

import { forwardRef } from "react";
import { createStyleContext, dreamy, type HTMLDreamyProps } from "styled-system/jsx";
import { type BreadcrumbVariantProps, breadcrumb } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(breadcrumb);

export interface BreadcrumbRootProps extends HTMLDreamyProps<"nav">, BreadcrumbVariantProps {}
const BreadcrumbRoot = withProvider(dreamy.nav, "root");

export interface BreadcrumbListProps extends HTMLDreamyProps<"ol"> {}
const BreadcrumbList = withContext(dreamy.ol, "list");

export interface BreadcrumbItemProps extends HTMLDreamyProps<"li"> {}
const BreadcrumbItem = withContext(dreamy.li, "item");

export interface BreadcrumbLinkProps extends HTMLDreamyProps<"a"> {}
const BreadcrumbLink = withContext(dreamy.a, "link");

export interface BreadcrumbCurrentLinkProps extends HTMLDreamyProps<"span"> {}
const BreadcrumbCurrentLink = withContext(dreamy.span, "currentLink", {
    defaultProps: {
        "aria-current": "page"
    }
});

export interface BreadcrumbSeparatorProps extends HTMLDreamyProps<"li"> {}
const BreadcrumbSeparator = withContext(
    forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>((props, ref) => {
        return (
            <dreamy.li
                ref={ref}
                {...props}
                role="presentation"
                aria-hidden={String(true)}
            >
                {props.children ?? "/"}
            </dreamy.li>
        );
    }),
    "separator"
);

export interface BreadcrumbEllipsisProps extends HTMLDreamyProps<"li"> {}
const BreadcrumbEllipsis = withContext(
    forwardRef<HTMLLIElement, BreadcrumbEllipsisProps>((props, ref) => {
        return (
            <dreamy.li
                ref={ref}
                {...props}
                role="presentation"
                aria-hidden={String(true)}
            >
                {props.children ?? "..."}
            </dreamy.li>
        );
    }),
    "ellipsis"
);

export namespace Breadcrumb {
    export const Root = BreadcrumbRoot;
    export const List = BreadcrumbList;
    export const Item = BreadcrumbItem;
    export const Link = BreadcrumbLink;
    export const CurrentLink = BreadcrumbCurrentLink;
    export const Separator = BreadcrumbSeparator;
    export const Ellipsis = BreadcrumbEllipsis;
}
