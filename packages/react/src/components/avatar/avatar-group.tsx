import type { AvatarProps } from "@/components/avatar/avatar";
import { Box } from "@/components/box";
import { Flex } from "@/components/flex";
import { getValidChildren } from "@/utils/children";
import { compact } from "@/utils/compact";
import type { HTMLDreamProps } from "@/utils/types";
import type { SystemProperties } from "@dreamy-ui/system/types";
import { cloneElement, forwardRef } from "react";

interface AvatarGroupOptions {
    /**
     * The children of the avatar group.
     *
     * Ideally should be `Avatar` and `MoreIndicator` components
     */
    children: React.ReactNode;
    /**
     * The space between the avatars in the group.
     * @default "-0.75rem"
     */
    spacing?: SystemProperties["margin"];
    /**
     * The maximum number of visible avatars
     */
    maxAvatars?: number;
}

export interface AvatarGroupProps
    extends AvatarGroupOptions,
        Omit<HTMLDreamProps<"div">, "children"> {}

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
                marginEnd: isFirstAvatar ? 0 : spacing,
                showBorder: true
            } satisfies AvatarProps;

            return cloneElement(child, compact(childProps));
        });

        return (
            <Flex ref={ref} role="group" data-part="group" {...rest}>
                {excess > 0 && <Box marginStart={spacing} data-part="excess">{`+${excess}`}</Box>}
                {clones}
            </Flex>
        );
    }
);

AvatarGroup.displayName = "AvatarGroup";
