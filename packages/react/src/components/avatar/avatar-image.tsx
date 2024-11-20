import { AvatarName } from "@/components/avatar/avatar-name";
import { GenericAvatarIcon } from "@/components/avatar/generic-avatar-icon";
import { Image, type ImageProps } from "@/components/image";
import { useImage } from "@/components/image/use-image";
import type { SystemStyleObject } from "@dreamy-ui/system/types";
import { cloneElement, useMemo } from "react";

interface AvatarImageProps extends ImageProps {
    getInitials?: (name: string) => string;
    borderRadius?: SystemStyleObject["borderRadius"];
    icon: React.ReactElement;
    iconLabel?: string;
    name?: string;
}

export function AvatarImage(props: AvatarImageProps) {
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
    const status = useImage({ src, onError, crossOrigin, onLoad });

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

    /**
     * If `src` was passed and the image has loaded, we'll show it.
     * Using the RSC version of the image component, since other
     * features Image component provides won't be used.
     */
    return (
        <Image
            src={src}
            srcSet={srcSet}
            alt={name}
            onLoad={onLoad}
            referrerPolicy={referrerPolicy}
            crossOrigin={crossOrigin ?? undefined}
            loading={loading}
            data-part="image"
        />
    );
}
