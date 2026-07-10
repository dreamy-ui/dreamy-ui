"use client";

import { PMTabs } from "~/src/ui/docs/components/pm-tabs";

export function LandingSnippet() {
    return (
        <PMTabs>
            <PMTabs.Option name="npm">npx dreamy init</PMTabs.Option>
            <PMTabs.Option name="pnpm">pnpm dlx dreamy init</PMTabs.Option>
            <PMTabs.Option name="yarn">yarn dlx dreamy init</PMTabs.Option>
            <PMTabs.Option name="bun">bunx dreamy init</PMTabs.Option>
        </PMTabs>
    );
}
