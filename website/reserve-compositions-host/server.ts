import express from "express";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.use(express.static(path.join(__dirname, "../public")));

app.listen(3010, () => {
	console.log("Server is running on port 3010");
});
