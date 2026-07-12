import { Avatar, AvatarGroup, Flex, HStack, Text } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Avatar"
} satisfies Meta;

export function Base() {
    return (
        <Avatar
            name="Girlfriend"
            src="/olcia.webp"
        />
    );
}

export function Sizes() {
    return (
        <HStack>
            <Avatar
                name="Girlfriend"
                size="sm"
                src="/olcia.webp"
            />
            <Avatar
                name="Girlfriend"
                size="md"
                src="/olcia.webp"
            />
            <Avatar
                name="Girlfriend"
                size="lg"
                src="/olcia.webp"
            />
        </HStack>
    );
}

export function AvatarGroup_() {
    return (
        <AvatarGroup maxAvatars={4}>
            <Avatar name="Dream" />
            <Avatar name="Dream" />
            <Avatar name="Dream" />
            <Avatar name="Dream" />
            <Avatar name="Dream" />
            <Avatar name="Dream" />
            <Avatar name="Dream" />
            <Avatar name="Dream" />
        </AvatarGroup>
    );
}

export function Persona() {
    return (
        <HStack>
            <Avatar
                name="Alexandra"
                size="md"
                src="/olcia.webp"
            />
            <Flex col>
                <Text
                    fontWeight="medium"
                    size="sm"
                >
                    Alexandra
                </Text>
                <Text
                    color="fg.medium"
                    size="sm"
                >
                    Dream
                </Text>
            </Flex>
        </HStack>
    );
}
