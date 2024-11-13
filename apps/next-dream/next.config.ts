import pandabox from "@pandabox/unplugin";
import type { NextConfig } from "next";

export default {
    webpack: (config) => {
        return {
            ...config,
            plugins: [
                pandabox.webpack({
                    optimizeJs: "macro"
                })
            ]
        };
    },
    experimental: {
        optimizePackageImports: ["@dreamy-ui/react"]
    }
} satisfies NextConfig;
