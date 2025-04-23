import { cachified } from "~/src/.server/cache";
import { daysToMs } from "~/src/.server/docs";
import { env } from "~/src/.server/env";
import { getFullLLMDocs } from "~/src/.server/llms";

export async function loader() {
    const docs = await cachified({
        key: "llms.txt",
        getFreshValue: getFullLLMDocs,
        ttl: env.NODE_ENV === "production" ? daysToMs(1) : 0,
        swr: env.NODE_ENV === "production" ? daysToMs(7) : 0
    });

    return new Response(docs, {
        headers: {
            "Content-Type": "text/plain"
        }
    });
}
