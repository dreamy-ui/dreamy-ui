import { Box } from "@/box";
import { Button } from "@/button";
import { Flex } from "@/flex";
import { Heading } from "@/heading";
import { VStack } from "@/stack";
import { Text } from "@/text";
import { useEffect, useMemo } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { BiLogoGithub } from "react-icons/bi";
import { IoMdBrowsers } from "react-icons/io";
import type { MetaFunction } from "react-router";
import { type ShouldRevalidateFunctionArgs, data, useLocation } from "react-router";
import { CACHE_DURATION, CacheHeaders } from "~/src/.server/cache";
import { Docs } from "~/src/.server/docs";
import { getTimings } from "~/src/.server/middlewares";
import { cacheClientLoader } from "~/src/functions/clientCache";
import { useDoc } from "~/src/hooks/useDoc";
import { useSections } from "~/src/hooks/useSections";
import MDXContent from "~/src/ui/docs/MDXContent";
import NextPreviousButton from "~/src/ui/docs/NextPreviousButton";
import { Link } from "~/src/ui/global/Link";
import type { ComponentDocFrontmatter, ServerLoader } from "~/types";
import { ErrorBoundary } from "./$";
import type { Route } from "./+types/docs.$section.$page";

export function meta({ data, params }: Route.MetaArgs) {
    return [
        {
            title: data ? `${data.frontmatter.title} - Dreamy UI` : "Doc not found - Dreamy UI"
        },
        {
            description: data?.frontmatter?.description ?? undefined
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
            content: data?.frontmatter.title ? `${data.frontmatter.title} - Dreamy UI` : "Dreamy UI"
        },
        {
            property: "og:description",
            content: data?.frontmatter.description ?? undefined
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
            content: data?.frontmatter.title ? `${data.frontmatter.title} - Dreamy UI` : "Dreamy UI"
        },
        {
            name: "twitter:description",
            content: data?.frontmatter.description ?? undefined
        },
        {
            name: "twitter:image:alt",
            content: data?.frontmatter.title ?? "Dreamy UI"
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

export const clientLoader = (args: Route.ClientLoaderArgs) =>
    cacheClientLoader<ServerLoader<typeof loader>>(args);
clientLoader.hydrate = true;

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
            col
            gap={10}
            as={"main"}
            w={"full"}
            pb={20}
            overflowX={"auto"}
            flexGrow={0}
            pt={{
                base: 28,
                md: 0
            }}
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
                        wrapped
                        gap={2}
                        itemsStretch={"stretch"}
                        css={{
                            "& > *": {
                                mdDown: {
                                    flex: "1 1 150px"
                                }
                            }
                        }}
                    >
                        {[meta.source, meta.themeSource].map((s, i) => {
                            if (!s) return null;

                            return (
                                <Button
                                    key={`source-${s}-${i}`}
                                    asComp={
                                        <Link
                                            isExternal
                                            to={`https://github.com/${
                                                import.meta.env.VITE_SOURCE_REPO
                                            }/tree/main/${s}`}
                                        />
                                    }
                                    size={"sm"}
                                    leftIcon={<BiLogoGithub />}
                                    translate={"auto"}
                                    _hover={{
                                        y: "-1"
                                    }}
                                    transition={`translate {durations.fast} {easings.ease-in-out},
                                        background-color {durations.normal} {easings.ease-in-out}`}
                                >
                                    {i === 0 ? "Source" : "Theme Source"}
                                </Button>
                            );
                        })}
                        <Button
                            size={"sm"}
                            leftIcon={
                                frontmatter.isServerComponent ? (
                                    <AiFillThunderbolt />
                                ) : (
                                    <IoMdBrowsers />
                                )
                            }
                            translate={"auto"}
                            _hover={{
                                y: "-1"
                            }}
                            transition={`translate {durations.fast} {easings.ease-in-out},
                                        background-color {durations.normal} {easings.ease-in-out}`}
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
                        to={previousDoc.slug}
                        label={previousDoc.name}
                    />
                ) : (
                    <Box w={"50%"} />
                )}
                {nextDoc ? (
                    <NextPreviousButton
                        direction="next"
                        to={nextDoc.slug}
                        label={nextDoc.name}
                    />
                ) : (
                    <Box w={"50%"} />
                )}
            </Flex>
        </Flex>
    );
}

export { ErrorBoundary };
