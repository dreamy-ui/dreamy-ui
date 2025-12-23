"use client";

import { ariaAttr } from "@dreamy-ui/react";
import { forwardRef } from "react";
import { createStyleContext, dreamy, type HTMLDreamyProps } from "styled-system/jsx";
import { type BreadcrumbVariantProps, breadcrumb } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(breadcrumb);

export interface BreadcrumbRootProps extends HTMLDreamyProps<"nav">, BreadcrumbVariantProps {}
export const Root = withProvider(dreamy.nav, "root");

export interface BreadcrumbListProps extends HTMLDreamyProps<"ol"> {}
export const List = withContext(dreamy.ol, "list");

export interface BreadcrumbItemProps extends HTMLDreamyProps<"li"> {}
export const Item = withContext(dreamy.li, "item");

export interface BreadcrumbLinkProps extends HTMLDreamyProps<"a"> {}
export const Link = withContext(dreamy.a, "link");

export interface BreadcrumbCurrentLinkProps extends HTMLDreamyProps<"span"> {}
export const CurrentLink = withContext(dreamy.span, "currentLink", {
    defaultProps: {
        "aria-current": "page"
    }
});

export interface BreadcrumbSeparatorProps extends HTMLDreamyProps<"li"> {}
export const Separator = withContext(
    forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>((props, ref) => {
        return (
            <dreamy.li
                ref={ref}
                {...props}
                role="presentation"
                aria-hidden={ariaAttr(true)}
            >
                {props.children ?? "/"}
            </dreamy.li>
        );
    }),
    "separator"
);

export interface BreadcrumbEllipsisProps extends HTMLDreamyProps<"li"> {}
export const Ellipsis = withContext(
    forwardRef<HTMLLIElement, BreadcrumbEllipsisProps>((props, ref) => {
        return (
            <dreamy.li
                ref={ref}
                {...props}
                role="presentation"
                aria-hidden={ariaAttr(true)}
            >
                {props.children ?? "..."}
            </dreamy.li>
        );
    }),
    "ellipsis"
);


