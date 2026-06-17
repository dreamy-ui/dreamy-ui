import { createRequestHandler } from "@react-router/express";
import compression from "compression";
import express from "express";
import "react-router";
import type { ServerBuild } from "react-router";
import { syncDocsFromFilesystem } from "~/src/.server/docs-sync";

await syncDocsFromFilesystem();

const PORT = Number.parseInt(process.env.PORT || "3000");

const app = express();

app.use(compression());
app.disable("x-powered-by");

console.log("Starting development server");
const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
        server: { middlewareMode: true }
    })
);
app.use(viteDevServer.middlewares);
app.use(async (req, res, next) => {
    try {
        const source = await viteDevServer.ssrLoadModule("virtual:react-router/server-build");
        return createRequestHandler({
            build: source as unknown as ServerBuild
        })(req, res, next);
    } catch (error) {
        if (typeof error === "object" && error instanceof Error) {
            viteDevServer.ssrFixStacktrace(error);
        }
        next(error);
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

(["SIGINT", "SIGTERM"] as const).forEach((signal) => {
    process.on(signal, () => {
        server.close();
        process.exit(0);
    });
});
