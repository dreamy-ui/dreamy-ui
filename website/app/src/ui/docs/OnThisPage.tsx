import { Button, useEventListener } from "@dreamy-ui/react";
import {
    Box,
    Divider,
    Link as DreamLink,
    Flex,
    type FlexProps,
    Heading,
    Icon
} from "@dreamy-ui/react/rsc";
import { useLocation } from "@remix-run/react";
import { Fragment, memo, useState } from "react";
import { BiChevronUp, BiEdit } from "react-icons/bi";
import { useSections } from "~/routes/docs";
import { useDoc } from "~/routes/docs.$section.$page";
import { Link } from "~/src/ui/global/Link";

export default function OnThisPage() {
    const doc = useDoc();

    if (!doc) {
        return (
            <Box
                w={"200px"}
                flexShrink={0}
                minW={200}
                mdDown={{
                    display: "none"
                }}
            />
        );
    }

    return (
        <Flex
            minW={200}
            flexShrink={0}
            flexGrow={0}
            col
            gap={4}
            w={"200px"}
            mdDown={{
                display: "none"
            }}
            pos={"sticky"}
            top={20}
            h={"fit-content"}
            as={"aside"}
            p={2}
            display={{
                base: "none",
                md: "flex"
            }}
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
                        to={`#${heading.id}`}
                        transition={"color 0.2s"}
                        color={"fg.medium"}
                        _hover={{
                            color: "fg",
                            textDecoration: "underline"
                        }}
                    >
                        {heading.text}
                    </Link>
                    {!!heading.headings?.length &&
                        heading.headings.map((subHeading) => {
                            return (
                                <Link
                                    key={subHeading.id}
                                    to={`#${subHeading.id}`}
                                    pl={2}
                                    // size={"sm"}
                                    fontWeight={500}
                                    transition={"color 0.2s"}
                                    color={"fg.medium"}
                                    _hover={{
                                        color: "fg",
                                        textDecoration: "underline"
                                    }}
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
            gap={2}
            pl={2}
            color={"fg.medium"}
        >
            <Button
                variant={"link"}
                justifyContent={"space-between"}
                asComp={
                    <DreamLink
                        href={githubDocUrl}
                        isExternal
                    />
                }
                rightIcon={<Icon as={BiEdit} />}
            >
                Edit this page
            </Button>
            <Button
                variant={"link"}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                rightIcon={<Icon as={BiChevronUp} />}
                justifyContent={"space-between"}
                opacity={hasScrolled ? 1 : 0}
                transition={"opacity 0.2s"}
                transitionTimingFunction={"ease-in-out"}
            >
                Back to top
            </Button>
        </Flex>
    );
}
