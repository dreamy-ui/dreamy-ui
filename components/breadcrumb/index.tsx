"use client";

import { ariaAttr } from "@dreamy-ui/react";

import { createStyleContext, dreamy, type HTMLDreamyProps } from "styled-system/jsx";
import { type BreadcrumbVariantProps, breadcrumb } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(breadcrumb);

export interface BreadcrumbRootProps extends HTMLDreamyProps<"nav">, BreadcrumbVariantProps {}

/**
 * Breadcrumb component — navigational trail of page hierarchy.
 *
 * @see Docs https://dreamy-ui.com/docs/components/breadcrumb
 *
 * @example
 * ```tsx
 * <Breadcrumb.Root>
 *   <Breadcrumb.List>
 *     <Breadcrumb.Item>
 *       <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
 *     </Breadcrumb.Item>
 *     <Breadcrumb.Separator />
 *     <Breadcrumb.Item>
 *       <Breadcrumb.CurrentLink>Page</Breadcrumb.CurrentLink>
 *     </Breadcrumb.Item>
 *   </Breadcrumb.List>
 * </Breadcrumb.Root>
 * ```
 */
export const Root = withProvider(dreamy.nav, "root");

export interface BreadcrumbListProps extends HTMLDreamyProps<"ol"> {}

/**
 * Breadcrumb List — ordered list of breadcrumb items.
 */
export const List = withContext(dreamy.ol, "list");

export interface BreadcrumbItemProps extends HTMLDreamyProps<"li"> {}

/**
 * Breadcrumb Item — single crumb in the trail.
 */
export const Item = withContext(dreamy.li, "item");

export interface BreadcrumbLinkProps extends HTMLDreamyProps<"a"> {}

/**
 * Breadcrumb Link — navigable link for a crumb.
 */
export const Link = withContext(dreamy.a, "link");

export interface BreadcrumbCurrentLinkProps extends HTMLDreamyProps<"span"> {}

/**
 * Breadcrumb Current Link — the current page crumb.
 */
export const CurrentLink = withContext(dreamy.span, "currentLink", {
    defaultProps: {
        "aria-current": "page"
    }
});

export interface BreadcrumbSeparatorProps extends HTMLDreamyProps<"li"> {}

/**
 * Breadcrumb Separator — visual divider between crumbs.
 */
export const Separator = withContext(function Component(props: BreadcrumbSeparatorProps) {
    return (
        <dreamy.li
            {...props}
            role="presentation"
            aria-hidden={ariaAttr(true)}
        >
            {props.children ?? "/"}
        </dreamy.li>
    );
}, "separator");

export interface BreadcrumbEllipsisProps extends HTMLDreamyProps<"li"> {}

/**
 * Breadcrumb Ellipsis — indicates collapsed intermediate crumbs.
 */
export const Ellipsis = withContext(function Component(props: BreadcrumbEllipsisProps) {
    return (
        <dreamy.li
            {...props}
            role="presentation"
            aria-hidden={ariaAttr(true)}
        >
            {props.children ?? "..."}
        </dreamy.li>
    );
}, "ellipsis");
