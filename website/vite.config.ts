import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import path from "node:path";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";
// import pandabox from "@pandabox/unplugin";
// import Inspect from "vite-plugin-inspect";

// declare module "@react-router/node" {}

// sourceMapSupport.install({
// 	retrieveSourceMap: (source) => {
// 		const match = source.startsWith("file://");
// 		if (match) {
// 			const filePath = url.fileURLToPath(source);
// 			const sourceMapPath = `${filePath}.map`;
// 			if (fs.existsSync(sourceMapPath)) {
// 				return {
// 					url: source,
// 					map: fs.readFileSync(sourceMapPath, "utf8")
// 				};
// 			}
// 		}
// 		return null;
// 	}
// });

const reactCompilerConfig = {
	target: "19"
};

export default defineConfig(({ isSsrBuild }) => ({
	resolve: {
		alias: {
			"styled-system": path.resolve(__dirname, "./styled-system")
		}
	},
	build: {
		minify: true,
		target: "esnext",
		rollupOptions: isSsrBuild
			? {
					input: ["./app/server.ts", "./app/cluster.ts"]
				}
			: undefined
	},
	plugins: [
		// Inspect({
		//     build: true
		// }),
		// remixDevTools(),
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
}));
