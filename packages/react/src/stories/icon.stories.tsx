import { Flex, Icon } from "@/rsc";
import type { Meta } from "@storybook/react";
import { FaGithub } from "react-icons/fa";

export default {
    title: "Icon"
} satisfies Meta;

export function Base() {
    return <Icon as={FaGithub} />;
}

export function Size() {
    return (
        <Flex
            wrapped
            gap={2}
        >
            <Icon
                as={FaGithub}
                size={"xs"}
            />
            <Icon
                as={FaGithub}
                size={"sm"}
            />
            <Icon
                as={FaGithub}
                size={"md"}
            />
            <Icon
                as={FaGithub}
                size={"lg"}
            />
            <Icon
                as={FaGithub}
                size={"xl"}
            />
            <Icon
                as={FaGithub}
                size={"2xl"}
            />
        </Flex>
    );
}
