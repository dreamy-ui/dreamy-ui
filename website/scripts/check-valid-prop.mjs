import fs from "node:fs";
import { isCssProperty } from "../styled-system/jsx/is-valid-prop.js";

const s = fs.readFileSync("./styled-system/jsx/is-valid-prop.js", "utf8");
const m = s.match(/new Set\(\[([^\]]+)\]/);
const arr = m[1].split(",").map((x) => x.trim().replaceAll('"', ""));
console.log("set has maxW", arr.includes("maxW"));
console.log("set has maxWidth", arr.includes("maxWidth"));
console.log("fn maxW", isCssProperty("maxW"));
console.log("fn boxSize", isCssProperty("boxSize"));
