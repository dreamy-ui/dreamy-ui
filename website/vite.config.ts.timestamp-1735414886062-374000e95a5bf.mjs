// vite.config.ts
import mdx from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/@mdx-js+rollup@3.1.0_acorn@8.14.0_rollup@4.28.1/node_modules/@mdx-js/rollup/index.js";
import { vitePlugin as remix } from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/@remix-run+dev@2.15.1_@remix-run+react@2.15.1_react-dom@19.0.0_react@19.0.0__react@19.0.0_typ_4zttzfroaampjlkqdosqxoi6fq/node_modules/@remix-run/dev/dist/index.js";
import * as fs from "node:fs";
import * as url from "node:url";
import sourceMapSupport from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/source-map-support@0.5.21/node_modules/source-map-support/source-map-support.js";
import { defineConfig } from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/vite@5.4.11_@types+node@22.10.2_lightningcss@1.25.1/node_modules/vite/dist/node/index.js";
import babel from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/vite-plugin-babel@1.3.0_@babel+core@7.26.0_vite@5.4.11_@types+node@22.10.2_lightningcss@1.25.1_/node_modules/vite-plugin-babel/dist/index.mjs";
import tsconfigPaths from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.7.2_vite@5.4.11_@types+node@22.10.2_lightningcss@1.25.1_/node_modules/vite-tsconfig-paths/dist/index.mjs";
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
  target: "19"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPZGVleFxcXFxPbmVEcml2ZVxcXFxQdWxwaXRcXFxcY29kaW5nXFxcXHJlYWN0XFxcXGRyZWFteS11aVxcXFx3ZWJzaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPZGVleFxcXFxPbmVEcml2ZVxcXFxQdWxwaXRcXFxcY29kaW5nXFxcXHJlYWN0XFxcXGRyZWFteS11aVxcXFx3ZWJzaXRlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9PZGVleC9PbmVEcml2ZS9QdWxwaXQvY29kaW5nL3JlYWN0L2RyZWFteS11aS93ZWJzaXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IG1keCBmcm9tIFwiQG1keC1qcy9yb2xsdXBcIjtcclxuaW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peCB9IGZyb20gXCJAcmVtaXgtcnVuL2RldlwiO1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwibm9kZTpmc1wiO1xyXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSBcIm5vZGU6dXJsXCI7XHJcbmltcG9ydCBzb3VyY2VNYXBTdXBwb3J0IGZyb20gXCJzb3VyY2UtbWFwLXN1cHBvcnRcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGJhYmVsIGZyb20gXCJ2aXRlLXBsdWdpbi1iYWJlbFwiO1xyXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xyXG4vLyBpbXBvcnQgcGFuZGFib3ggZnJvbSBcIkBwYW5kYWJveC91bnBsdWdpblwiO1xyXG4vLyBpbXBvcnQgSW5zcGVjdCBmcm9tIFwidml0ZS1wbHVnaW4taW5zcGVjdFwiO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCJAcmVtaXgtcnVuL25vZGVcIiB7XHJcbiAgICBpbnRlcmZhY2UgRnV0dXJlIHtcclxuICAgICAgICB2M19zaW5nbGVGZXRjaDogdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuc291cmNlTWFwU3VwcG9ydC5pbnN0YWxsKHtcclxuICAgIHJldHJpZXZlU291cmNlTWFwOiAoc291cmNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBzb3VyY2Uuc3RhcnRzV2l0aChcImZpbGU6Ly9cIik7XHJcbiAgICAgICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdXJsLmZpbGVVUkxUb1BhdGgoc291cmNlKTtcclxuICAgICAgICAgICAgY29uc3Qgc291cmNlTWFwUGF0aCA9IGAke2ZpbGVQYXRofS5tYXBgO1xyXG4gICAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhzb3VyY2VNYXBQYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHNvdXJjZSxcclxuICAgICAgICAgICAgICAgICAgICBtYXA6IGZzLnJlYWRGaWxlU3luYyhzb3VyY2VNYXBQYXRoLCBcInV0ZjhcIilcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuY29uc3QgcmVhY3RDb21waWxlckNvbmZpZyA9IHtcclxuICAgIHRhcmdldDogXCIxOVwiXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICBtaW5pZnk6IHRydWVcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgLy8gSW5zcGVjdCh7XHJcbiAgICAgICAgLy8gICAgIGJ1aWxkOiB0cnVlXHJcbiAgICAgICAgLy8gfSksXHJcbiAgICAgICAgLy8gcmVtaXhEZXZUb29scygpLFxyXG4gICAgICAgIG1keCh7XHJcbiAgICAgICAgICAgIGRldmVsb3BtZW50OiB0cnVlXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgLy8gcGFuZGFib3gudml0ZSh7XHJcbiAgICAgICAgLy8gICAgIG9wdGltaXplSnM6IFwibWFjcm9cIixcclxuICAgICAgICAvLyAgICAgZXhjbHVkZTogW1xyXG4gICAgICAgIC8vICAgICAgICAgXCIuL3N0eWxlZC1zeXN0ZW1cIixcclxuICAgICAgICAvLyAgICAgICAgIFwic3R5bGVkLXN5c3RlbVwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJzdHlsZWQtc3lzdGVtLypcIixcclxuICAgICAgICAvLyAgICAgICAgIFwiLi4vcGFja2FnZXMvKlwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJAZHJlYW15LXVpL3N5c3RlbVwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJAZHJlYW15LXVpL3JlYWN0XCJcclxuICAgICAgICAvLyAgICAgXVxyXG4gICAgICAgIC8vIH0pLFxyXG4gICAgICAgIHJlbWl4KHtcclxuICAgICAgICAgICAgZnV0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICB2M190aHJvd0Fib3J0UmVhc29uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdjNfcmVsYXRpdmVTcGxhdFBhdGg6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB2M19mZXRjaGVyUGVyc2lzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHYzX2xhenlSb3V0ZURpc2NvdmVyeTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHYzX3NpbmdsZUZldGNoOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdjNfcm91dGVDb25maWc6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGJhYmVsKHtcclxuICAgICAgICAgICAgZmlsdGVyOiAvYXBwXFwvLipcXC5banRdc3g/JC8sXHJcbiAgICAgICAgICAgIGJhYmVsQ29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICBwcmVzZXRzOiBbXCJAYmFiZWwvcHJlc2V0LXR5cGVzY3JpcHRcIl0sXHJcbiAgICAgICAgICAgICAgICBwbHVnaW5zOiBbW1wiYmFiZWwtcGx1Z2luLXJlYWN0LWNvbXBpbGVyXCIsIHJlYWN0Q29tcGlsZXJDb25maWddXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgdHNjb25maWdQYXRocygpXHJcbiAgICBdLFxyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgICAgZXhjbHVkZTogW1wiQGRyZWFteS11aS9zeXN0ZW1cIiwgXCJAZHJlYW15LXVpL3N5c3RlbS8qXCIsIFwiQGRyZWFteS11aS9yZWFjdFwiXVxyXG4gICAgfSxcclxuICAgIGVzYnVpbGQ6IHtcclxuICAgICAgICBleGNsdWRlOiBbXCJAZHJlYW15LXVpL3N5c3RlbVwiLCBcIkBkcmVhbXktdWkvc3lzdGVtLypcIiwgXCJAZHJlYW15LXVpL3JlYWN0XCJdXHJcbiAgICB9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJYLE9BQU8sU0FBUztBQUMzWSxTQUFTLGNBQWMsYUFBYTtBQUNwQyxZQUFZLFFBQVE7QUFDcEIsWUFBWSxTQUFTO0FBQ3JCLE9BQU8sc0JBQXNCO0FBQzdCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQVUxQixpQkFBaUIsUUFBUTtBQUFBLEVBQ3JCLG1CQUFtQixDQUFDLFdBQVc7QUFDM0IsVUFBTSxRQUFRLE9BQU8sV0FBVyxTQUFTO0FBQ3pDLFFBQUksT0FBTztBQUNQLFlBQU0sV0FBZSxrQkFBYyxNQUFNO0FBQ3pDLFlBQU0sZ0JBQWdCLEdBQUcsUUFBUTtBQUNqQyxVQUFPLGNBQVcsYUFBYSxHQUFHO0FBQzlCLGVBQU87QUFBQSxVQUNILEtBQUs7QUFBQSxVQUNMLEtBQVEsZ0JBQWEsZUFBZSxNQUFNO0FBQUEsUUFDOUM7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUNBLFdBQU87QUFBQSxFQUNYO0FBQ0osQ0FBQztBQUVELElBQU0sc0JBQXNCO0FBQUEsRUFDeEIsUUFBUTtBQUNaO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBLEVBQ1o7QUFBQSxFQUNBLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0wsSUFBSTtBQUFBLE1BQ0EsYUFBYTtBQUFBLElBQ2pCLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFZRCxNQUFNO0FBQUEsTUFDRixRQUFRO0FBQUEsUUFDSixxQkFBcUI7QUFBQSxRQUNyQixzQkFBc0I7QUFBQSxRQUN0QixtQkFBbUI7QUFBQSxRQUNuQix1QkFBdUI7QUFBQSxRQUN2QixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNwQjtBQUFBLElBQ0osQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLE1BQ0YsUUFBUTtBQUFBLE1BQ1IsYUFBYTtBQUFBLFFBQ1QsU0FBUyxDQUFDLDBCQUEwQjtBQUFBLFFBQ3BDLFNBQVMsQ0FBQyxDQUFDLCtCQUErQixtQkFBbUIsQ0FBQztBQUFBLE1BQ2xFO0FBQUEsSUFDSixDQUFDO0FBQUEsSUFDRCxjQUFjO0FBQUEsRUFDbEI7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNWLFNBQVMsQ0FBQyxxQkFBcUIsdUJBQXVCLGtCQUFrQjtBQUFBLEVBQzVFO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxTQUFTLENBQUMscUJBQXFCLHVCQUF1QixrQkFBa0I7QUFBQSxFQUM1RTtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
