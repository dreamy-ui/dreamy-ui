import pandacss from "@pandacss/dev/postcss";
import { reactRouter } from "@react-router/dev/vite";

import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    css: {
        postcss: {
            plugins: [pandacss]
        }
    },
  plugins: [reactRouter(), tsconfigPaths()],
});
