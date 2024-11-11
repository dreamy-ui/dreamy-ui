import { Button } from "@dreamy-ui/react";
import { Flex, HStack, Heading, Text, VStack } from "@dreamy-ui/react/rsc";
import type { LoaderFunctionArgs, MetaArgs, MetaFunction } from "@remix-run/node";
import {
    type ClientLoaderFunctionArgs,
    type ShouldRevalidateFunctionArgs,
    isRouteErrorResponse,
    json,
    useLocation,
    useRouteError
} from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { BiLogoGithub } from "react-icons/bi";
import { IoMdBrowsers } from "react-icons/io";
import { CACHE_DURATION, CacheHeaders } from "~/src/.server/cache";
import { Docs } from "~/src/.server/docs";
import { cacheClientLoader, useCachedRouteLoaderData } from "~/src/functions/clientCache";
import MDXContent from "~/src/ui/docs/MDXContent";
import { Link } from "~/src/ui/global/Link";
import type { ComponentDocFrontmatter } from "~/types";

export function meta({ data }: MetaArgs<typeof loader>) {
    return [
        {
            title: data ? `${data.frontmatter.title} - Dreamy UI` : "Doc not found - Dreamy UI"
        },
        {
            description: data?.frontmatter?.description ?? undefined
        }
    ] satisfies ReturnType<MetaFunction>;
}

export const headers = CacheHeaders.cache(CACHE_DURATION.DEFAULT);

export async function loader({ params }: LoaderFunctionArgs) {
    const section = params.section as string;
    const page = params.page as string;

    const doc = await Docs.getDoc(section, page).catch((e) => {
        console.error(e);
        return null;
    });

    if (!doc) {
        throw json(null, {
            status: 404
        });
    }

    const frontmatter = doc.mdxContent.frontmatter;

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    return json(
        {
            mdxSource: doc.mdxContent,
            mdxDescription: doc.mdxFrontmatterDescription,
            frontmatter,
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

export const clientLoader = (args: ClientLoaderFunctionArgs) => cacheClientLoader(args);
clientLoader.hydrate = true;

export function useDoc() {
    return useCachedRouteLoaderData<typeof loader>("routes/docs.$section.$page");
}

export default function DocsSectionPage() {
    const { mdxSource, frontmatter, mdxDescription } = useDoc();

    const loc = useLocation();

    // biome-ignore lint/correctness/useExhaustiveDependencies: we dont want to scroll when clicked (yet)
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

    return (
        <Flex
            col
            gap={10}
            as={"main"}
            w={"full"}
            pb={20}
            maxW={"full"}
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
                >
                    <Heading size={"3xl"}>{meta.title}</Heading>
                    {mdxDescription ? (
                        <MDXContent mdxContent={mdxDescription} />
                    ) : (
                        <Text>{meta.description}</Text>
                    )}

                    <HStack>
                        {[meta.source, meta.themeSource].map((s, i) => {
                            if (!s) return null;

                            return (
                                <Button
                                    key={`source-${s}-${i}`}
                                    asComp={
                                        <Link
                                            isExternal
                                            to={`https://github.com/${import.meta.env.VITE_SOURCE_REPO}/tree/main/${s}`}
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
                            {frontmatter.isServerComponent
                                ? "Server Component"
                                : "Client Component"}
                        </Button>
                    </HStack>
                </Flex>
            )}

            <VStack itemsStart>
                <MDXContent mdxContent={mdxSource} />
            </VStack>
        </Flex>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "headers" in error &&
        typeof error.status === "number"
    ) {
        return (
            <Flex
                flex={1}
                full
                col
                gap={4}
                as={"main"}
                p={4}
            >
                <VStack itemsStart>
                    <Heading size={"2xl"}>{error.status}</Heading>

                    <Heading size={"lg"}>
                        {error.status === 404
                            ? "Doc could not be found"
                            : error.status === 403
                              ? "Access denied"
                              : "Error"}
                    </Heading>
                </VStack>
            </Flex>
        );
    }

    if (isRouteErrorResponse(error)) {
        return (
            <Flex
                flex={1}
                full
                col
                gap={4}
                as={"main"}
            >
                <VStack itemsStart>
                    <h1>Error</h1>
                    <p>{error.status}</p>
                    <pre>{error.statusText}</pre>
                </VStack>
            </Flex>
        );
    }

    if (error instanceof Error) {
        return (
            <Flex
                flex={1}
                full
                col
                gap={4}
                as={"main"}
                bg={"red/20"}
                p={4}
                rounded={"md"}
            >
                <VStack itemsStart>
                    <Heading color={"error"}>{error.message}</Heading>
                    <pre>{error.stack}</pre>
                </VStack>
            </Flex>
        );
    }

    return <div>Something went wrong</div>;
}