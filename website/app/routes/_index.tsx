import { Flex } from "@dreamy-ui/react/rsc";
import { type MetaFunction, data } from "@remix-run/node";
import { CACHE_DURATION, CacheHeaders, cachified } from "~/src/.server/cache";
import { getLandingPageCodes } from "~/src/.server/codes";
import BuiltFor from "~/src/ui/pages/landing/BuiltFor";
import Communities from "~/src/ui/pages/landing/Community";
import EverythingYouNeed from "~/src/ui/pages/landing/EverythingYouNeed";
import Features from "~/src/ui/pages/landing/Features";
import FloatingComponents from "~/src/ui/pages/landing/FloatingComponents";
import Main from "~/src/ui/pages/landing/Main";

export const meta: MetaFunction = () => {
    return [
        { title: "Dreamy UI - Build websites with next-gen DX!" },
        {
            description:
                "Build performant, accessible, websites with ease using Dreamy UI. Level up your UI with next-gen DX."
        },
        {
            property: "og:title",
            content: "Build performant, accessible websites with Dreamy UI"
        },
        {
            property: "image",
            content: "/dreamy-ui-wallpaper.png"
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
            content: "Dreamy UI - Build websites with next-gen DX!"
        },
        {
            property: "og:description",
            content:
                "Build performant, accessible, websites with ease using Dreamy UI. Level up your UI with next-gen DX."
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
            content: "Build performant, accessible websites with Dreamy UI"
        },
        {
            name: "twitter:description",
            content:
                "Build performant, accessible, websites with ease using Dreamy UI. Level up your UI with next-gen DX."
        },
        {
            name: "twitter:image",
            content: "/dreamy-ui-wallpaper.png"
        }
    ];
};

export async function loader() {
    const codes = await cachified({
        key: "landing-page-codes",
        getFreshValue: getLandingPageCodes,
        staleWhileRevalidate: CACHE_DURATION.ONE_MONTH
    });

    return data(codes, {
        headers: CacheHeaders.cache(CACHE_DURATION.DEFAULT, undefined, true)
    });
}

export const headers = CacheHeaders.cache(CACHE_DURATION.DEFAULT);

export default function Index() {
    return (
        <Flex
            full
            col
            gap={{
                base: 24,
                xl: 40
            }}
            mb={20}
        >
            <Main />
            <FloatingComponents />
            <BuiltFor />
            <Features />
            <EverythingYouNeed />
            <Communities />
        </Flex>
    );
}
