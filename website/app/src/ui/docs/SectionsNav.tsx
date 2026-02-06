import { Badge, Box } from "@/ui";
import { Button } from "@/ui";
import { Flex } from "@/ui";
import { Icon } from "@/ui";
import { Collapse } from "@/ui";
import { useSafeLayoutEffect } from "@dreamy-ui/react";
import { AnimatePresence } from "motion/react";
import { memo, useRef, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { useLocation } from "react-router";
import type { ISection } from "~/src/.server/docs";
import { useDoc } from "~/src/hooks/useDoc";
import { useSections } from "~/src/hooks/useSections";
import { Link, ReactRouterLink } from "~/src/ui/global/Link";

const newComponents = ["toast", "progress circular", "group", "radio card", "wrap", "action bar"];
const updatedComponents = ["menu"];

export default function SectionsNav() {
    const { sections } = useSections();

    const ref = useRef<HTMLDivElement>(null);
    useSafeLayoutEffect(() => {
        const currentDoc = document.getElementById("current-doc");
        if (!currentDoc) return;

        const top = currentDoc.offsetTop;
        ref.current?.scrollTo({
            top: top - 80,
            behavior: (window as any)?.hydrated ? "instant" : "smooth"
        });
    }, []);

    return (
        <Flex
            _hover={{
                overflowY: "auto"
            }}
            as={"aside"}
            col
            display={{
                base: "none",
                md: "flex"
            }}
            flexShrink={0}
            gap={0}
            h={"fit-content"}
            maxH={"87.5vh"}
            minW={200}
            overflow={"auto"}
            overflowY={"hidden"}
            pos={"sticky"}
            pr={3}
            ref={ref}
            scrollbarColor={{
                base: "rgba(0, 0, 0, 0.1) transparent",
                _dark: "rgba(255, 255, 255, 0.1) transparent"
            }}
            scrollbarGutter={"stable"}
            scrollbarWidth="thin"
            top={20}
            w={{
                base: "100%",
                md: "225px"
            }}
        >
            {sections.map((section) => (
                <Section
                    key={"section-" + section.title}
                    section={section}
                />
            ))}
        </Flex>
    );
}

interface SectionProps {
    section: ISection;
}

export const Section = memo(function Section({ section }: SectionProps) {
    const [isOpen, setIsOpen] = useState(true);

    const path = useLocation().pathname;
    console.log({
        path,
        sectionSlug: "/docs/" + section.slugified
    });
    const isCurrent = path.startsWith("/docs/" + section.slugified);

    return (
        <Flex
            col
            key={section.title}
        >
            <Button
                justifyContent={"flex-start"}
                mb={2}
                onClick={() => setIsOpen((prev) => !prev)}
                size={"sm"}
                variant="ghost"
            >
                <Flex
                    justifyContent={"space-between"}
                    w={"100%"}
                >
                    {section.title}
                    <Icon
                        as={BiChevronRight}
                        boxSize={"5"}
                        rotate={isOpen ? "90deg" : "0deg"}
                        transition={"rotate 0.2s ease-in-out"}
                    />
                </Flex>
            </Button>

            <AnimatePresence initial={false}>
                <Collapse
                    animateOpacity={false}
                    isOpen={isOpen}
                >
                    <Flex
                        gap={2}
                        mb={2}
                        ml={2}
                        row
                    >
                        <Flex
                            flex={1}
                            relative
                            translate={"auto"}
                            x={"1px"}
                        >
                            <Flex
                                bg={"alpha.300"}
                                w={"1px"}
                            />
                            <Flex
                                // absolute
                                bg={"alpha.300"}
                                // right={"0px"}
                                // translate={"auto"}
                                opacity={isCurrent ? 1 : 0}
                                transition={"all 0.3s {easings.easeInOut}"}
                                w={"1px"}
                            />
                        </Flex>

                        <Flex
                            col
                            full
                            gap={2}
                        >
                            {section.sections.map((file) => (
                                <SectionButton
                                    file={file}
                                    key={"doc-" + file.name}
                                />
                            ))}
                        </Flex>
                    </Flex>
                </Collapse>
            </AnimatePresence>
        </Flex>
    );
});

function SectionButton({
    file
}: {
    file: ISection["sections"][number];
}) {
    const path = useLocation().pathname;
    const isCurrent = path === file.slug;
    const isNew = newComponents.includes(file.name.toLowerCase());
    const isUpdated = updatedComponents.includes(file.name.toLowerCase());

    return (
        <Button
            _hover={{
                color: isCurrent ? "white" : "fg"
            }}
            as={
                <ReactRouterLink
                    prefetch="intent"
                    to={file.slug}
                />
            }
            full
            id={isCurrent ? "current-doc" : undefined}
            justifyContent={"space-between"}
            key={"doc-" + file.name}
            size={"sm"}
            variant={isCurrent ? "primary" : "ghost"}
        >
            {file.name === "Llms"
                ? "LLMs"
                : file.name === "Cli"
                  ? "CLI"
                  : file.name === "Mcp Server"
                    ? "MCP Server"
                    : file.name}
            {(isNew || isUpdated) && (
                <Badge
                    css={{
                        "--badge-color": isCurrent ? "{colors.bg.light}" : undefined
                    }}
                    scheme={isCurrent ? "none" : "secondary"}
                >
                    {isNew ? "New" : "Updated"}
                </Badge>
            )}
        </Button>
    );
}
