import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Docs } from "~/src/.server/docs";

export async function loader(_: LoaderFunctionArgs) {
    const firstSection = Docs.getDocsAsArray()[0];

    throw redirect(`/docs/${firstSection[0]}/${firstSection[1].files[0].filename}`);
}
