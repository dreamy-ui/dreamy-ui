import { Avatar, AvatarGroup, HStack } from "@/components";
import { token } from "@dreamy-ui/system/tokens";
import type { Meta } from "@storybook/react";

export default {
    title: "Avatar"
} satisfies Meta;

export function Base() {
    return (
        <Avatar
            src="https://avatars.githubusercontent.com/u/83508485?v=4"
            name="me"
        />
    );
}

export function NameOnly() {
    return <Avatar name="me" />;
}

export function SrcOnly() {
    return <Avatar src="https://avatars.githubusercontent.com/u/83508485?v=4" />;
}

export function Sizes() {
    return (
        <HStack>
            <Avatar
                name="me"
                src="https://avatars.githubusercontent.com/u/83508485?v=4"
                size="sm"
            />
            <Avatar
                name="me"
                src="https://avatars.githubusercontent.com/u/83508485?v=4"
                size="md"
            />
            <Avatar
                name="me"
                src="https://avatars.githubusercontent.com/u/83508485?v=4"
                size="lg"
            />
        </HStack>
    );
}

export function WithNothing() {
    return <Avatar />;
}

export function AvatarGroup_() {
    return (
        <AvatarGroup spacing={"-0.75rem"}>
            <Avatar
                name="me"
                src="https://avatars.githubusercontent.com/u/83508485?v=4"
            />
            <Avatar
                name="me"
                src="https://avatars.githubusercontent.com/u/83508485?v=4"
            />
            <Avatar
                name="me"
                src="https://avatars.githubusercontent.com/u/83508485?v=4"
            />
        </AvatarGroup>
    );
}

export function AvatarGroupWithCustomSpacing() {
    return (
        <AvatarGroup spacing={token("spacing.-4")}>
            <Avatar
                name="me"
                src="https://avatars.githubusercontent.com/u/83508485?v=4"
            />
            <Avatar
                name="me"
                src="https://avatars.githubusercontent.com/u/83508485?v=4"
            />
            <Avatar
                name="me"
                src="https://avatars.githubusercontent.com/u/83508485?v=4"
            />
        </AvatarGroup>
    );
}

export function AvatarGroupWithMaxAvatars() {
    return (
        <AvatarGroup maxAvatars={2}>
            <Avatar
                name="me"
                src="https://avatars.githubusercontent.com/u/83508485?v=4"
            />
            <Avatar
                name="me"
                src="https://avatars.githubusercontent.com/u/83508485?v=4"
            />
            <Avatar
                name="me"
                src="https://avatars.githubusercontent.com/u/83508485?v=4"
            />
            <Avatar
                name="me"
                src="https://avatars.githubusercontent.com/u/83508485?v=4"
            />
        </AvatarGroup>
    );
}
