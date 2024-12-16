import { Button, Collapse } from "@dreamy-ui/react";
import { Flex, Icon } from "@dreamy-ui/react/rsc";
import { useLocation } from "@remix-run/react";
import { AnimatePresence } from "motion/react";
import { memo, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { useSections } from "~/routes/docs";
import type { ISection } from "~/src/.server/docs";
import { cachePageData } from "~/src/functions/clientCache";
import { Link } from "~/src/ui/global/Link";

export default function SectionsNav() {
    const { sections } = useSections();

    return (
        <Flex
            pos={"sticky"}
            top={20}
            h={"fit-content"}
            as={"aside"}
            col
            w={{
                base: "100%",
                md: "225px"
            }}
            display={{
                base: "none",
                md: "flex"
            }}
            minW={200}
            gap={0}
            overflow={"auto"}
            maxH={"87.5vh"}
            pr={3}
            flexShrink={0}
            scrollbarGutter={"stable"}
            scrollbarWidth="thin"
            scrollbarColor={{
                base: "rgba(0, 0, 0, 0.1) transparent",
                _dark: "rgba(255, 255, 255, 0.1) transparent"
            }}
            overflowY={"hidden"}
            _hover={{
                overflowY: "auto"
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

    return (
        <Flex
            key={section.title}
            col
        >
            <Button
                variant="ghost"
                onClick={() => setIsOpen((prev) => !prev)}
                justifyContent={"flex-start"}
                size={"sm"}
                mb={2}
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
                    in={isOpen}
                    animateOpacity={false}
                >
                    <Flex
                        row
                        gap={2}
                        ml={2}
                        mb={2}
                    >
                        <Flex
                            w={"1px"}
                            bg={"alpha.300"}
                        />

                        <Flex
                            col
                            gap={2}
                            full
                        >
                            {section.sections.map((file) => (
                                <MemoSectionButton
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

const MemoSectionButton = memo(function SectionButton({
    file
}: { file: ISection["sections"][number] }) {
    const path = useLocation().pathname;
    const isCurrent = path === file.slug;

    return (
        <Button
            key={"doc-" + file.name}
            variant={isCurrent ? "primary" : "ghost"}
            wFull
            asComp={
                <Link
                    to={file.slug}
                    prefetch="intent"
                />
            }
            size={"sm"}
            justifyContent={"flex-start"}
            onPointerEnter={() => {
                cachePageData(file.slug);
            }}
        >
            {file.name}
        </Button>
    );
});
