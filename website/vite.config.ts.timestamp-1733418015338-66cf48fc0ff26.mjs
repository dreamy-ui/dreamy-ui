// vite.config.ts
import mdx from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/@mdx-js+rollup@3.1.0_acorn@8.14.0_rollup@4.28.0/node_modules/@mdx-js/rollup/index.js";
import { vitePlugin as remix } from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/@remix-run+dev@2.15.0_@remix-run+react@2.15.0_react-dom@18.3.1_react@18.3.1__react@18.3.1_typ_57w6ixs4jhmgnjpw2zqc3miugi/node_modules/@remix-run/dev/dist/index.js";
import * as fs from "node:fs";
import * as url from "node:url";
import sourceMapSupport from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/source-map-support@0.5.21/node_modules/source-map-support/source-map-support.js";
import { defineConfig } from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/vite@5.4.11_@types+node@22.10.1_lightningcss@1.25.1/node_modules/vite/dist/node/index.js";
import babel from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/vite-plugin-babel@1.3.0_@babel+core@7.26.0_vite@5.4.11_@types+node@22.10.1_lightningcss@1.25.1_/node_modules/vite-plugin-babel/dist/index.mjs";
import tsconfigPaths from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.7.2_vite@5.4.11_@types+node@22.10.1_lightningcss@1.25.1_/node_modules/vite-tsconfig-paths/dist/index.mjs";
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
var reactCompilerConfig = {
  target: "18"
};
var vite_config_default = defineConfig({
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
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true,
        v3_routeConfig: true
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
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPZGVleFxcXFxPbmVEcml2ZVxcXFxQdWxwaXRcXFxcY29kaW5nXFxcXHJlYWN0XFxcXGRyZWFteS11aVxcXFx3ZWJzaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPZGVleFxcXFxPbmVEcml2ZVxcXFxQdWxwaXRcXFxcY29kaW5nXFxcXHJlYWN0XFxcXGRyZWFteS11aVxcXFx3ZWJzaXRlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9PZGVleC9PbmVEcml2ZS9QdWxwaXQvY29kaW5nL3JlYWN0L2RyZWFteS11aS93ZWJzaXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IG1keCBmcm9tIFwiQG1keC1qcy9yb2xsdXBcIjtcclxuaW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peCB9IGZyb20gXCJAcmVtaXgtcnVuL2RldlwiO1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwibm9kZTpmc1wiO1xyXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSBcIm5vZGU6dXJsXCI7XHJcbmltcG9ydCBzb3VyY2VNYXBTdXBwb3J0IGZyb20gXCJzb3VyY2UtbWFwLXN1cHBvcnRcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGJhYmVsIGZyb20gXCJ2aXRlLXBsdWdpbi1iYWJlbFwiO1xyXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xyXG4vLyBpbXBvcnQgcGFuZGFib3ggZnJvbSBcIkBwYW5kYWJveC91bnBsdWdpblwiO1xyXG4vLyBpbXBvcnQgSW5zcGVjdCBmcm9tIFwidml0ZS1wbHVnaW4taW5zcGVjdFwiO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCJAcmVtaXgtcnVuL25vZGVcIiB7XHJcbiAgICAvLyBvciBjbG91ZGZsYXJlLCBkZW5vLCBldGMuXHJcbiAgICBpbnRlcmZhY2UgRnV0dXJlIHtcclxuICAgICAgICB2M19zaW5nbGVGZXRjaDogdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuc291cmNlTWFwU3VwcG9ydC5pbnN0YWxsKHtcclxuICAgIHJldHJpZXZlU291cmNlTWFwOiAoc291cmNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBzb3VyY2Uuc3RhcnRzV2l0aChcImZpbGU6Ly9cIik7XHJcbiAgICAgICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdXJsLmZpbGVVUkxUb1BhdGgoc291cmNlKTtcclxuICAgICAgICAgICAgY29uc3Qgc291cmNlTWFwUGF0aCA9IGAke2ZpbGVQYXRofS5tYXBgO1xyXG4gICAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhzb3VyY2VNYXBQYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHNvdXJjZSxcclxuICAgICAgICAgICAgICAgICAgICBtYXA6IGZzLnJlYWRGaWxlU3luYyhzb3VyY2VNYXBQYXRoLCBcInV0ZjhcIilcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuY29uc3QgcmVhY3RDb21waWxlckNvbmZpZyA9IHtcclxuICAgIHRhcmdldDogXCIxOFwiXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIC8vIEluc3BlY3Qoe1xyXG4gICAgICAgIC8vICAgICBidWlsZDogdHJ1ZVxyXG4gICAgICAgIC8vIH0pLFxyXG4gICAgICAgIC8vIHJlbWl4RGV2VG9vbHMoKSxcclxuICAgICAgICBtZHgoKSxcclxuICAgICAgICAvLyBwYW5kYWJveC52aXRlKHtcclxuICAgICAgICAvLyAgICAgb3B0aW1pemVKczogXCJtYWNyb1wiLFxyXG4gICAgICAgIC8vICAgICBleGNsdWRlOiBbXHJcbiAgICAgICAgLy8gICAgICAgICBcIi4vc3R5bGVkLXN5c3RlbVwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJzdHlsZWQtc3lzdGVtXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcInN0eWxlZC1zeXN0ZW0vKlwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCIuLi9wYWNrYWdlcy8qXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcIkBkcmVhbXktdWkvc3lzdGVtXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcIkBkcmVhbXktdWkvcmVhY3RcIlxyXG4gICAgICAgIC8vICAgICBdXHJcbiAgICAgICAgLy8gfSksXHJcbiAgICAgICAgcmVtaXgoe1xyXG4gICAgICAgICAgICBmdXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHYzX3Rocm93QWJvcnRSZWFzb246IHRydWUsXHJcbiAgICAgICAgICAgICAgICB2M19yZWxhdGl2ZVNwbGF0UGF0aDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHYzX2ZldGNoZXJQZXJzaXN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdjNfbGF6eVJvdXRlRGlzY292ZXJ5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdjNfc2luZ2xlRmV0Y2g6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB2M19yb3V0ZUNvbmZpZzogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgYmFiZWwoe1xyXG4gICAgICAgICAgICBmaWx0ZXI6IC9hcHBcXC8uKlxcLltqdF1zeD8kLyxcclxuICAgICAgICAgICAgYmFiZWxDb25maWc6IHtcclxuICAgICAgICAgICAgICAgIHByZXNldHM6IFtcIkBiYWJlbC9wcmVzZXQtdHlwZXNjcmlwdFwiXSxcclxuICAgICAgICAgICAgICAgIHBsdWdpbnM6IFtbXCJiYWJlbC1wbHVnaW4tcmVhY3QtY29tcGlsZXJcIiwgcmVhY3RDb21waWxlckNvbmZpZ11dXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuICAgICAgICB0c2NvbmZpZ1BhdGhzKClcclxuICAgIF0sXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgICBleGNsdWRlOiBbXCJAZHJlYW15LXVpL3N5c3RlbVwiLCBcIkBkcmVhbXktdWkvc3lzdGVtLypcIiwgXCJAZHJlYW15LXVpL3JlYWN0XCJdXHJcbiAgICB9LFxyXG4gICAgZXNidWlsZDoge1xyXG4gICAgICAgIGV4Y2x1ZGU6IFtcIkBkcmVhbXktdWkvc3lzdGVtXCIsIFwiQGRyZWFteS11aS9zeXN0ZW0vKlwiLCBcIkBkcmVhbXktdWkvcmVhY3RcIl0sXHJcbiAgICAgICAgbWluaWZ5U3ludGF4OiB0cnVlLFxyXG4gICAgICAgIG1pbmlmeUlkZW50aWZpZXJzOiB0cnVlLFxyXG4gICAgICAgIG1pbmlmeVdoaXRlc3BhY2U6IHRydWUsXHJcbiAgICAgICAgdHJlZVNoYWtpbmc6IHRydWVcclxuICAgIH1cclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlgsT0FBTyxTQUFTO0FBQzNZLFNBQVMsY0FBYyxhQUFhO0FBQ3BDLFlBQVksUUFBUTtBQUNwQixZQUFZLFNBQVM7QUFDckIsT0FBTyxzQkFBc0I7QUFDN0IsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBVzFCLGlCQUFpQixRQUFRO0FBQUEsRUFDckIsbUJBQW1CLENBQUMsV0FBVztBQUMzQixVQUFNLFFBQVEsT0FBTyxXQUFXLFNBQVM7QUFDekMsUUFBSSxPQUFPO0FBQ1AsWUFBTSxXQUFlLGtCQUFjLE1BQU07QUFDekMsWUFBTSxnQkFBZ0IsR0FBRyxRQUFRO0FBQ2pDLFVBQU8sY0FBVyxhQUFhLEdBQUc7QUFDOUIsZUFBTztBQUFBLFVBQ0gsS0FBSztBQUFBLFVBQ0wsS0FBUSxnQkFBYSxlQUFlLE1BQU07QUFBQSxRQUM5QztBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQ0EsV0FBTztBQUFBLEVBQ1g7QUFDSixDQUFDO0FBRUQsSUFBTSxzQkFBc0I7QUFBQSxFQUN4QixRQUFRO0FBQ1o7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtMLElBQUk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFZSixNQUFNO0FBQUEsTUFDRixRQUFRO0FBQUEsUUFDSixxQkFBcUI7QUFBQSxRQUNyQixzQkFBc0I7QUFBQSxRQUN0QixtQkFBbUI7QUFBQSxRQUNuQix1QkFBdUI7QUFBQSxRQUN2QixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNwQjtBQUFBLElBQ0osQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLE1BQ0YsUUFBUTtBQUFBLE1BQ1IsYUFBYTtBQUFBLFFBQ1QsU0FBUyxDQUFDLDBCQUEwQjtBQUFBLFFBQ3BDLFNBQVMsQ0FBQyxDQUFDLCtCQUErQixtQkFBbUIsQ0FBQztBQUFBLE1BQ2xFO0FBQUEsSUFDSixDQUFDO0FBQUEsSUFDRCxjQUFjO0FBQUEsRUFDbEI7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNWLFNBQVMsQ0FBQyxxQkFBcUIsdUJBQXVCLGtCQUFrQjtBQUFBLEVBQzVFO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxTQUFTLENBQUMscUJBQXFCLHVCQUF1QixrQkFBa0I7QUFBQSxJQUN4RSxjQUFjO0FBQUEsSUFDZCxtQkFBbUI7QUFBQSxJQUNuQixrQkFBa0I7QUFBQSxJQUNsQixhQUFhO0FBQUEsRUFDakI7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
