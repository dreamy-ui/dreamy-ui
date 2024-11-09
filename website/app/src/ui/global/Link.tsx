import { Link as DreamLink, type LinkProps as DreamLinkProps } from "@dreamy-ui/react/rsc";
import { Link as RemixLink, type LinkProps as RemixLinkProps } from "@remix-run/react";
import { forwardRef } from "react";

export interface LinkProps extends DreamLinkProps, Omit<RemixLinkProps, keyof DreamLinkProps> {}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
    return (
        <DreamLink
            ref={ref}
            as={RemixLink}
            {...props}
        />
    );
});

Link.displayName = "Link";
