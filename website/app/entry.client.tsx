import { HydratedRouter } from "react-router/dom";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { cacheAssets } from "remix-utils/cache-assets";

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <HydratedRouter />
        </StrictMode>
    );
});

setTimeout(() => {
    cacheAssets().catch(console.error);
}, 100);
