import pandacss from "@pandacss/dev/postcss";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
    css: {
        postcss: {
            plugins: [pandacss]
        }
    },
  plugins: [reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
