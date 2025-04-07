import { cachified } from "~/src/.server/cache";
import { daysToMs } from "~/src/.server/docs";
import { getFullLLMDocs } from "~/src/.server/llms";

export async function loader() {
    const docs = await cachified({
        key: "llms.txt",
        getFreshValue: getFullLLMDocs,
        ttl: daysToMs(1),
        swr: daysToMs(7)
    });

    return new Response(docs, {
        headers: {
            "Content-Type": "text/plain"
        }
    });
}
