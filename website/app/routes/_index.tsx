import type { MetaFunction } from "@remix-run/node";
import { CACHE_DURATION, CacheHeaders } from "~/src/.server/cache";
import Main from "~/src/ui/index/Main";

export const meta: MetaFunction = () => {
    return [
        { title: "Dreamy UI - Build performant, websites with ease!" },
        {
            description:
                "Build performant, accessible, websites with ease using Dreamy UI. Level up your UI with next-gen DX."
        }
    ];
};

export const headers = CacheHeaders.cache(CACHE_DURATION.DEFAULT);

export default function Index() {
    return (
        <>
            <Main />

            {/* <Flex
                col
                wFull
            >
                <Features />
            </Flex> */}
        </>
    );
}
