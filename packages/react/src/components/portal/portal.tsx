"use client";

import { createContext } from "@/provider/create-context";
import { useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { usePortalManager } from "./portal-manager";

type PortalContext = HTMLDivElement | null;

const [PortalContextProvider, usePortalContext] = createContext<PortalContext>({
    strict: false,
    name: "PortalContext"
});

const PORTAL_CLASSNAME = "dreamy-portal";
const PORTAL_SELECTOR = `.${PORTAL_CLASSNAME}`;

// Resets the browser's UA [popover] styles. Creates a zero-footprint transparent
// container in the native top layer so it never intercepts pointer events.
const TOP_LAYER_STYLE =
    "border:none;padding:0;margin:0;background:transparent;overflow:visible;inset:0;width:0;height:0";

/**
 * Portal backed by the browser's native Top Layer (popover="manual").
 *
 * Top-layer portals are painted above every stacking context — no z-index
 * juggling required. Browsers without the Popover API fall back to the old
 * document.body append strategy transparently.
 *
 * Nested portals (appendToParentPortal + parent context present) skip the
 * top-layer promotion and simply append inside the parent's container, since
 * they already inherit the parent's layer position.
 */
function DefaultPortal({
    appendToParentPortal,
    children
}: React.PropsWithChildren<{ appendToParentPortal?: boolean }>) {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const parentPortal = usePortalContext();
    const manager = usePortalManager();

    if (typeof document !== "undefined")
        // biome-ignore lint/correctness/useExhaustiveDependencies: container setup is one-shot per portal instance
        useLayoutEffect(() => {
            const el = document.createElement("div");
            el.className = PORTAL_CLASSNAME;

            if (appendToParentPortal && parentPortal) {
                // Nested portal: insert into the parent portal's DOM container.
                // It already lives inside the top layer — no further promotion needed.
                parentPortal.appendChild(el);
            } else if (typeof el.showPopover === "function") {
                // Top-level portal: promote to the browser's native Top Layer.
                // The element is rendered above all stacking contexts without z-index.
                el.setAttribute("popover", "manual");
                el.style.cssText = TOP_LAYER_STYLE;
                document.body.appendChild(el);
                el.showPopover();
            } else {
                // Fallback for browsers that don't support the Popover API.
                document.body.appendChild(el);
            }

            setContainer(el);

            return () => {
                try {
                    if (el.matches(":popover-open")) el.hidePopover();
                } catch (_) {}
                el.remove();
            };
        }, [appendToParentPortal, parentPortal]);

    if (!container) return null;

    const content = manager?.zIndex ? (
        <div
            style={{
                position: "absolute",
                zIndex: manager.zIndex,
                top: 0,
                left: 0,
                right: 0
            }}
        >
            {children}
        </div>
    ) : (
        children
    );

    return createPortal(
        <PortalContextProvider value={container}>{content}</PortalContextProvider>,
        container
    );
}

interface ContainerPortalProps extends React.PropsWithChildren<Record<string, unknown>> {
    containerRef: React.RefObject<HTMLElement | null>;
    /**
     * @default false
     */
    appendToParentPortal?: boolean;
}

/**
 * Portal that renders into a caller-supplied DOM container.
 */
function ContainerPortal({ children, containerRef, appendToParentPortal }: ContainerPortalProps) {
    const containerEl = containerRef.current;
    const host = containerEl ?? (typeof window !== "undefined" ? document.body : undefined);

    const portal = useMemo(() => {
        const node = containerEl?.ownerDocument.createElement("div");
        if (node) node.className = PORTAL_CLASSNAME;
        return node;
    }, [containerEl]);

    const [, forceUpdate] = useState({});
    if (typeof document !== "undefined") useLayoutEffect(() => forceUpdate({}), []);

    if (typeof document !== "undefined")
        useLayoutEffect(() => {
            if (!portal || !host) return;
            host.appendChild(portal);
            return () => {
                host.removeChild(portal);
            };
        }, [portal, host]);

    if (host && portal) {
        return createPortal(
            <PortalContextProvider value={appendToParentPortal ? portal : null}>
                {children}
            </PortalContextProvider>,
            portal
        );
    }

    return null;
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
Portal.displayName = "Portal";
