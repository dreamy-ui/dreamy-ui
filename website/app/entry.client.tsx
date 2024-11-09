import { RemixBrowser } from "@remix-run/react";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { cacheAssets } from "remix-utils/cache-assets";

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <RemixBrowser />
        </StrictMode>
    );
});

setTimeout(() => {
    cacheAssets().catch(console.error);
}, 100);
