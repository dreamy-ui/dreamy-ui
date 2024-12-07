export function requirePost(request: Request) {
    if (request.method !== "POST") {
        throw Response.json({ error: "Method not allowed" }, { status: 405 });
    }
}
