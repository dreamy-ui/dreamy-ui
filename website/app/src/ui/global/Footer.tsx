import { Flex } from "@/flex";
import { Image } from "@/image";
import { HStack } from "@/stack";
import { Text } from "@/text";
import { Link } from "./Link";

export default function Footer() {
    return (
        <Flex
            as="footer"
            direction="column"
            align="center"
            py={8}
            px={4}
            gap={6}
            bg="bg.panel/30"
            borderTop="1px solid"
            borderColor="border.muted"
            mt={{
                base: 20,
                md: 40
            }}
        >
            <Link to="/">
                <Flex
                    align="center"
                    gap={3}
                >
                    <Image
                        src="/dreamy-ui-no-bg.png"
                        alt="Dreamy UI Logo"
                        boxSize="8"
                    />
                    <Text
                        size="lg"
                        fontWeight="semibold"
                    >
                        Dreamy UI
                    </Text>
                </Flex>
            </Link>

            <HStack
                gap={6}
                justify="center"
            >
                <Link
                    to="/docs"
                    color="fg.medium"
                >
                    Documentation
                </Link>
                <Link
                    to="/github"
                    isExternal
                    color="fg.medium"
                >
                    GitHub
                </Link>
                <Link
                    to="/discord"
                    isExternal
                    color="fg.medium"
                >
                    Discord
                </Link>
                <Link
                    to="/bluesky"
                    color="fg.medium"
                    isExternal
                >
                    Bluesky
                </Link>
            </HStack>

            <Text
                size="sm"
                color="fg.medium"
            >
                Dreamy UI {new Date().getFullYear()}
            </Text>
        </Flex>
    );
}
