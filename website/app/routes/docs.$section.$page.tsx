import { Box } from "@/ui";
import { Button } from "@/ui";
import { Flex } from "@/ui";
import { Heading } from "@/ui";
import { VStack } from "@/ui";
import { Text } from "@/ui";
import { useEffect, useMemo } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { BiLogoGithub } from "react-icons/bi";
import { IoMdBrowsers } from "react-icons/io";
import type { MetaFunction } from "react-router";
import { type ShouldRevalidateFunctionArgs, data, useLocation } from "react-router";
import { CACHE_DURATION, CacheHeaders } from "~/src/.server/cache";
import { Docs } from "~/src/.server/docs";
import { getTimings } from "~/src/.server/middlewares";
import { useDoc } from "~/src/hooks/useDoc";
import { useSections } from "~/src/hooks/useSections";
import MDXContent from "~/src/ui/docs/MDXContent";
import NextPreviousButton from "~/src/ui/docs/NextPreviousButton";
import { ReactRouterLink } from "~/src/ui/global/Link";
import type { ComponentDocFrontmatter } from "~/types";
import { ErrorBoundary } from "./$";
import type { Route } from "./+types/docs.$section.$page";

export function meta({ loaderData, params }: Route.MetaArgs) {
    return [
        {
            title: loaderData
                ? `${loaderData.frontmatter.title} - Dreamy UI`
                : "Doc not found - Dreamy UI"
        },
        {
            property: "description",
            content: loaderData?.frontmatter?.description ?? undefined
        },
        {
            property: "og:image",
            content: `/docs/${params.section}/${params.page}/og-image`
        },
        {
            property: "og:image:width",
            content: "1920"
        },
        {
            property: "og:image:height",
            content: "822.857144"
        },
        {
            property: "og:image:type",
            content: "image/png"
        },
        {
            property: "og:title",
            content: loaderData?.frontmatter.title
                ? `${loaderData.frontmatter.title} - Dreamy UI`
                : "Dreamy UI"
        },
        {
            property: "og:description",
            content: loaderData?.frontmatter.description ?? undefined
        },
        // twitter
        {
            name: "twitter:card",
            content: "summary_large_image"
        },
        {
            name: "twitter:image",
            content: `/docs/${params.section}/${params.page}/og-image`
        },
        {
            name: "twitter:title",
            content: loaderData?.frontmatter.title
                ? `${loaderData.frontmatter.title} - Dreamy UI`
                : "Dreamy UI"
        },
        {
            name: "twitter:description",
            content: loaderData?.frontmatter.description ?? undefined
        },
        {
            name: "twitter:image:alt",
            content: loaderData?.frontmatter.title ?? "Dreamy UI"
        },
        {
            name: "twitter:image:width",
            content: "1920"
        },
        {
            name: "twitter:image:height",
            content: "822.857144"
        }
    ] satisfies ReturnType<MetaFunction>;
}

export const headers = CacheHeaders.cache(CACHE_DURATION.DEFAULT);

export async function loader({ params }: Route.LoaderArgs) {
    const section = params.section as string;
    const page = params.page as string;

    const start = performance.now();
    const doc = await Docs.getDoc(section, page).catch((e) => {
        console.error(e);
        return null;
    });
    const end = performance.now();
    getTimings().set("doc", end - start);

    if (!doc) {
        throw data(null, {
            status: 404,
            statusText: "Page Not Found"
        });
    }

    return data(
        {
            mdxSource: doc.mdxContent,
            mdxDescription: doc.mdxFrontmatterDescription,
            frontmatter: doc.mdxContent.frontmatter,
            headings: doc.headings
        },
        {
            headers: CacheHeaders.cache(CACHE_DURATION.DEFAULT, undefined, true)
        }
    );
}

export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
    if (args.nextUrl.pathname !== args.currentUrl.pathname) {
        return true;
    }

    return false;
}

