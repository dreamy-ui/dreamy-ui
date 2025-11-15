import { Box } from "@/box";
import { Button } from "@/button";
import { Divider } from "@/divider";
import { Flex, type FlexProps } from "@/flex";
import { Heading } from "@/heading";
import { Icon } from "@/icon";
import { Link as DreamLink } from "@/link";
import { useEventListener } from "@dreamy-ui/react";
import { Fragment, memo, useState } from "react";
import { BiChevronUp, BiEdit } from "react-icons/bi";
import { useLocation } from "react-router";
import { useDoc } from "~/src/hooks/useDoc";
import { useSections } from "~/src/hooks/useSections";
import { Link } from "~/src/ui/global/Link";

export default function OnThisPage() {
    const doc = useDoc();

    if (!doc.headings?.length) {
        return (
            <Box
                flexShrink={0}
                mdDown={{
                    display: "none"
                }}
                minW={200}
                w={"200px"}
            />
        );
    }

    return (
        <Flex
            as={"aside"}
            col
            display={{
                base: "none",
                md: "flex"
            }}
            flexGrow={0}
            flexShrink={0}
            gap={4}
            h={"fit-content"}
            mdDown={{
                display: "none"
            }}
            minW={200}
            p={2}
            pos={"sticky"}
            top={20}
            w={"200px"}
        >
            <Heading size={"md"}>On this page</Heading>
            <Flex
                col
                gap={2}
                pl={2}
            >
                <OnThisPageHeadings gap={1} />
            </Flex>

            <Divider />

            <ActionButtons />
        </Flex>
    );
}

export const OnThisPageHeadings = memo((props: FlexProps) => {
    const doc = useDoc();

    return (
        <Flex
            col
            {...props}
        >
            {doc.headings?.map((heading) => (
                <Fragment key={heading.id}>
                    <Link
                        _hover={{
                            color: "fg",
                            textDecoration: "underline"
                        }}
                        color={"fg.medium"}
                        fontWeight={500}
                        to={`#${heading.id}`}
                        transition={"color 0.2s"}
                    >
                        {heading.text}
                    </Link>
                    {!!heading.headings?.length &&
                        heading.headings.map((subHeading) => {
                            return (
                                <Link
                                    _hover={{
                                        color: "fg",
                                        textDecoration: "underline"
                                    }}
                                    color={"fg.medium"}
                                    fontWeight={400}
                                    // size={"sm"}
                                    key={subHeading.id}
                                    pl={2}
                                    to={`#${subHeading.id}`}
                                    transition={"color 0.2s"}
                                >
                                    {subHeading.text}
                                </Link>
                            );
                        })}
                </Fragment>
            ))}
        </Flex>
    );
});

function ActionButtons() {
    const { pathname } = useLocation();
    const { sections } = useSections();

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

    function getGithubDocPath() {
        const path = pathname.split("/").slice(2).join("/");
        let folder = path.split("/")[0];
        let file = path.split("/")[1];

        const folderIndex = sections.findIndex(
            (s) => s.title.toLowerCase() === folder.toLowerCase()
        );
        folder = `${folderIndex + 1}.${folder}`;

        if (!folder.includes("components")) {
            const fileIndex = sections[folderIndex].sections.findIndex((s) => s.slug === pathname);
            file = `${fileIndex + 1}.${file}`;
        }
        return `${folder}/${file}`;
    }
    const githubDocUrl = `https://github.com/${import.meta.env.VITE_SOURCE_REPO}/blob/main/website/docs/${getGithubDocPath()}.mdx`;

    return (
        <Flex
            col
            color={"fg.medium"}
            gap={2}
            pl={2}
        >
            <Button
                as={
                    <DreamLink
                        href={githubDocUrl}
                        isExternal
                    />
                }
                fontWeight={500}
                justifyContent={"space-between"}
                rightIcon={<Icon as={BiEdit} />}
                variant={"link"}
            >
                Edit this page
            </Button>
            <Button
                fontWeight={500}
                justifyContent={"space-between"}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                opacity={hasScrolled ? 1 : 0}
                rightIcon={<Icon as={BiChevronUp} />}
                transition={"opacity 0.2s"}
                transitionTimingFunction={"ease-in-out"}
                variant={"link"}
            >
                Back to top
            </Button>
        </Flex>
    );
}
