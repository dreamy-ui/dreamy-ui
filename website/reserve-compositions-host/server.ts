import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(express.static(path.join(__dirname, "../public")));

const PORT = Number.parseInt(process.env.PORT || "3000");

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
