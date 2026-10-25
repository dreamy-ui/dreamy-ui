import fs from "node:fs";

const html = fs.readFileSync(".tmp-home.html", "utf8");
const css = fs.readFileSync(".tmp-index.css", "utf8");

const classes = new Set();
for (const m of html.matchAll(/class="([^"]+)"/g)) {
    for (const c of m[1].split(/\s+/)) classes.add(c);
}

const missing = [];
for (const c of classes) {
    const escaped = c.replace(/!/g, "\\!");
    if (!css.includes(`.${escaped}`) && !css.includes(`.${c}`)) {
        missing.push(c);
    }
}

console.log("total classes", classes.size, "missing", missing.length);
console.log(missing.sort().join("\n"));
