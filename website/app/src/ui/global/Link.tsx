import { Link as DreamyLink, type LinkProps as DreamyLinkProps } from "@/link";
import { forwardRef } from "react";
import { Link as ReactRouterLink, type LinkProps as ReactRouterLinkProps } from "react-router";

export interface LinkProps
    extends DreamyLinkProps,
        Omit<ReactRouterLinkProps, keyof DreamyLinkProps> {}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
    return (
        <DreamyLink
            ref={ref}
            as={ReactRouterLink}
            {...props}
        />
    );
});

Link.displayName = "Link";

export { DreamyLink, ReactRouterLink };
