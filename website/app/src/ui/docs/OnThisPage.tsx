import { Box, Flex, type FlexProps, Heading } from "@dreamy-ui/react/rsc";
import { Fragment, memo } from "react";
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
