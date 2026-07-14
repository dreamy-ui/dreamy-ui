"use client";

import { createContext } from "@/provider/create-context";
import { useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { usePortalManager } from "./portal-manager";

export type PortalZIndex = string | number;

interface PortalContextValue {
    container: HTMLDivElement;
    zIndex: PortalZIndex;
}

interface SharedPortalHost {
    element: HTMLDivElement;
    referenceCount: number;
    removalTimer?: number;
}

const [PortalContextProvider, usePortalContext] = createContext<PortalContextValue | null>({
    strict: false,
    name: "PortalContext"
});

const PORTAL_CLASSNAME = "dreamy-portal";
const PORTAL_SELECTOR = `.${PORTAL_CLASSNAME}`;
const PORTAL_HOST_CLASSNAME = "dreamy-portal-host";
const PORTAL_HOST_SELECTOR = `.${PORTAL_HOST_CLASSNAME}`;
const PORTAL_BASE_Z_INDEX_VAR = "--dreamy-portal-base-z-index";
const PORTAL_LOCAL_Z_INDEX_VAR = "--dreamy-portal-local-z-index";
const PORTAL_Z_INDEX = `calc(var(${PORTAL_BASE_Z_INDEX_VAR}, 0) + var(${PORTAL_LOCAL_Z_INDEX_VAR}, 0))`;
const sharedPortalHosts = new WeakMap<Document, SharedPortalHost>();

const HOST_STYLE =
    "position:fixed;border:none;padding:0;margin:0;background:transparent;overflow:visible;inset:0;width:0;height:0;z-index:2147483647;pointer-events:none";

function isZeroZIndex(value: PortalZIndex | undefined): boolean {
    return value === undefined || value === 0 || value === "0";
}

function addZIndexes(base: PortalZIndex, local: PortalZIndex): PortalZIndex {
    if (typeof base === "number" && typeof local === "number") return base + local;
    if (isZeroZIndex(base)) return local;
    if (isZeroZIndex(local)) return base;
    return `calc(${base} + ${local})`;
}

function hideAndRemoveHost(host: HTMLDivElement) {
    try {
        if (host.matches(":popover-open")) host.hidePopover();
    } catch (_) {}
    host.remove();
}

function createSharedPortalHost(ownerDocument: Document): SharedPortalHost {
    const element = ownerDocument.createElement("div");
    element.className = PORTAL_HOST_CLASSNAME;
    element.dataset.dreamyPortalHost = "";
    element.style.cssText = HOST_STYLE;

    const parent = ownerDocument.body ?? ownerDocument.documentElement;
    parent.appendChild(element);

    if (typeof element.showPopover === "function") {
        try {
            element.setAttribute("popover", "manual");
            element.showPopover();
        } catch (_) {
            element.removeAttribute("popover");
        }
    }

    return { element, referenceCount: 0 };
}

function acquireSharedPortalHost(ownerDocument: Document): SharedPortalHost {
    let host = sharedPortalHosts.get(ownerDocument);

    if (!host || !host.element.isConnected) {
        host = createSharedPortalHost(ownerDocument);
        sharedPortalHosts.set(ownerDocument, host);
    }

    if (host.removalTimer !== undefined) {
        ownerDocument.defaultView?.clearTimeout(host.removalTimer);
        host.removalTimer = undefined;
    }

    host.referenceCount += 1;
    return host;
}

function releaseSharedPortalHost(ownerDocument: Document, host: SharedPortalHost) {
    host.referenceCount = Math.max(0, host.referenceCount - 1);
    if (host.referenceCount > 0) return;

    const ownerWindow = ownerDocument.defaultView;
    if (!ownerWindow) {
        hideAndRemoveHost(host.element);
        sharedPortalHosts.delete(ownerDocument);
        return;
    }

    host.removalTimer = ownerWindow.setTimeout(function removeUnusedHost() {
        host.removalTimer = undefined;
        if (host.referenceCount > 0) return;
        hideAndRemoveHost(host.element);
        sharedPortalHosts.delete(ownerDocument);
    }, 0);
}

function applyPortalLayerStyles(
    element: HTMLDivElement,
    baseZIndex: PortalZIndex,
    localZIndex: PortalZIndex
) {
    element.style.position = "absolute";
    element.style.inset = "0";
    element.style.width = "0";
    element.style.height = "0";
    element.style.overflow = "visible";
    element.style.pointerEvents = "auto";
    element.style.isolation = "isolate";
    element.style.zIndex = PORTAL_Z_INDEX;
    element.style.setProperty(PORTAL_BASE_Z_INDEX_VAR, String(baseZIndex));
    element.style.setProperty(PORTAL_LOCAL_Z_INDEX_VAR, String(localZIndex));
}

function movePortalToFront(container: HTMLDivElement) {
    const ownerWindow = container.ownerDocument.defaultView;
    if (!ownerWindow) {
        container.parentNode?.appendChild(container);
        return;
    }

    const frameId = ownerWindow.requestAnimationFrame(function appendActivePortal() {
        container.parentNode?.appendChild(container);
    });

    return function cancelMoveToFront() {
        ownerWindow.cancelAnimationFrame(frameId);
    };
}

/**
 * Portal backed by one shared browser Top Layer host per document.
 */
function DefaultPortal({
    appendToParentPortal,
    isActive,
    zIndex,
    children
}: React.PropsWithChildren<{
    appendToParentPortal?: boolean;
    isActive?: boolean;
    zIndex?: PortalZIndex;
}>) {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const parentPortal = usePortalContext();
    const manager = usePortalManager();
    const parentContainer = parentPortal?.container;
    const localZIndex = zIndex ?? 0;
    const baseZIndex =
        (appendToParentPortal ? parentPortal?.zIndex : undefined) ?? manager?.zIndex ?? 0;
    const resolvedZIndex = addZIndexes(baseZIndex, localZIndex);

    useLayoutEffect(
        function mountPortalContainer() {
            if (typeof document === "undefined") return;

            const ownerDocument = parentContainer?.ownerDocument ?? document;
            const element = ownerDocument.createElement("div");
            element.className = PORTAL_CLASSNAME;
            element.dataset.dreamyPortal = "";

            let sharedHost: SharedPortalHost | undefined;
            if (appendToParentPortal && parentContainer) {
                parentContainer.appendChild(element);
            } else {
                sharedHost = acquireSharedPortalHost(ownerDocument);
                sharedHost.element.appendChild(element);
            }

            setContainer(element);

            return function unmountPortalContainer() {
                element.remove();
                if (sharedHost) releaseSharedPortalHost(ownerDocument, sharedHost);
            };
        },
        [appendToParentPortal, parentContainer]
    );

    useLayoutEffect(
        function syncPortalLayer() {
            if (!container) return;
            applyPortalLayerStyles(container, baseZIndex, localZIndex);
        },
        [container, baseZIndex, localZIndex]
    );

    useLayoutEffect(
        function moveActivePortalToFront() {
            if (!container || !isActive || !container.parentNode) return;
            return movePortalToFront(container);
        },
        [container, isActive]
    );

    if (!container) return null;

    const contextValue: PortalContextValue = {
        container,
        zIndex: resolvedZIndex
    };

    return createPortal(
        <PortalContextProvider value={contextValue}>{children}</PortalContextProvider>,
        container
    );
}

interface ContainerPortalProps extends React.PropsWithChildren<Record<string, unknown>> {
    containerRef: React.RefObject<HTMLElement | null>;
    appendToParentPortal?: boolean;
    isActive?: boolean;
    zIndex?: PortalZIndex;
}

/**
 * Portal that renders into a caller-supplied DOM container.
 */
function ContainerPortal({
    children,
    containerRef,
    appendToParentPortal,
    isActive,
    zIndex
}: ContainerPortalProps) {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const parentPortal = usePortalContext();
    const manager = usePortalManager();
    const localZIndex = zIndex ?? 0;
    const baseZIndex =
        (appendToParentPortal ? parentPortal?.zIndex : undefined) ?? manager?.zIndex ?? 0;
    const resolvedZIndex = addZIndexes(baseZIndex, localZIndex);

    useLayoutEffect(
        function mountContainerPortal() {
            if (typeof document === "undefined") return;

            const host = containerRef.current ?? document.body;
            const element = host.ownerDocument.createElement("div");
            element.className = PORTAL_CLASSNAME;
            element.dataset.dreamyPortal = "";
            host.appendChild(element);
            setContainer(element);

            return function unmountContainerPortal() {
                element.remove();
            };
        },
        [containerRef]
    );

    useLayoutEffect(
        function syncPortalLayer() {
            if (!container) return;
            applyPortalLayerStyles(container, baseZIndex, localZIndex);
        },
        [container, baseZIndex, localZIndex]
    );

    useLayoutEffect(
        function moveActivePortalToFront() {
            if (!container || !isActive || !container.parentNode) return;
            return movePortalToFront(container);
        },
        [container, isActive]
    );

    const contextValue = useMemo<PortalContextValue | null>(
        function getPortalContextValue() {
            if (!container) return null;
            return { container, zIndex: resolvedZIndex };
        },
        [container, resolvedZIndex]
    );

    if (!container || !contextValue) return null;

    return createPortal(
        <PortalContextProvider value={contextValue}>{children}</PortalContextProvider>,
        container
    );
}

export interface PortalProps {
    /**
     * The `ref` to the component where the portal will be attached to.
     */
    containerRef?: React.RefObject<HTMLElement | null>;
    /**
     * The content or node you'll like to portal.
     */
    children: React.ReactNode;
    /**
     * If `true`, the portal will check if it is within a parent portal
     * and append itself to the parent's portal node.
     * This provides nesting for portals.
     *
     * If `false`, the portal will always use a fresh top-layer context
     * regardless of nesting.
     *
     * @default true
     */
    appendToParentPortal?: boolean;
    /**
     * Local z-index offset for this portal's stacking scope.
     * Nested portals add this value to their parent portal's resolved z-index.
     *
     * @default 0
     */
    zIndex?: PortalZIndex;
    /**
     * Whether this portal is currently active.
     * Active portals move to the end of their scope so equal layers follow open order.
     *
     * @default true
     */
    isActive?: boolean;
}

/**
 * Portal
 *
 * Declarative component used to render children into a DOM node
 * that exists outside the DOM hierarchy of the parent component.
 *
 * Uses the browser's native Top Layer API when available so that
 * portal content always renders above every stacking context without
 * relying on z-index values.
 */
export function Portal(props: PortalProps) {
    const portalProps: PortalProps = {
        appendToParentPortal: true,
        isActive: true,
        ...props
    };

    const { containerRef, ...rest } = portalProps;
    return containerRef ? (
        <ContainerPortal
            containerRef={containerRef}
            {...rest}
        />
    ) : (
        <DefaultPortal {...rest} />
    );
}

Portal.className = PORTAL_CLASSNAME;
Portal.selector = PORTAL_SELECTOR;
Portal.hostClassName = PORTAL_HOST_CLASSNAME;
Portal.hostSelector = PORTAL_HOST_SELECTOR;
Portal.displayName = "Portal";
