import cluster from "node:cluster";
import os from "node:os";
import { ExpressApp } from "server/app";
import { Logger } from "~/src/.server/logger";

if (cluster.isPrimary) {
    const cores =
        process.env.NODE_ENV === "production" ? Number(process.env.CORES) || os.cpus().length : 1;

    for (let i = 0; i < cores; i++) {
        const worker = cluster.fork();

        worker.on("online", () => {
            Logger.info(`Worker ${worker.process.pid} is online`);
        });
    }

    cluster.on("exit", (worker) => {
        Logger.error(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    const app = new ExpressApp();
    app.run();

    process.on("SIGINT", () => {
        app.close();
        process.exit(0);
    });
}
