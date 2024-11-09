import type { GetLoadContextFunction } from "@remix-run/express";
import { createRequestHandler } from "@remix-run/express";
import type { AppLoadContext } from "@remix-run/node";
import compression from "compression";
import type { Application } from "express";
import express from "express";
import morgan from "morgan";
import assert from "node:assert";
import * as fs from "node:fs";
import type { Server } from "node:http";
import * as path from "node:path";
import { performance } from "node:perf_hooks";
import * as url from "node:url";
import { Logger } from "~/src/.server/logger";
import pack from "../package.json";

declare module "@remix-run/node" {
    export interface AppLoadContext {
        start: number;
        version: string;
    }
}

const BUILD_PATH = path.resolve("build/server/index.js");

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

        performance.mark(PerformanceMark.ServerImport);
        const initialBuild = await this.reimportServer();
        performance.mark(PerformanceMark.ServerImportDone);
        performance.measure(
            "Server import",
            PerformanceMark.ServerImport,
            PerformanceMark.ServerImportDone
        );

        const getLoadContext: GetLoadContextFunction = () => {
            return {
                start: performance.now(),
                version: pack.version
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
                : await this.reimportServer(),
            mode: initialBuild.mode,
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
            this.app.use(express.static("public", { maxAge: "1h" }));
        }
        this.app.use(morgan("short"));

        this.app.all("*", remixHandler);
    }

    private async reimportServer() {
        const stat = fs.statSync(BUILD_PATH);
        const BUILD_URL = url.pathToFileURL(BUILD_PATH).href;

        return await import(BUILD_URL + "?t=" + stat.mtimeMs);
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
