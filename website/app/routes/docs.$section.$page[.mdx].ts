import { Docs } from "~/src/.server/docs";
import type { Route } from "./+types/docs.$section.$page[.mdx]";
import { getTimings } from "~/src/.server/middlewares";

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

	if (!doc || !doc.content) {
		throw new Response(null, {
			status: 404,
			statusText: "Page Not Found"
		});
	}

	return new Response(doc.content, {
		headers: {
			"Content-Type": "text/markdown"
		}
	});
}
