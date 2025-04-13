import type { NextConfig } from "next";
import { resolve } from "node:path";

export default {
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            'styled-system': resolve(__dirname, './styled-system'),
        };

        return config;
    },
    experimental: {
        optimizePackageImports: ["@dreamy-ui/react"]
    }
} satisfies NextConfig;
