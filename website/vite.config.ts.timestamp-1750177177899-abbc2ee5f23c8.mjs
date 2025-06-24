// vite.config.ts
import mdx from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/@mdx-js+rollup@3.1.0_acorn@8.14.1_rollup@4.40.0/node_modules/@mdx-js/rollup/index.js";
import { vitePlugin as remix } from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/@remix-run+dev@2.16.5_@remix-run+react@2.16.5_react-dom@19.1.0_react@19.1.0__react@19.1.0_typ_lzsj4yne3r33bekhfvo62dtutu/node_modules/@remix-run/dev/dist/index.js";
import * as fs from "node:fs";
import path from "node:path";
import * as url from "node:url";
import sourceMapSupport from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/source-map-support@0.5.21/node_modules/source-map-support/source-map-support.js";
import { defineConfig } from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/vite@5.4.18_@types+node@22.14.1_lightningcss@1.25.1/node_modules/vite/dist/node/index.js";
import babel from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/vite-plugin-babel@1.3.0_@babel+core@7.26.10_vite@5.4.18_@types+node@22.14.1_lightningcss@1.25.1_/node_modules/vite-plugin-babel/dist/index.mjs";
import tsconfigPaths from "file:///C:/Users/Odeex/OneDrive/Pulpit/coding/react/dreamy-ui/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.8.3_vite@5.4.18_@types+node@22.14.1_lightningcss@1.25.1_/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\Odeex\\OneDrive\\Pulpit\\coding\\react\\dreamy-ui\\website";
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
  resolve: {
    alias: {
      "styled-system": path.resolve(__vite_injected_original_dirname, "./styled-system")
    }
  },
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
    exclude: ["@dreamy-ui/panda-preset", "styled-system/*", "@dreamy-ui/react"]
  },
  esbuild: {
    exclude: ["@dreamy-ui/panda-preset", "styled-system/*", "@dreamy-ui/react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPZGVleFxcXFxPbmVEcml2ZVxcXFxQdWxwaXRcXFxcY29kaW5nXFxcXHJlYWN0XFxcXGRyZWFteS11aVxcXFx3ZWJzaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPZGVleFxcXFxPbmVEcml2ZVxcXFxQdWxwaXRcXFxcY29kaW5nXFxcXHJlYWN0XFxcXGRyZWFteS11aVxcXFx3ZWJzaXRlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9PZGVleC9PbmVEcml2ZS9QdWxwaXQvY29kaW5nL3JlYWN0L2RyZWFteS11aS93ZWJzaXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IG1keCBmcm9tIFwiQG1keC1qcy9yb2xsdXBcIjtcclxuaW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peCB9IGZyb20gXCJAcmVtaXgtcnVuL2RldlwiO1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwibm9kZTpmc1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XHJcbmltcG9ydCAqIGFzIHVybCBmcm9tIFwibm9kZTp1cmxcIjtcclxuaW1wb3J0IHNvdXJjZU1hcFN1cHBvcnQgZnJvbSBcInNvdXJjZS1tYXAtc3VwcG9ydFwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgYmFiZWwgZnJvbSBcInZpdGUtcGx1Z2luLWJhYmVsXCI7XHJcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XHJcbi8vIGltcG9ydCBwYW5kYWJveCBmcm9tIFwiQHBhbmRhYm94L3VucGx1Z2luXCI7XHJcbi8vIGltcG9ydCBJbnNwZWN0IGZyb20gXCJ2aXRlLXBsdWdpbi1pbnNwZWN0XCI7XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcIkByZW1peC1ydW4vbm9kZVwiIHtcclxuICAgIGludGVyZmFjZSBGdXR1cmUge1xyXG4gICAgICAgIHYzX3NpbmdsZUZldGNoOiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5zb3VyY2VNYXBTdXBwb3J0Lmluc3RhbGwoe1xyXG4gICAgcmV0cmlldmVTb3VyY2VNYXA6IChzb3VyY2UpID0+IHtcclxuICAgICAgICBjb25zdCBtYXRjaCA9IHNvdXJjZS5zdGFydHNXaXRoKFwiZmlsZTovL1wiKTtcclxuICAgICAgICBpZiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgY29uc3QgZmlsZVBhdGggPSB1cmwuZmlsZVVSTFRvUGF0aChzb3VyY2UpO1xyXG4gICAgICAgICAgICBjb25zdCBzb3VyY2VNYXBQYXRoID0gYCR7ZmlsZVBhdGh9Lm1hcGA7XHJcbiAgICAgICAgICAgIGlmIChmcy5leGlzdHNTeW5jKHNvdXJjZU1hcFBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogc291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcDogZnMucmVhZEZpbGVTeW5jKHNvdXJjZU1hcFBhdGgsIFwidXRmOFwiKVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufSk7XHJcblxyXG5jb25zdCByZWFjdENvbXBpbGVyQ29uZmlnID0ge1xyXG4gICAgdGFyZ2V0OiBcIjE5XCJcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgXCJzdHlsZWQtc3lzdGVtXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zdHlsZWQtc3lzdGVtXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgbWluaWZ5OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIC8vIEluc3BlY3Qoe1xyXG4gICAgICAgIC8vICAgICBidWlsZDogdHJ1ZVxyXG4gICAgICAgIC8vIH0pLFxyXG4gICAgICAgIC8vIHJlbWl4RGV2VG9vbHMoKSxcclxuICAgICAgICBtZHgoe1xyXG4gICAgICAgICAgICBkZXZlbG9wbWVudDogdHJ1ZVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIC8vIHBhbmRhYm94LnZpdGUoe1xyXG4gICAgICAgIC8vICAgICBvcHRpbWl6ZUpzOiBcIm1hY3JvXCIsXHJcbiAgICAgICAgLy8gICAgIGV4Y2x1ZGU6IFtcclxuICAgICAgICAvLyAgICAgICAgIFwiLi9zdHlsZWQtc3lzdGVtXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcInN0eWxlZC1zeXN0ZW1cIixcclxuICAgICAgICAvLyAgICAgICAgIFwic3R5bGVkLXN5c3RlbS8qXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcIi4uL3BhY2thZ2VzLypcIixcclxuICAgICAgICAvLyAgICAgICAgIFwiQGRyZWFteS11aS9zeXN0ZW1cIixcclxuICAgICAgICAvLyAgICAgICAgIFwiQGRyZWFteS11aS9yZWFjdFwiXHJcbiAgICAgICAgLy8gICAgIF1cclxuICAgICAgICAvLyB9KSxcclxuICAgICAgICByZW1peCh7XHJcbiAgICAgICAgICAgIGZ1dHVyZToge1xyXG4gICAgICAgICAgICAgICAgdjNfdGhyb3dBYm9ydFJlYXNvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHYzX3JlbGF0aXZlU3BsYXRQYXRoOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdjNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB2M19sYXp5Um91dGVEaXNjb3Zlcnk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB2M19zaW5nbGVGZXRjaDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHYzX3JvdXRlQ29uZmlnOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuICAgICAgICBiYWJlbCh7XHJcbiAgICAgICAgICAgIGZpbHRlcjogL2FwcFxcLy4qXFwuW2p0XXN4PyQvLFxyXG4gICAgICAgICAgICBiYWJlbENvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgcHJlc2V0czogW1wiQGJhYmVsL3ByZXNldC10eXBlc2NyaXB0XCJdLFxyXG4gICAgICAgICAgICAgICAgcGx1Z2luczogW1tcImJhYmVsLXBsdWdpbi1yZWFjdC1jb21waWxlclwiLCByZWFjdENvbXBpbGVyQ29uZmlnXV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHRzY29uZmlnUGF0aHMoKVxyXG4gICAgXSxcclxuICAgIG9wdGltaXplRGVwczoge1xyXG4gICAgICAgIGV4Y2x1ZGU6IFtcIkBkcmVhbXktdWkvcGFuZGEtcHJlc2V0XCIsIFwic3R5bGVkLXN5c3RlbS8qXCIsIFwiQGRyZWFteS11aS9yZWFjdFwiXVxyXG4gICAgfSxcclxuICAgIGVzYnVpbGQ6IHtcclxuICAgICAgICBleGNsdWRlOiBbXCJAZHJlYW15LXVpL3BhbmRhLXByZXNldFwiLCBcInN0eWxlZC1zeXN0ZW0vKlwiLCBcIkBkcmVhbXktdWkvcmVhY3RcIl1cclxuICAgIH1cclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlgsT0FBTyxTQUFTO0FBQzNZLFNBQVMsY0FBYyxhQUFhO0FBQ3BDLFlBQVksUUFBUTtBQUNwQixPQUFPLFVBQVU7QUFDakIsWUFBWSxTQUFTO0FBQ3JCLE9BQU8sc0JBQXNCO0FBQzdCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQVIxQixJQUFNLG1DQUFtQztBQWtCekMsaUJBQWlCLFFBQVE7QUFBQSxFQUNyQixtQkFBbUIsQ0FBQyxXQUFXO0FBQzNCLFVBQU0sUUFBUSxPQUFPLFdBQVcsU0FBUztBQUN6QyxRQUFJLE9BQU87QUFDUCxZQUFNLFdBQWUsa0JBQWMsTUFBTTtBQUN6QyxZQUFNLGdCQUFnQixHQUFHLFFBQVE7QUFDakMsVUFBTyxjQUFXLGFBQWEsR0FBRztBQUM5QixlQUFPO0FBQUEsVUFDSCxLQUFLO0FBQUEsVUFDTCxLQUFRLGdCQUFhLGVBQWUsTUFBTTtBQUFBLFFBQzlDO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFDQSxXQUFPO0FBQUEsRUFDWDtBQUNKLENBQUM7QUFFRCxJQUFNLHNCQUFzQjtBQUFBLEVBQ3hCLFFBQVE7QUFDWjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILGlCQUFpQixLQUFLLFFBQVEsa0NBQVcsaUJBQWlCO0FBQUEsSUFDOUQ7QUFBQSxFQUNKO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDSCxRQUFRO0FBQUEsRUFDWjtBQUFBLEVBQ0EsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLTCxJQUFJO0FBQUEsTUFDQSxhQUFhO0FBQUEsSUFDakIsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVlELE1BQU07QUFBQSxNQUNGLFFBQVE7QUFBQSxRQUNKLHFCQUFxQjtBQUFBLFFBQ3JCLHNCQUFzQjtBQUFBLFFBQ3RCLG1CQUFtQjtBQUFBLFFBQ25CLHVCQUF1QjtBQUFBLFFBQ3ZCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ3BCO0FBQUEsSUFDSixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsTUFDRixRQUFRO0FBQUEsTUFDUixhQUFhO0FBQUEsUUFDVCxTQUFTLENBQUMsMEJBQTBCO0FBQUEsUUFDcEMsU0FBUyxDQUFDLENBQUMsK0JBQStCLG1CQUFtQixDQUFDO0FBQUEsTUFDbEU7QUFBQSxJQUNKLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxFQUNsQjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1YsU0FBUyxDQUFDLDJCQUEyQixtQkFBbUIsa0JBQWtCO0FBQUEsRUFDOUU7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLFNBQVMsQ0FBQywyQkFBMkIsbUJBQW1CLGtCQUFrQjtBQUFBLEVBQzlFO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
