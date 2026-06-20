import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
// import pandabox from "@pandabox/unplugin";
// import Inspect from "vite-plugin-inspect";
import babel from "vite-plugin-babel";

export default defineConfig(({ isSsrBuild }) => {
    return {
        build: {
            minify: true,
            target: "esnext",
            rollupOptions: isSsrBuild
                ? {
                      input: ["./app/server.prod.ts", "./app/cluster.ts"]
                  }
                : undefined
        },
        plugins: [
            // Inspect({
            //     build: true
            // }),
            mdx({
                development: true
            }) as any,
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
            reactRouter(),
            babel({
                filter: /app\/.*\.[jt]sx?$/,
                babelConfig: {
                    presets: ["@babel/preset-typescript"],
                    plugins: ["babel-plugin-react-compiler"]
                }
            })
        ],
        optimizeDeps: {
            // rolldownOptions: {
            //     loader: {
            //         ".js": "jsx"
            //     }
            // },
            exclude: [
                "@dreamy-ui/panda-preset",
                "@dreamy-ui/react",
                "styled-system/css",
                "styled-system/jsx",
                "styled-system/patterns",
                "styled-system/recipes",
                "styled-system/token",
                "styled-system/types",
                "styled-system",
                "@resvg/resvg-js"
            ]
        },
        resolve: {
            tsconfigPaths: true
        }
    };
});
