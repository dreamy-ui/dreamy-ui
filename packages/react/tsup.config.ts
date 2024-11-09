import { defineConfig } from "tsup";

export default defineConfig((options) => ({
    entry: {
        index: "src/index.ts",
        rsc: "src/rsc.ts"
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: !options.watch,
    minify: !options.watch,
    clean: !options.watch,
    bundle: true,
    splitting: false,
    outDir: "dist",
    external: ["react", "react-dom", "@pandacss/dev", "@dreamy-ui/system", "framer-motion"],
    ...options
}));
