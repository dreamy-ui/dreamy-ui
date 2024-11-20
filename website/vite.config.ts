import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import * as fs from "node:fs";
import * as url from "node:url";
import sourceMapSupport from "source-map-support";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";
// import pandabox from "@pandabox/unplugin";
// import Inspect from "vite-plugin-inspect";

installGlobals({ nativeFetch: false });
sourceMapSupport.install({
    retrieveSourceMap: (source) => {
        const match = source.startsWith("file://");
        if (match) {
            const filePath = url.fileURLToPath(source);
            const sourceMapPath = `${filePath}.map`;
            if (fs.existsSync(sourceMapPath)) {
                return {
                    url: source,
                    map: fs.readFileSync(sourceMapPath, "utf8")
                };
            }
        }
        return null;
    }
});

const reactCompilerConfig = {
    target: "18"
};

export default defineConfig({
    plugins: [
        // Inspect({
        //     build: true
        // }),
        // remixDevTools(),
        mdx(),
        // pandabox.vite({
        //     optimizeJs: "macro",
        //     exclude: [
        //         "./styled-system",
        //         "styled-system",
        //         "styled-system/*",
        //         "../packages/*",
        //         "@dreamy-ui/system",
        //         "@dreamy-ui/react"
        //     ]
        // }),
        remix({
            future: {
                v3_throwAbortReason: true,
                v3_relativeSplatPath: true,
                v3_fetcherPersist: true,
                v3_lazyRouteDiscovery: false
            }
        }),
        babel({
            filter: /app\/.*\.[jt]sx?$/,
            babelConfig: {
                presets: ["@babel/preset-typescript"],
                plugins: [["babel-plugin-react-compiler", reactCompilerConfig]]
            }
        }),
        tsconfigPaths()
    ],
    optimizeDeps: {
        exclude: ["@dreamy-ui/system", "@dreamy-ui/system/*", "@dreamy-ui/react"]
    },
    esbuild: {
        exclude: ["@dreamy-ui/system", "@dreamy-ui/system/*", "@dreamy-ui/react"],
        minifySyntax: true,
        minifyIdentifiers: true,
        minifyWhitespace: true,
        treeShaking: true
    }
});
