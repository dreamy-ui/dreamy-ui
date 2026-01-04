import { Box } from "@/ui";
import { Button } from "@/ui";
import { Flex } from "@/ui";
import { Icon } from "@/ui";
import { MotionFlex } from "@/ui";
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
            backdropBlur={"sm"}
            backdropFilter="auto"
            backgroundColor="color-mix(in srgb, {colors.bg} 70%, {colors.alpha.100} 10%)"
            col
            // fixed, because sticky was causing issues with the scrollbar
            left={0}
            md={{
                display: "none"
            }}
            position={"fixed"}
            right={0}
            top={"64px"}
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
            borderBottomWidth="1px"
            borderColor="border"
            col
        >
            <Button
                _hover={{
                    bg: "transparent"
                }}
                justifyContent={"flex-start"}
                leftIcon={
                    <Icon
                        as={BiChevronDown}
                        boxSize={"5"}
                        rotate={isOpen ? "180deg" : "0deg"}
                        transformOrigin="center"
                        transition="rotate 0.2s"
                        transitionTimingFunction="ease-in-out"
                    />
                }
                onClick={() => setIsOpen((prev) => !prev)}
                rounded={"none"}
                variant="ghost"
            >
                Docs
            </Button>

            <AnimatePresence>
                <MotionFlex
                    animate={{
                        height: isOpen ? "auto" : 0,
                        transition: {
                            duration: reduceMotion ? 0 : isOpen ? 0.2 : 0.15
                        }
                    }}
                    col
                    initial={{
                        height: 0
                    }}
                    maxH={"calc(100dvh - 63px - 40px)"}
                    overflowY={"scroll"}
                    transition={{
                        ease: TRANSITION_EASINGS.easeInOut
                    }}
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
            borderBottomWidth="1px"
            borderColor="border"
            col
        >
            <Button
                _hover={{
                    bg: "transparent"
                }}
                justifyContent={"flex-start"}
                leftIcon={
                    <Icon
                        as={BiChevronDown}
                        boxSize={"5"}
                        rotate={isOpen ? "180deg" : "0deg"}
                        transformOrigin="center"
                        transition="rotate 0.2s"
                        transitionTimingFunction="ease-in-out"
                    />
                }
                onClick={() => setIsOpen(!isOpen)}
                rounded={"none"}
                variant="ghost"
            >
                On this page
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <MotionFlex
                        animate={{
                            height: "auto",
                            transition: {
                                duration: reduceMotion ? 0 : 0.2
                            }
                        }}
                        col
                        exit={{
                            height: 0,
                            transition: {
                                duration: reduceMotion ? 0 : 0.15
                            }
                        }}
                        initial={{
                            height: 0
                        }}
                        overflowY={"hidden"}
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
