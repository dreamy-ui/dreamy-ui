"use client";

import { useLayoutEffect } from "react";

export interface PortalManagerConfig {
    zIndex?: string | number;
}

let portalManagerConfig: PortalManagerConfig | null = null;

/**
 * Returns the active portal manager config set by `PortalManager`.
 * Lives outside React so reading it never triggers context re-renders.
 */
export function getPortalManager(): PortalManagerConfig | null {
    return portalManagerConfig;
}

/**
 * Reads the active portal manager config without subscribing to updates.
 * Prefer `getPortalManager` outside React components.
 */
export function usePortalManager(): PortalManagerConfig | null {
    return portalManagerConfig;
}

export interface PortalManagerProps {
    children?: React.ReactNode;
    /**
     * [Z-Index war] If your has multiple elements
     * with z-index clashing, you might need to apply a z-index to the Portal manager
     */
    zIndex?: string | number;
}

/**
 * Sets a default base z-index for Portals without React context.
 *
 * Renders children as-is (no provider wrapper), so it cannot cause context-driven
 * re-renders of your app tree. Place once near the root of your app.
 */
export function PortalManager(props: PortalManagerProps) {
    const { children, zIndex } = props;

    // Keep module state in sync during render so Portals in this pass can read it.
    portalManagerConfig = { zIndex };

    useLayoutEffect(
        function syncPortalManagerConfig() {
            portalManagerConfig = { zIndex };
            return function clearPortalManagerConfig() {
                portalManagerConfig = null;
            };
        },
        [zIndex]
    );

    return children;
}

PortalManager.displayName = "PortalManager";
