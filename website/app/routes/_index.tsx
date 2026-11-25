import { Box, Flex, Grid } from "@/ui";
import { readFile } from "node:fs/promises";
import { data } from "react-router";
import { CACHE_DURATION, CacheHeaders, cachified } from "~/src/.server/cache";
import { getLandingPageCodes } from "~/src/.server/codes";
import { hourToMs } from "~/src/.server/docs";
import { env } from "~/src/.server/env";
import { getGithubStars } from "~/src/.server/github";
import AiFirst from "~/src/ui/pages/landing/AiFirst";
import BuiltFor from "~/src/ui/pages/landing/BuiltFor";
import Communities from "~/src/ui/pages/landing/Community";
import EverythingYouNeed from "~/src/ui/pages/landing/EverythingYouNeed";
import Features from "~/src/ui/pages/landing/Features";
import FloatingComponents from "~/src/ui/pages/landing/FloatingComponents";
import Main from "~/src/ui/pages/landing/Main";
import type { Route } from "./+types/_index";

export const meta: Route.MetaFunction = () => {
    return [
        { title: "Dreamy UI - AI-First React Component Library" },
        {
            property: "description",
            content:
                "Build performant, accessible React interfaces for humans and AI agents. Zero-runtime CSS powered by Panda CSS, with native MCP, Skills, and llms.txt support."
        },
        {
            property: "og:image",
            content: "/dreamy-ui-wallpaper.png"
        },
        {
            property: "og:image:width",
            content: "2560"
        },
        {
            property: "og:image:height",
            content: "1080"
        },
        {
            property: "og:image:type",
            content: "image/png"
        },
        {
            property: "og:title",
            content: "Dreamy UI - AI-First React Component Library"
        },
        {
            property: "og:description",
            content:
                "Build performant, accessible React interfaces for humans and AI agents. Zero-runtime CSS powered by Panda CSS, with native MCP, Skills, and llms.txt support."
        },
        {
            name: "og:url",
            content: "https://dreamy-ui.com"
        },
        // twitter
        {
            name: "twitter:card",
            content: "summary_large_image"
        },
        {
            name: "twitter:title",
            content: "Dreamy UI - AI-First React Component Library"
        },
        {
            name: "twitter:description",
            content:
                "Build performant, accessible React interfaces for humans and AI agents. Zero-runtime CSS powered by Panda CSS."
        },
        {
            name: "twitter:image",
            content: "/dreamy-ui-wallpaper.png"
        }
    ];
};

export async function loader() {
    const [codes, githubStars] = await Promise.all([
        cachified({
            key: "landing-page-codes",
            getFreshValue: getLandingPageCodes,
            ttl: process.env.NODE_ENV === "production" ? CACHE_DURATION.ONE_MONTH : 0,
            staleWhileRevalidate: env.NODE_ENV === "production" ? CACHE_DURATION.ONE_MONTH : 0
        }),
        cachified({
            key: "github-stars",
            getFreshValue: getGithubStars,
            ttl: env.NODE_ENV === "production" ? hourToMs(3) : 0,
            swr: env.NODE_ENV === "production" ? CACHE_DURATION.ONE_MONTH : 0
        })
    ]);

    const packageJson = await readFile("package.json", "utf-8");
    const version = JSON.parse(packageJson as string).version || "2";

    return data(
        {
            ...codes,
            githubStars,
            version
        },
        {
            headers: CacheHeaders.cache(CACHE_DURATION.DEFAULT, undefined, true)
        }
    );
}

export const headers = CacheHeaders.cache(CACHE_DURATION.DEFAULT);

function SectionDivider() {
    return (
        <Flex
            align={"center"}
            aria-hidden="true"
            justify={"center"}
            pos={"relative"}
            w={"full"}
        >
            <Box
                h={"1px"}
                maxW={"3xl"}
                style={{
                    background:
                        "linear-gradient(90deg, transparent 0%, var(--colors-border) 50%, transparent 100%)"
                }}
                w={"full"}
            />
            <Box
                bg={"primary/50"}
                boxSize={"1.5"}
                pos={"absolute"}
                rounded={"xs"}
                style={{ transform: "rotate(45deg)" }}
            />
        </Flex>
    );
}

export default function Index() {
    return (
        <Flex
            col
            full
            gap={{
                base: 20,
                md: 28,
                xl: 32
            }}
            mb={20}
        >
            {/* Hero: two-column layout so interactive sandbox stays in viewport */}
            <Grid
                alignItems={"center"}
                columns={{ base: 1, lg: 2 }}
                full
                gap={{ base: 12, lg: 14 }}
                minH={{ base: "auto", lg: "calc(100vh - 160px)" }}
                py={{ base: 6, lg: 4 }}
            >
                <Main />
                <FloatingComponents />
            </Grid>

            <BuiltFor />
            <SectionDivider />
            <AiFirst />
            <EverythingYouNeed />
            <Features />
            <SectionDivider />
            <Communities />
        </Flex>
    );
}
