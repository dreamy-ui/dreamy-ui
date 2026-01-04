import { Flex } from "@/ui";
import { Icon } from "@/ui";
import { IconButton } from "@/ui";
import { Image } from "@/ui";
import { Text } from "@/ui";
import { TRANSITION_EASINGS, useColorMode } from "@dreamy-ui/react";
import { AnimatePresence, m } from "motion/react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "../Link";

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Route {
    name: string;
    link: string;
    isExternal?: boolean;
}

const routes: Route[] = [
    {
        name: "Homepage",
        link: "/"
    },
    {
        name: "Docs",
        link: "/docs"
    },
    {
        name: "Github",
        link: `https://github.com/${import.meta.env.VITE_SOURCE_REPO}`,
        isExternal: true
    },
    {
        name: "Discord",
        link: "/discord",
        isExternal: true
    }
];

export default function MobileMenu({ isOpen, setIsOpen }: Props) {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <AnimatePresence>
            <m.div
                animate={{ x: isOpen ? 0 : "80vw" }}
                initial={{ x: "80vw" }}
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: "80vw",
                    zIndex: 9999
                }}
                transition={{
                    duration: 0.3,
                    ease: TRANSITION_EASINGS.easeInOut
                }}
            >
                <Flex
                    bg={{
                        base: "white",
                        _dark: "black"
                    }}
                    borderColor={"alpha.300"}
                    borderLeft={"1px solid"}
                    flexDir={"column"}
                    gap={10}
                    h="100vh"
                    px={6}
                    py={4}
                    w={"100%"}
                >
                    <Flex
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        w="100%"
                    >
                        <Image
                            alt="Dream Logo"
                            h={"5"}
                            src={"/dream.svg"}
                        />

                        <IconButton
                            aria-label="Close Menu"
                            icon={
                                <Icon
                                    as={BsArrowRight}
                                    boxSize={"5"}
                                />
                            }
                            onClick={() => setIsOpen(false)}
                            variant={"ghost"}
                        />
                    </Flex>

                    <Flex
                        contentCenter
                        flex={1}
                        flexDir={"column"}
                        gap={10}
                        itemsCenter
                        pb={40}
                        w="100%"
                    >
                        {routes.map((route) => (
                            <Link
                                _hover={{
                                    textDecoration: "none",
                                    color: "brand"
                                }}
                                fontWeight={600}
                                isExternal={route.isExternal}
                                key={route.name}
                                onClick={() => setIsOpen(false)}
                                size={"2xl"}
                                to={route.link}
                            >
                                {route.name}
                            </Link>
                        ))}

                        <Text
                            fontWeight={600}
                            onClick={toggleColorMode}
                            size={"2xl"}
                        >
                            Toggle {colorMode === "light" ? "Dark" : "Light"}
                        </Text>

                        <Text
                            fontWeight={600}
                            onClick={() => setIsOpen(false)}
                            size={"2xl"}
                        >
                            Close
                        </Text>
                    </Flex>
                </Flex>
            </m.div>
        </AnimatePresence>
    );
}
