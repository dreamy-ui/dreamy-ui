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
        { title: "Dreamy UI - Build performant, websites with ease!" },
        {
            description:
                "Build performant, accessible, websites with ease using Dreamy UI. Level up your UI with next-gen DX."
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
            wFull
            col
            gap={20}
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
