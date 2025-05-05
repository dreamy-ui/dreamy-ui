import type { GetLoadContextFunction } from "@remix-run/express";
import { createRequestHandler } from "@remix-run/express";
import type { AppLoadContext } from "@remix-run/node";
import compression from "compression";
import type { Application } from "express";
import express from "express";
import morgan from "morgan";
import assert from "node:assert";
import type { Server } from "node:http";
import { performance } from "node:perf_hooks";
import redirects from "~/redirects";
import { Logger } from "~/src/.server/logger";
import * as build from "../build/server/index.js";
import pack from "../package.json";

declare module "@remix-run/node" {
    export interface AppLoadContext {
        start: number;
        version: string;
        timings: Record<string, number>;
    }
}

export class ExpressApp {
    private app: Application;
    private server: Server | null = null;
    private observer: PerformanceObserver | null = null;

    constructor() {
        this.app = express();
        this.observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                Logger.debug(entry.name + ": " + entry.duration.toFixed(2) + "ms");
            }
        });
    }

    private async initialize() {
        assert(this.observer);
        this.observer.observe({ type: "measure", buffered: true });

        const getLoadContext: GetLoadContextFunction = () => {
            return {
                start: performance.now(),
                version: pack.version,
                timings: {}
            } satisfies AppLoadContext;
        };

        performance.mark(PerformanceMark.ViteDevServer);
        const viteDevServer =
            process.env.NODE_ENV === "production"
                ? undefined
                : await import("vite").then((vite) =>
                      vite.createServer({
                          server: { middlewareMode: true }
                      })
                  );
        performance.mark(PerformanceMark.ViteDevServerDone);
        performance.measure(
            "Vite dev server",
            PerformanceMark.ViteDevServer,
            PerformanceMark.ViteDevServerDone
        );

        const remixHandler = createRequestHandler({
            build: viteDevServer
                ? async () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
                : (build as any),
            mode: build.mode,
            getLoadContext
        });

        this.app.use(compression());
        this.app.disable("x-powered-by");

        if (viteDevServer) {
            this.app.use(viteDevServer.middlewares);
        } else {
            this.app.use(
                "/assets",
                express.static("build/client/assets", { immutable: true, maxAge: "1y" })
            );
            this.app.use(express.static("public", { maxAge: "1m" }));
        }
        this.app.use(morgan("short"));

        for (const redirect of redirects) {
            this.app.get(redirect.path, (_req, res) => {
                return res.redirect(redirect.redirect);
            });
        }

        this.app.all("*", remixHandler);
    }

    public async run() {
        performance.mark(PerformanceMark.InitializeStart);
        await this.initialize();
        performance.mark(PerformanceMark.InitializeDone);

        const port = Number(process.env.PORT) || 3000;

        performance.mark(PerformanceMark.ListenStart);
        this.server = this.app.listen(port, () => {
            performance.mark(PerformanceMark.ListenDone);
            performance.measure("Listen", PerformanceMark.ListenStart, PerformanceMark.ListenDone);

            Logger.success(`Blazingly fast server started on http://localhost:${port}`);
        });
    }

    public async close() {
        this.server?.close();
    }

    public async reload() {
        await this.close();
        await this.run();
    }

    public getApp() {
        return this.app;
    }

    public getServer() {
        return this.server;
    }
}

enum PerformanceMark {
    InitializeStart = "initialize start",
    InitializeDone = "initialize done",
    ListenStart = "listen start",
    ListenDone = "listen done",
    ServerImport = "server import",
    ServerImportDone = "server import done",
    ViteDevServer = "vite dev server",
    ViteDevServerDone = "vite dev server done",
    RemixHandler = "remix handler",
    RemixHandlerDone = "remix handler done"
}
