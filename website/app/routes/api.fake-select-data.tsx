import type { Route } from "./+types/api.fake-select-data";

export async function loader(_: Route.LoaderArgs) {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	return Response.json([
		"strawberry",
		"banana",
		"orange",
		"apple",
		"pear",
		"peach",
		"plum",
		"pineapple",
		"pomegranate",
		"raspberry",
		"watermelon"
	]);
}
