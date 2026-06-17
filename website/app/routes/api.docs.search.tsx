import { data } from "react-router";
import { Docs } from "~/src/.server/docs";
import { invariant } from "~/src/functions/invariant";
import type { Route } from "./+types/api.docs.search";

export async function action({ request }: Route.ActionArgs) {
    try {
        const form = await request.formData();

        const query = form.get("query") as string;

        invariant(query, "query is required");

        if (query.length < 1 || query.length > 100) {
            throw new Error("query must be between 1 and 100 characters");
        }

        const docs = await Docs.searchDocs(query);

        return {
            docs
        };
    } catch (e) {
        if (e instanceof Error) {
            console.log(e);
            return data({ error: e.message }, { status: 500 });
        }
        throw e;
    }
}
