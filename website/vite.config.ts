import mdx from "@mdx-js/rollup";
import pandacss from "@pandacss/dev/postcss";
import { reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";
// import pandabox from "@pandabox/unplugin";
// import Inspect from "vite-plugin-inspect";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";
import circleDependency from "vite-plugin-circular-dependency";

export default defineConfig({
    css: {
        postcss: {
            plugins: [pandacss as any, autoprefixer]
        }
    },
    environments: {
        ssr: {
            build: {
                target: "esnext",
                minify: true,
                rollupOptions: {
                    input: "./app/server.prod.ts"
                }
            }
        }
    },
    plugins: [
        // Inspect({
        //     build: true
        // }),
        // remixDevTools(),
        circleDependency(),
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
            presets: [reactCompilerPreset()],
            exclude: [/node_modules/, /packages[\\/]react[\\/]/]
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
            "@dreamy-ui/react/rsc",
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
});
