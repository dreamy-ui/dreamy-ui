import { Box } from "@/box";
import { Button } from "@/button";
import { Flex } from "@/flex";
import { Icon } from "@/icon";
import { MotionFlex } from "@/motion";
import { TRANSITION_EASINGS, useReducedMotion, useSafeLayoutEffect } from "@dreamy-ui/react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useLocation } from "react-router";
import { useSections } from "~/src/hooks/useSections";
import { OnThisPageHeadings } from "~/src/ui/docs/OnThisPage";
import { Section } from "~/src/ui/docs/SectionsNav";

export default function MobileDocsNav() {
    return (
        <Flex
            col
            md={{
                display: "none"
            }}
            left={0}
            right={0}
            // fixed, because sticky was causing issues with the scrollbar
            position={"fixed"}
            top={"64px"}
            backdropBlur={"sm"}
            backdropFilter="auto"
            backgroundColor="color-mix(in srgb, {colors.bg} 70%, {colors.alpha.100} 10%)"
            zIndex={10}
        >
            <DocsNav />
            <OnThisPageNav />
        </Flex>
    );
}

function DocsNav() {
    const [isOpen, setIsOpen] = useState(false);

    const { sections } = useSections();

    const location = useLocation();
    useSafeLayoutEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    const reduceMotion = useReducedMotion();

    return (
        <Flex
            col
            borderColor="border"
            borderBottomWidth="1px"
        >
            <Button
                rounded={"none"}
                justifyContent={"flex-start"}
                leftIcon={
                    <Icon
                        boxSize={"5"}
                        as={BiChevronDown}
                        rotate={isOpen ? "180deg" : "0deg"}
                        transition="rotate 0.2s"
                        transitionTimingFunction="ease-in-out"
                        transformOrigin="center"
                    />
                }
                variant="ghost"
                onClick={() => setIsOpen((prev) => !prev)}
                _hover={{
                    bg: "transparent"
                }}
            >
                Docs
            </Button>

            <AnimatePresence>
                <MotionFlex
                    col
                    initial={{
                        height: 0
                    }}
                    animate={{
                        height: isOpen ? "auto" : 0,
                        transition: {
                            duration: reduceMotion ? 0 : isOpen ? 0.2 : 0.15
                        }
                    }}
                    transition={{
                        ease: TRANSITION_EASINGS.easeInOut
                    }}
                    overflowY={"scroll"}
                    maxH={"calc(100dvh - 63px - 40px)"}
                >
                    <Box p={4}>
                        {sections.map((section) => (
                            <Section
                                key={section.title}
                                section={section}
                            />
                        ))}
                    </Box>
                </MotionFlex>
            </AnimatePresence>
        </Flex>
    );
}

function OnThisPageNav() {
    const [isOpen, setIsOpen] = useState(false);

    const location = useLocation();
    useSafeLayoutEffect(() => {
        if (!location.hash) return;

        setTimeout(() => {
            setIsOpen(false);
        }, 700);
    }, [location.hash]);

    const reduceMotion = useReducedMotion();

    return (
        <Flex
            col
            borderBottomWidth="1px"
            borderColor="border"
        >
            <Button
                rounded={"none"}
                justifyContent={"flex-start"}
                leftIcon={
                    <Icon
                        boxSize={"5"}
                        as={BiChevronDown}
                        rotate={isOpen ? "180deg" : "0deg"}
                        transition="rotate 0.2s"
                        transitionTimingFunction="ease-in-out"
                        transformOrigin="center"
                    />
                }
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                _hover={{
                    bg: "transparent"
                }}
            >
                On this page
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <MotionFlex
                        col
                        overflowY={"hidden"}
                        initial={{
                            height: 0
                        }}
                        animate={{
                            height: "auto",
                            transition: {
                                duration: reduceMotion ? 0 : 0.2
                            }
                        }}
                        exit={{
                            height: 0,
                            transition: {
                                duration: reduceMotion ? 0 : 0.15
                            }
                        }}
                        transition={{
                            ease: TRANSITION_EASINGS.easeInOut
                        }}
                    >
                        <OnThisPageHeadings
                            gap={1}
                            p={4}
                        />
                    </MotionFlex>
                )}
            </AnimatePresence>
        </Flex>
    );
}
