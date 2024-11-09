import type { NextConfig } from "next";

export default {
    experimental: {
        optimizePackageImports: ["@dreamy-ui/react"]
    }
} satisfies NextConfig;
