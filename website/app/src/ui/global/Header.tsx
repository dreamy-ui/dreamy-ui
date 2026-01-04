import { Flex } from "@/ui";
import { Icon } from "@/ui";
import { IconButton } from "@/ui";
import { HStack } from "@/ui";
import { Text } from "@/ui";
import { useEventListener } from "@dreamy-ui/react";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { Link } from "~/src/ui/global/Link";
import Search from "~/src/ui/global/Search";
import GithubButton from "./GithubButton";
import { Logo } from "./Logo";
import { ToggleThemeButton } from "./ToggleThemeButton";
import HamburgerMenu from "./mobile/HamburgerMenu";

interface Props {
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ isMenuOpen, setIsMenuOpen }: Props) {
    const [hasScrolled, setHasScrolled] = useState(false);

    useEventListener(
        "scroll",
        () => {
            if (window.scrollY > 0 && !hasScrolled) {
                setHasScrolled(true);
            } else if (window.scrollY === 0 && hasScrolled) {
                setHasScrolled(false);
            }
        },
        null,
        { fireOnMount: true }
    );

    return (
        <Flex
            as={"header"}
            backdropBlur={"sm"}
            backdropFilter={"auto"}
            bg={"color-mix(in srgb, {colors.bg} 70%, transparent 10%)"}
            borderBottomWidth={"1px"}
            borderColor={hasScrolled ? "border" : "transparent"}
            contentBetween
            full
            h={16}
            itemsCenter
            pos={"sticky"}
            row
            top={0}
            transition={"all 0.15s"}
            transitionTimingFunction={"ease-out"}
            zIndex={"sticky"}
        >
            <Flex
                contentBetween
                full
                maxW={"7xl"}
                mx={"auto"}
                px={4}
            >
                <Logo />

                <HStack
                    gap={{
                        base: 2,
                        md: 4
                    }}
                >
                    <HStack
                        as={
                            <Link
                                display={{
                                    base: "none",
                                    md: "inline-flex"
                                }}
                                isExternal
                                mr={4}
                                prefetch="none"
                                to={"/discord"}
                            />
                        }
                        className="group"
                        // add shadow on hover as filter
                    >
                        <Icon
                            _groupHover={{
                                filter: "drop-shadow(0 0 4px #5865F2)",
                                color: "#5865F2"
                            }}
                            as={FaDiscord}
                            h={4}
                            transition={
                                "filter {durations.normal} {easings.easeInOut}, color {durations.fastest} {easings.easeInOut}"
                            }
                        />
                        <Text
                            _groupHover={{
                                filter: "drop-shadow(0 0 4px #5865F2)",
                                color: "#5865F2"
                            }}
                            transition={
                                "filter {durations.normal} {easings.easeInOut}, color {durations.fastest} {easings.easeInOut}"
                            }
                        >
                            Discord
                        </Text>
                    </HStack>

                    <Link
                        display={{
                            base: "none",
                            md: "inline-flex"
                        }}
                        prefetch="intent"
                        to={"/docs"}
                    >
                        Docs
                    </Link>

                    <Search />
                    <GithubButton />
                    <ToggleThemeButton />

                    <IconButton
                        _hover={{
                            bg: "transparent"
                        }}
                        aria-label={`${isMenuOpen ? "Close" : "Open"} Menu`}
                        display={{
                            base: "inline-flex",
                            md: "none"
                        }}
                        icon={<HamburgerMenu isOpen={isMenuOpen} />}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        variant={"ghost"}
                    />
                </HStack>
            </Flex>
        </Flex>
    );
}
