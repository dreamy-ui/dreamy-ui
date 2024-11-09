import { AvatarImage } from "@/components/avatar/avatar-image";
import { initials } from "@/components/avatar/avatar-name";
import type { AvatarOptions } from "@/components/avatar/avatar-types";
import { GenericAvatarIcon } from "@/components/avatar/generic-avatar-icon";
import { dream } from "@/components/factory";
import { callAllHandlers } from "@/utils";
import { dataAttr } from "@/utils/attr";
import { randomColor } from "@/utils/color";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { type AvatarVariantProps, avatar } from "@dreamy-ui/system/recipes";
import { token } from "@dreamy-ui/system/tokens";
import { forwardRef, useMemo, useState } from "react";

export interface AvatarProps
    extends Omit<HTMLDreamProps<"span">, "onError">,
        AvatarOptions,
        AvatarVariantProps {
    crossOrigin?: HTMLDreamProps<"img">["crossOrigin"];
    iconLabel?: string;
}

const StyledBase = styled(dream.span, avatar);

/**
 * Avatar component
 *
 * @See Docs https://dream-ui.com/docs/components/avatar
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

    const bg = useMemo(() => (name ? randomColor(name) : token.var("colors.alpha.200")), [name]);

    return (
        <StyledBase
            ref={ref}
            {...rest}
            style={{
                backgroundColor: isLoaded ? "transparent" : bg,
                ...rest.style
            }}
            data-loaded={dataAttr(isLoaded)}
            data-part="root"
        >
            <AvatarImage
                src={src}
                srcSet={srcSet}
                loading={loading}
                onLoad={callAllHandlers(onLoadProp, () => {
                    setIsLoaded(true);
                })}
                onError={onError}
                getInitials={getInitials}
                name={name}
                icon={icon}
                iconLabel={iconLabel}
                crossOrigin={crossOrigin}
                referrerPolicy={referrerPolicy}
            />
            {children}
        </StyledBase>
    );
});
