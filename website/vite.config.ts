import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import * as fs from "node:fs";
import path from "node:path";
import * as url from "node:url";
import sourceMapSupport from "source-map-support";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";
// import pandabox from "@pandabox/unplugin";
// import Inspect from "vite-plugin-inspect";

declare module "@remix-run/node" {
	interface Future {
		v3_singleFetch: true;
	}
}

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
	target: "19"
};

export default defineConfig({
	resolve: {
		alias: {
			"styled-system": path.resolve(__dirname, "./styled-system")
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
		exclude: [
			"@dreamy-ui/panda-preset",
			"styled-system/*",
			"@dreamy-ui/react"
		]
	},
	esbuild: {
		exclude: [
			"@dreamy-ui/panda-preset",
			"styled-system/*",
			"@dreamy-ui/react"
		]
	}
});
