"use client";

import {
    callAllHandlers,
    compact,
    dataAttr,
    getValidChildren,
    initials,
    useAvatarImage
} from "@dreamy-ui/react";
import { cloneElement, forwardRef, useMemo, useState } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type AvatarVariantProps, avatar } from "styled-system/recipes";
import type { SystemProperties, SystemStyleObject } from "styled-system/types";
import { Box } from "./box";
import { Flex, type FlexProps } from "./flex";
import { Icon } from "./icon";
import { Image, type ImageProps } from "./image";

export interface AvatarOptions {
    /**
     * The name of the person in the avatar.
     *
     * - if `src` has loaded, the name will be used as the `alt` attribute of the `img`
     * - If `src` is not loaded, the name will be used to create the initials
     */
    name?: string;
    /**
     * The badge in the bottom right corner of the avatar.
     */
    children?: React.ReactNode;
    /**
     * The image url of the `Avatar`
     */
    src?: string;
    /**
     * List of sources to use for different screen resolutions
     */
    srcSet?: string;
    /**
     * Defines loading strategy
     */
    loading?: "eager" | "lazy";
    /**
     * The border color of the avatar
     * @type SystemProps["borderColor"]
     */
    borderColor?: SystemProperties["borderColor"];
    /**
     * Function called when image failed to load
     */
    onError?: () => void;
    /**
     * The default avatar used as fallback when `name`, and `src`
     * is not specified.
     * @type React.ReactElement
     */
    icon?: React.ReactElement;
    /**
     * Function to get the initials to display
     */
    getInitials?: (name: string) => string;
    /**
     * Defining which referrer is sent when fetching the resource.
     * @type React.HTMLAttributeReferrerPolicy
     */
    referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

const GenericAvatarIcon = (props: HTMLDreamyProps<"svg">) => {
    return (
        <Icon
            aria-label="Avatar"
            color="currentColor"
            height="100%"
            role="img"
            viewBox="0 0 128 128"
            width="100%"
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

interface AvatarNameProps
    extends HTMLDreamyProps<"div">,
        Pick<AvatarOptions, "name" | "getInitials"> {}

function AvatarName(props: AvatarNameProps) {
    const { name, getInitials, ...rest } = props;

    return (
        <Box
            aria-label={name}
            data-part="name"
            role="img"
            {...rest}
        >
            {name ? getInitials?.(name) : null}
        </Box>
    );
}

interface AvatarImageProps extends ImageProps {
    getInitials?: (name: string) => string;
    borderRadius?: SystemStyleObject["borderRadius"];
    icon: React.ReactElement;
    iconLabel?: string;
    name?: string;
}

function AvatarImage(props: AvatarImageProps) {
    const {
        src,
        srcSet,
        onError,
        onLoad,
        getInitials,
        name,
        loading,
        iconLabel,
        icon = <GenericAvatarIcon />,
        referrerPolicy,
        crossOrigin
    } = props;

    /**
     * use the image hook to only show the image when it has loaded
     */
    const status = useAvatarImage({ src, onError, crossOrigin, onLoad });

    const hasLoaded = useMemo(() => status === "loaded", [status]);

    /**
     * Fallback avatar applies under 2 conditions:
     * - If `src` was passed and the image has not loaded or failed to load
     * - If `src` wasn't passed
     *
     * In this case, we'll show either the name avatar or default avatar
     */
    const showFallback = !src || !hasLoaded;

    if (showFallback) {
        return name ? (
            <AvatarName
                getInitials={getInitials}
                name={name}
            />
        ) : (
            cloneElement(icon, {
                role: "img",
                "aria-label": iconLabel
            })
        );
    }

    return (
        <Image
            alt={name}
            crossOrigin={crossOrigin ?? undefined}
            data-part="image"
            loading={loading}
            onLoad={onLoad}
            referrerPolicy={referrerPolicy}
            src={src}
            srcSet={srcSet}
        />
    );
}

// Main Avatar Component
export interface AvatarProps
    extends Omit<HTMLDreamyProps<"span">, "onError">,
        AvatarOptions,
        AvatarVariantProps {
    crossOrigin?: HTMLDreamyProps<"img">["crossOrigin"];
    iconLabel?: string;
}

const StyledBase = dreamy("span", avatar);

/**
 * Avatar component
 *
 * @See Docs https://dreamy-ui.com/docs/components/avatar
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
    {
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
    },
    ref
) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <StyledBase
            ref={ref}
            {...rest}
            data-loaded={dataAttr(isLoaded)}
            data-part="root"
        >
            <AvatarImage
                crossOrigin={crossOrigin}
                getInitials={getInitials}
                icon={icon}
                iconLabel={iconLabel}
                loading={loading}
                name={name}
                onError={onError}
                onLoad={callAllHandlers(onLoadProp, () => {
                    setIsLoaded(true);
                })}
                referrerPolicy={referrerPolicy}
                src={src}
                srcSet={srcSet}
            />
            {children}
        </StyledBase>
    );
});

interface AvatarGroupOptions {
    /**
     * The children of the avatar group.
     *
     * Ideally should be `Avatar` and `MoreIndicator` components
     */
    children: React.ReactNode;
    /**
     * The space between the avatars in the group. To use a token use `token()` function from `styled-system`.
     * @default "-0.75rem"
     */
    spacing?: string | number;
    /**
     * The maximum number of visible avatars
     */
    maxAvatars?: number;
}

export interface AvatarGroupProps extends AvatarGroupOptions, Omit<FlexProps, "children"> {}

/**
 * AvatarGroup displays a number of avatars grouped together in a stack.
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
    function AvatarGroup(props, ref) {
        const { children, maxAvatars, spacing = "-0.75rem", ...rest } = props;

        const validChildren = getValidChildren(children);

        /**
         * get the avatars within the max
         */
        const childrenWithinMax =
            maxAvatars != null ? validChildren.slice(0, maxAvatars) : validChildren;

        /**
         * get the remaining avatar count
         */
        const excess = maxAvatars != null ? validChildren.length - maxAvatars : 0;

        /**
         * Reversing the children is a great way to avoid using zIndex
         * to overlap the avatars
         */
        const reversedChildren = childrenWithinMax.reverse();

        const clones = reversedChildren.map((child, index) => {
            const isFirstAvatar = index === 0;

            const childProps = {
                style: { marginInlineEnd: isFirstAvatar ? 0 : spacing },
                showBorder: true
            } satisfies AvatarProps;

            return cloneElement(child, compact(childProps));
        });

        return (
            <Flex
                data-part="group"
                ref={ref}
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
);
