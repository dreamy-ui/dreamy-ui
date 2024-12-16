import { MotionFlex, TRANSITION_EASINGS } from "@dreamy-ui/react";
import { Box, Flex, HStack, Heading, Icon, Link, Text } from "@dreamy-ui/react/rsc";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
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
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            isExternal
            href={href}
            col
            px={6}
            py={4}
            rounded={"l2"}
            border={"1px solid"}
            borderColor={"border.muted"}
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
            pos={"relative"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            overflow={"hidden"}
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

            <AnimatePresence>
                {isHovered && (
                    <MotionFlex
                        pos={"absolute"}
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        initial={{
                            y: "100%"
                        }}
                        animate={{
                            y: 0,
                            transition: {
                                duration: 0.3,
                                easings: TRANSITION_EASINGS.easeOut
                            }
                        }}
                        exit={{
                            y: "100%",
                            transition: {
                                duration: 0.2,
                                easings: TRANSITION_EASINGS.easeOut
                            }
                        }}
                        itemsCenter
                        justify={"center"}
                        bg={
                            "color-mix(in srgb, {colors.bg} 50%, color-mix(in srgb, {colors.primary} 50%, transparent 100%) 100%)"
                        }
                        backdropBlur={"sm"}
                        backdropFilter={"auto"}
                    >
                        <HStack>
                            <Icon
                                boxSize={"6"}
                                as={icon}
                                color={"primary"}
                            />
                            <Text
                                size={"2xl"}
                                fontWeight={"semibold"}
                                color={"primary"}
                            >
                                {title}
                            </Text>
                        </HStack>
                    </MotionFlex>
                )}
            </AnimatePresence>
        </Link>
    );
}
