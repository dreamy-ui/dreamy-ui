import { createRequestHandler } from "@react-router/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import "react-router";
import type { ServerBuild } from "react-router";

// virtual:react-router/server-build is not a module
import * as build from "virtual:react-router/server-build";

const DEVELOPMENT = process.env.NODE_ENV === "development";
const PORT = Number.parseInt(process.env.PORT || "3000");

const app = express();

app.use(compression());
app.disable("x-powered-by");

if (DEVELOPMENT) {
    console.log("Starting development server");
    const viteDevServer = await import("vite").then((vite) =>
        vite.createServer({
            server: { middlewareMode: true }
        })
    );
    app.use(viteDevServer.middlewares);
    app.use(morgan("tiny"));
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
} else {
    console.log("Starting production server");
    app.use("/assets", express.static("build/client/assets", { immutable: true, maxAge: "1y" }));
    app.use(express.static("build/client", { maxAge: "1h" }));

    app.use(
        createRequestHandler({
            build
        })
    );
}

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

(["SIGINT", "SIGTERM"] as const).forEach((signal) => {
    process.on(signal, () => {
        server.close();
        process.exit(0);
    });
});
