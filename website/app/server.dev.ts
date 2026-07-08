import http from "node:http";
import { createRequestHandler } from "@react-router/express";
import compression from "compression";
import express from "express";
import "react-router";
import type { ServerBuild } from "react-router";

const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";

const app = express();

app.use(compression());
app.disable("x-powered-by");

console.log("Starting development server");

const server = http.createServer(app);

const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
        appType: "custom",
        server: {
            middlewareMode: true,
            hmr: {
                server,
                clientPort: PORT
            }
        }
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

server.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

(["SIGINT", "SIGTERM"] as const).forEach((signal) => {
    process.on(signal, () => {
        server.close();
        process.exit(0);
    });
});
