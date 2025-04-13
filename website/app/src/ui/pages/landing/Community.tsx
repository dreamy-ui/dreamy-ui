import { Box, Flex, HStack, Heading, Icon, Link, Text } from "@dreamy-ui/react/rsc";
import { BsGithub } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

const communities = [
    {
        title: "Discord",
        href: "/discord",
        description: "Get help or just enjoy our amazing Discord server!",
        icon: FaDiscord
    },
    {
        title: "GitHub",
        href: `https://github.com/${import.meta.env.VITE_SOURCE_REPO}`,
        description: "Report bugs, contribute to the project or just see code!",
        icon: BsGithub
    }
] satisfies CommunityProps[];

export default function Communities() {
    return (
        <Flex
            col
            gap={10}
        >
            <Flex
                col
                gap={2}
                itemsCenter
            >
                <Heading
                    size="4xl"
                    textCenter
                    w={"fit-content"}
                >
                    Our
                    <Box
                        ml={1}
                        as={"span"}
                        bg={"primary/12"}
                        color={"primary"}
                        px={2}
                        py={0.5}
                        rounded={"l2"}
                    >
                        Communities
                    </Box>
                </Heading>
            </Flex>

            <Flex
                wrapped
                gap={4}
                itemsCenter
                justify="center"
            >
                {communities.map((community, i) => (
                    <Community
                        {...community}
                        key={i}
                    />
                ))}
            </Flex>
        </Flex>
    );
}

interface CommunityProps {
    title: string;
    href: string;
    description: string;
    icon: React.ElementType;
}

function Community({ title, href, icon, description }: CommunityProps) {
    return (
        <Link
            isExternal
            href={href}
            col
            px={6}
            py={4}
            rounded={"l2"}
            border={"1px solid"}
            borderColor={"border"}
            bg={"bg/70"}
            backdropBlur={"sm"}
            backdropFilter={"auto"}
            maxW={{
                base: "full",
                md: "xs"
            }}
            w={{
                base: "full",
                md: "xs"
            }}
            display={"flex"}
            gap={2}
        >
            <HStack>
                <Icon as={icon} />
                <Text
                    size={"lg"}
                    fontWeight={"semibold"}
                >
                    {title}
                </Text>
                <Icon
                    as={FiExternalLink}
                    boxSize={"4"}
                />
            </HStack>

            <Text fontWeight={"400"}>{description}</Text>
        </Link>
    );
}
