import type { ActionFunctionArgs } from "react-router";

export async function loader(_: ActionFunctionArgs) {
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
