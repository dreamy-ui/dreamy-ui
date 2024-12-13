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
  build: {
    minify: true
  },
  plugins: [
    // Inspect({
    //     build: true
    // }),
    // remixDevTools(),
    mdx({
      development: true
    }),
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
    exclude: ["@dreamy-ui/system", "@dreamy-ui/system/*", "@dreamy-ui/react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPZGVleFxcXFxPbmVEcml2ZVxcXFxQdWxwaXRcXFxcY29kaW5nXFxcXHJlYWN0XFxcXGRyZWFteS11aVxcXFx3ZWJzaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPZGVleFxcXFxPbmVEcml2ZVxcXFxQdWxwaXRcXFxcY29kaW5nXFxcXHJlYWN0XFxcXGRyZWFteS11aVxcXFx3ZWJzaXRlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9PZGVleC9PbmVEcml2ZS9QdWxwaXQvY29kaW5nL3JlYWN0L2RyZWFteS11aS93ZWJzaXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IG1keCBmcm9tIFwiQG1keC1qcy9yb2xsdXBcIjtcclxuaW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peCB9IGZyb20gXCJAcmVtaXgtcnVuL2RldlwiO1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwibm9kZTpmc1wiO1xyXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSBcIm5vZGU6dXJsXCI7XHJcbmltcG9ydCBzb3VyY2VNYXBTdXBwb3J0IGZyb20gXCJzb3VyY2UtbWFwLXN1cHBvcnRcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGJhYmVsIGZyb20gXCJ2aXRlLXBsdWdpbi1iYWJlbFwiO1xyXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xyXG4vLyBpbXBvcnQgcGFuZGFib3ggZnJvbSBcIkBwYW5kYWJveC91bnBsdWdpblwiO1xyXG4vLyBpbXBvcnQgSW5zcGVjdCBmcm9tIFwidml0ZS1wbHVnaW4taW5zcGVjdFwiO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCJAcmVtaXgtcnVuL25vZGVcIiB7XHJcbiAgICAvLyBvciBjbG91ZGZsYXJlLCBkZW5vLCBldGMuXHJcbiAgICBpbnRlcmZhY2UgRnV0dXJlIHtcclxuICAgICAgICB2M19zaW5nbGVGZXRjaDogdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuc291cmNlTWFwU3VwcG9ydC5pbnN0YWxsKHtcclxuICAgIHJldHJpZXZlU291cmNlTWFwOiAoc291cmNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBzb3VyY2Uuc3RhcnRzV2l0aChcImZpbGU6Ly9cIik7XHJcbiAgICAgICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdXJsLmZpbGVVUkxUb1BhdGgoc291cmNlKTtcclxuICAgICAgICAgICAgY29uc3Qgc291cmNlTWFwUGF0aCA9IGAke2ZpbGVQYXRofS5tYXBgO1xyXG4gICAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhzb3VyY2VNYXBQYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHNvdXJjZSxcclxuICAgICAgICAgICAgICAgICAgICBtYXA6IGZzLnJlYWRGaWxlU3luYyhzb3VyY2VNYXBQYXRoLCBcInV0ZjhcIilcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuY29uc3QgcmVhY3RDb21waWxlckNvbmZpZyA9IHtcclxuICAgIHRhcmdldDogXCIxOFwiXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICBtaW5pZnk6IHRydWUsXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIC8vIEluc3BlY3Qoe1xyXG4gICAgICAgIC8vICAgICBidWlsZDogdHJ1ZVxyXG4gICAgICAgIC8vIH0pLFxyXG4gICAgICAgIC8vIHJlbWl4RGV2VG9vbHMoKSxcclxuICAgICAgICBtZHgoe1xyXG4gICAgICAgICAgICBkZXZlbG9wbWVudDogdHJ1ZVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIC8vIHBhbmRhYm94LnZpdGUoe1xyXG4gICAgICAgIC8vICAgICBvcHRpbWl6ZUpzOiBcIm1hY3JvXCIsXHJcbiAgICAgICAgLy8gICAgIGV4Y2x1ZGU6IFtcclxuICAgICAgICAvLyAgICAgICAgIFwiLi9zdHlsZWQtc3lzdGVtXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcInN0eWxlZC1zeXN0ZW1cIixcclxuICAgICAgICAvLyAgICAgICAgIFwic3R5bGVkLXN5c3RlbS8qXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcIi4uL3BhY2thZ2VzLypcIixcclxuICAgICAgICAvLyAgICAgICAgIFwiQGRyZWFteS11aS9zeXN0ZW1cIixcclxuICAgICAgICAvLyAgICAgICAgIFwiQGRyZWFteS11aS9yZWFjdFwiXHJcbiAgICAgICAgLy8gICAgIF1cclxuICAgICAgICAvLyB9KSxcclxuICAgICAgICByZW1peCh7XHJcbiAgICAgICAgICAgIGZ1dHVyZToge1xyXG4gICAgICAgICAgICAgICAgdjNfdGhyb3dBYm9ydFJlYXNvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHYzX3JlbGF0aXZlU3BsYXRQYXRoOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdjNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB2M19sYXp5Um91dGVEaXNjb3Zlcnk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB2M19zaW5nbGVGZXRjaDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHYzX3JvdXRlQ29uZmlnOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuICAgICAgICBiYWJlbCh7XHJcbiAgICAgICAgICAgIGZpbHRlcjogL2FwcFxcLy4qXFwuW2p0XXN4PyQvLFxyXG4gICAgICAgICAgICBiYWJlbENvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgcHJlc2V0czogW1wiQGJhYmVsL3ByZXNldC10eXBlc2NyaXB0XCJdLFxyXG4gICAgICAgICAgICAgICAgcGx1Z2luczogW1tcImJhYmVsLXBsdWdpbi1yZWFjdC1jb21waWxlclwiLCByZWFjdENvbXBpbGVyQ29uZmlnXV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHRzY29uZmlnUGF0aHMoKVxyXG4gICAgXSxcclxuICAgIG9wdGltaXplRGVwczoge1xyXG4gICAgICAgIGV4Y2x1ZGU6IFtcIkBkcmVhbXktdWkvc3lzdGVtXCIsIFwiQGRyZWFteS11aS9zeXN0ZW0vKlwiLCBcIkBkcmVhbXktdWkvcmVhY3RcIl1cclxuICAgIH0sXHJcbiAgICBlc2J1aWxkOiB7XHJcbiAgICAgICAgZXhjbHVkZTogW1wiQGRyZWFteS11aS9zeXN0ZW1cIiwgXCJAZHJlYW15LXVpL3N5c3RlbS8qXCIsIFwiQGRyZWFteS11aS9yZWFjdFwiXSxcclxuICAgIH1cclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlgsT0FBTyxTQUFTO0FBQzNZLFNBQVMsY0FBYyxhQUFhO0FBQ3BDLFlBQVksUUFBUTtBQUNwQixZQUFZLFNBQVM7QUFDckIsT0FBTyxzQkFBc0I7QUFDN0IsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBVzFCLGlCQUFpQixRQUFRO0FBQUEsRUFDckIsbUJBQW1CLENBQUMsV0FBVztBQUMzQixVQUFNLFFBQVEsT0FBTyxXQUFXLFNBQVM7QUFDekMsUUFBSSxPQUFPO0FBQ1AsWUFBTSxXQUFlLGtCQUFjLE1BQU07QUFDekMsWUFBTSxnQkFBZ0IsR0FBRyxRQUFRO0FBQ2pDLFVBQU8sY0FBVyxhQUFhLEdBQUc7QUFDOUIsZUFBTztBQUFBLFVBQ0gsS0FBSztBQUFBLFVBQ0wsS0FBUSxnQkFBYSxlQUFlLE1BQU07QUFBQSxRQUM5QztBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQ0EsV0FBTztBQUFBLEVBQ1g7QUFDSixDQUFDO0FBRUQsSUFBTSxzQkFBc0I7QUFBQSxFQUN4QixRQUFRO0FBQ1o7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixPQUFPO0FBQUEsSUFDSCxRQUFRO0FBQUEsRUFDWjtBQUFBLEVBQ0EsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLTCxJQUFJO0FBQUEsTUFDQSxhQUFhO0FBQUEsSUFDakIsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVlELE1BQU07QUFBQSxNQUNGLFFBQVE7QUFBQSxRQUNKLHFCQUFxQjtBQUFBLFFBQ3JCLHNCQUFzQjtBQUFBLFFBQ3RCLG1CQUFtQjtBQUFBLFFBQ25CLHVCQUF1QjtBQUFBLFFBQ3ZCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ3BCO0FBQUEsSUFDSixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsTUFDRixRQUFRO0FBQUEsTUFDUixhQUFhO0FBQUEsUUFDVCxTQUFTLENBQUMsMEJBQTBCO0FBQUEsUUFDcEMsU0FBUyxDQUFDLENBQUMsK0JBQStCLG1CQUFtQixDQUFDO0FBQUEsTUFDbEU7QUFBQSxJQUNKLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxFQUNsQjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1YsU0FBUyxDQUFDLHFCQUFxQix1QkFBdUIsa0JBQWtCO0FBQUEsRUFDNUU7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLFNBQVMsQ0FBQyxxQkFBcUIsdUJBQXVCLGtCQUFrQjtBQUFBLEVBQzVFO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
