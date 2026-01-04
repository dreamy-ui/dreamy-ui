import { Box } from "@/ui";
import { Flex } from "@/ui";
import { Heading } from "@/ui";
import { Icon } from "@/ui";
import { Link } from "@/ui";
import { HStack } from "@/ui";
import { Text } from "@/ui";
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
                        as={"span"}
                        bg={"primary/12"}
                        color={"primary"}
                        ml={1}
                        px={2}
                        py={0.5}
                        rounded={"l2"}
                    >
                        Communities
                    </Box>
                </Heading>
            </Flex>

            <Flex
                gap={4}
                itemsCenter
                justify="center"
                wrapped
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
            backdropBlur={"sm"}
            backdropFilter={"auto"}
            bg={"bg/70"}
            border={"1px solid"}
            borderColor={"border"}
            col
            display={"flex"}
            gap={2}
            href={href}
            isExternal
            maxW={{
                base: "full",
                md: "xs"
            }}
            px={6}
            py={4}
            rounded={"l2"}
            w={{
                base: "full",
                md: "xs"
            }}
        >
            <HStack>
                <Icon as={icon} />
                <Text
                    fontWeight={"semibold"}
                    size={"lg"}
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
