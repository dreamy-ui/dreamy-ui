import { Link as DreamLink, type LinkProps as DreamLinkProps } from "@/link";
import { forwardRef } from "react";
import { Link as RemixLink, type LinkProps as RemixLinkProps } from "react-router";

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
