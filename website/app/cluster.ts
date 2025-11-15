import cluster from "node:cluster";
import os from "node:os";
import { Logger } from "./src/.server/logger";

if (cluster.isPrimary) {
    const logo =
        " (                                       (     \n )\\ )                                    )\\ )  \n(()/(  (     (    )    )    (         ( (()/(  \n /(_)) )(   ))\\( /(   (     )\\ )      )\\ /(_)) \n(_))_ (()\\ /((_)(_))  )\\  '(()/(   _ ((_|_))   \n |   \\ ((_|_))((_)_ _((_))  )(_)) | | | |_ _|  \n | |) | '_/ -_) _` | '  \\()| || | | |_| || |   \n |___/|_| \\___\\__,_|_|_|_|  \\_, |  \\___/|___|  \n                            |__/               ";

    Logger.custom(logo, "magenta", undefined, true);

    cluster.setupPrimary({
        exec: "./build/server/index.js",
        stdio: ["inherit", "inherit", "inherit", "ipc"]
    });

    for (let i = 0; i < (process.env.NODE_ENV === "production" ? os.cpus().length : 1); i++) {
        const worker = cluster.fork();

        worker.on("online", () => {
            Logger.info(`Worker ${worker.process.pid} is online`);
        });
    }

    cluster.on("exit", (worker) => {
        Logger.error(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
}
