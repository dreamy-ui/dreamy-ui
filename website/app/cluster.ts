import cluster from "node:cluster";
import os from "node:os";
import { Logger } from "./src/.server/logger";

if (cluster.isPrimary && process.env.NODE_ENV === "production") {
	for (let i = 0; i < os.cpus().length; i++) {
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
	import("./server");
}
