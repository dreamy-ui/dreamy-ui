import * as build from "virtual:react-router/server-build";
import { createRequestHandler } from "@react-router/express";
import compression from "compression";
import express from "express";
import "react-router";
import { syncDocsFromFilesystem } from "~/src/.server/docs-sync";

await syncDocsFromFilesystem();

const PORT = Number.parseInt(process.env.PORT || "3000");

const app = express();

app.use(compression());
app.disable("x-powered-by");

console.log("Starting production server");
app.use("/assets", express.static("build/client/assets", { immutable: true, maxAge: "1y" }));
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(
    createRequestHandler({
        build
    })
);

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

(["SIGINT", "SIGTERM"] as const).forEach((signal) => {
    process.on(signal, () => {
        server.close();
        process.exit(0);
    });
});
