"use client";

import { Avatar as ArkAvatar } from "@ark-ui/react/avatar";
import {
    callAllHandlers,
    compact,
    dataAttr,
    getValidChildren,
    initials
} from "@dreamy-ui/react";
import { cloneElement, useEffect, useState } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type AvatarVariantProps, avatar } from "styled-system/recipes";
import type { SystemProperties, SystemStyleObject } from "styled-system/types";
import { Box } from "./box";
import { Flex, type FlexProps } from "./flex";
import { Icon } from "./icon";
import { Image, type ImageProps } from "./image";

export interface AvatarOptions {
    name?: string;
    children?: React.ReactNode;
    src?: string;
    srcSet?: string;
    loading?: "eager" | "lazy";
    borderColor?: SystemProperties["borderColor"];
    onError?: () => void;
    icon?: React.ReactElement;
    getInitials?: (name: string) => string;
    referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

const GenericAvatarIcon = (props: HTMLDreamyProps<"svg">) => {
    return (
        <Icon
            aria-label="Avatar"
            data-part="fallback-icon"
            role="img"
            viewBox="0 0 128 128"
            {...props}
        >
            <path
                d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z"
                fill="currentColor"
            />
            <path
                d="M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24"
                fill="currentColor"
            />
        </Icon>
    );
};

export interface AvatarProps
    extends Omit<HTMLDreamyProps<"span">, "onError" | keyof AvatarOptions | keyof AvatarVariantProps>,
        AvatarOptions,
        AvatarVariantProps {
    crossOrigin?: HTMLDreamyProps<"img">["crossOrigin"];
    iconLabel?: string;
}

const StyledBase = dreamy(ArkAvatar.Root, avatar);

export function Avatar({
    src,
    srcSet,
    name,
    onError,
    onLoad: onLoadProp,
    getInitials = initials,
    icon = <GenericAvatarIcon />,
    iconLabel = " avatar",
    loading,
    children,
    crossOrigin,
    referrerPolicy,
    ...rest
}: AvatarProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
    }, [src]);

    return (
        <StyledBase
            {...rest}
            data-loaded={dataAttr(isLoaded)}
            data-part="root"
            onStatusChange={(details) => {
                setIsLoaded(details.status === "loaded");
                if (details.status === "error") {
                    onError?.();
                }
            }}
        >
            <ArkAvatar.Fallback
                aria-label={name}
                data-part="name"
                name={name}
                role={name ? "img" : undefined}
            >
                {name ? getInitials(name) : cloneElement(icon, { role: "img", "aria-label": iconLabel })}
            </ArkAvatar.Fallback>
            {src ? (
                <ArkAvatar.Image
                    alt={name}
                    crossOrigin={crossOrigin}
                    data-part="image"
                    loading={loading}
                    onLoad={callAllHandlers(onLoadProp, () => setIsLoaded(true))}
                    referrerPolicy={referrerPolicy}
                    src={src}
                    srcSet={srcSet}
                />
            ) : null}
            {children}
        </StyledBase>
    );
}

interface AvatarGroupOptions {
    children: React.ReactNode;
    spacing?: string | number;
    maxAvatars?: number;
}

export interface AvatarGroupProps extends AvatarGroupOptions, Omit<FlexProps, "children"> {}

export function AvatarGroup(props: AvatarGroupProps) {
    const { children, maxAvatars, spacing = "-0.75rem", ...rest } = props;
    const validChildren = getValidChildren(children);
    const childrenWithinMax =
        maxAvatars != null ? validChildren.slice(0, maxAvatars) : validChildren;
    const excess = maxAvatars != null ? validChildren.length - maxAvatars : 0;
    const reversedChildren = childrenWithinMax.reverse();

    const clones = reversedChildren.map((child, index) => {
        const isFirstAvatar = index === 0;
        return cloneElement(child, compact({
            style: { marginInlineEnd: isFirstAvatar ? 0 : spacing },
            showBorder: true
        }) satisfies AvatarProps);
    });

    return (
        <Flex
            data-part="group"
            role="group"
            {...rest}
        >
            {excess > 0 && (
                <Box
                    data-part="excess"
                    style={{ marginInlineStart: spacing }}
                >{`+${excess}`}</Box>
            )}
            {clones}
        </Flex>
    );
}