export default function DocsSectionPage() {
    const { sections } = useSections();
    const { mdxSource, frontmatter, mdxDescription } = useDoc();

    const loc = useLocation();

    // biome-ignore lint/correctness/useExhaustiveDependencies: we don't want to scroll when clicked (yet)
    useEffect(() => {
        if (loc.hash) {
            const el = document.getElementById(loc.hash.slice(1));
            if (el) {
                el.scrollIntoView();
            }
        }
    }, [loc.pathname]);

    const meta = useMemo(() => {
        return "isServerComponent" in frontmatter
            ? (frontmatter as unknown as ComponentDocFrontmatter)
            : null;
    }, [frontmatter]);

    const flatSections = sections.flatMap((s) => s.sections);
    const indexOfCurrentDoc = flatSections.findIndex((s) => s.slug === loc.pathname);

    const previousDoc = flatSections[indexOfCurrentDoc - 1];
    const nextDoc = flatSections[indexOfCurrentDoc + 1];

    return (
        <Flex
            as={"main"}
            col
            flexGrow={0}
            gap={10}
            overflowX={"auto"}
            pb={20}
            pt={{
                base: 28,
                md: 0
            }}
            w={"full"}
        >
            {meta && (
                <Flex
                    col
                    gap={4}
                    w={"full"}
                >
                    <Heading size={"3xl"}>{meta.title}</Heading>
                    {mdxDescription ? (
                        <MDXContent mdxContent={mdxDescription} />
                    ) : (
                        <Text>{meta.description}</Text>
                    )}

                    <Flex
                        css={{
                            "& > *": {
                                mdDown: {
                                    flex: "1 1 150px"
                                }
                            }
                        }}
                        gap={2}
                        itemsStretch={"stretch"}
                        wrapped
                    >
                        {[meta.source, meta.themeSource].map((s, i) => {
                            if (!s) return null;

                            return (
                                <Button
                                    _hover={{
                                        y: "-1"
                                    }}
                                    as={
                                        <ReactRouterLink
                                            target="_blank"
                                            to={`https://github.com/${
                                                import.meta.env.VITE_SOURCE_REPO
                                            }/tree/main/${s}`}
                                        />
                                    }
                                    key={`source-${s}-${i}`}
                                    leftIcon={<BiLogoGithub />}
                                    size={"sm"}
                                    transition={
                                        "translate {durations.fast} {easings.ease-in-out}, background-color {durations.normal} {easings.ease-in-out}"
                                    }
                                    translate={"auto"}
                                >
                                    {i === 0 ? "Source" : "Theme Source"}
                                </Button>
                            );
                        })}
                        <Button
                            _hover={{
                                y: "-1"
                            }}
                            leftIcon={
                                frontmatter.isServerComponent ? (
                                    <AiFillThunderbolt />
                                ) : (
                                    <IoMdBrowsers />
                                )
                            }
                            size={"sm"}
                            transition={
                                "translate {durations.fast} {easings.ease-in-out}, background-color {durations.normal} {easings.ease-in-out}"
                            }
                            translate={"auto"}
                        >
                            {frontmatter.isServerComponent ? "Server" : "Client"} Component
                        </Button>
                    </Flex>
                </Flex>
            )}

            <VStack itemsStart>
                <MDXContent mdxContent={mdxSource} />
            </VStack>

            <Flex
                gap={4}
                w={"full"}
            >
                {previousDoc ? (
                    <NextPreviousButton
                        direction="previous"
                        label={previousDoc.name}
                        to={previousDoc.slug}
                    />
                ) : (
                    <Box w={"50%"} />
                )}
                {nextDoc ? (
                    <NextPreviousButton
                        direction="next"
                        label={nextDoc.name}
                        to={nextDoc.slug}
                    />
                ) : (
                    <Box w={"50%"} />
                )}
            </Flex>
        </Flex>
    );
}

export { ErrorBoundary };
