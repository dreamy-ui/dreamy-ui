"use client";

import { createContext } from "@/provider/create-context";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePortalManager } from "./portal-manager";

type PortalContext = HTMLDivElement | null;

const [PortalContextProvider, usePortalContext] = createContext<PortalContext>({
    strict: false,
    name: "PortalContext"
});

const PORTAL_CLASSNAME = "dream-portal";
const PORTAL_SELECTOR = `.${PORTAL_CLASSNAME}`;

function Container(props: React.PropsWithChildren<{ zIndex: number }>) {
    return (
        <div
            style={{
                position: "absolute",
                zIndex: props.zIndex,
                top: 0,
                left: 0,
                right: 0
            }}
        >
            {props.children}
        </div>
    );
}

/**
 * Portal that uses `document.body` as container
 */
function DefaultPortal(props: React.PropsWithChildren<{ appendToParentPortal?: boolean }>) {
    const { appendToParentPortal, children } = props;

    const [tempNode, setTempNode] = useState<HTMLElement | null>(null);
    const portal = useRef<HTMLDivElement | null>(null);

    const [, forceUpdate] = useState({});
    useEffect(() => forceUpdate({}), []);

    const parentPortal = usePortalContext();
    const manager = usePortalManager();

    if (typeof document !== "undefined")
        // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
        useLayoutEffect(() => {
            if (!tempNode) return;

            const doc = tempNode.ownerDocument;
            const host = appendToParentPortal ? parentPortal ?? doc.body : doc.body;

            if (!host) return;

            portal.current = doc.createElement("div");
            portal.current.className = PORTAL_CLASSNAME;

            host.appendChild(portal.current);
            forceUpdate({});

            const portalNode = portal.current;
            return () => {
                if (host.contains(portalNode)) {
                    host.removeChild(portalNode);
                }
            };
        }, [tempNode]);

    const _children = manager?.zIndex ? (
        <Container zIndex={manager.zIndex}>{children}</Container>
    ) : (
        children
    );

    return portal.current ? (
        createPortal(
            <PortalContextProvider value={portal.current}>{_children}</PortalContextProvider>,
            portal.current
        )
    ) : (
        <span
            ref={(el) => {
                if (el) setTempNode(el);
            }}
        />
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
 * Portal that uses a custom container
 */
function ContainerPortal(props: ContainerPortalProps) {
    const { children, containerRef, appendToParentPortal } = props;
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
     * The content or node you'll like to portal
     */
    children: React.ReactNode;
    /**
     * If `true`, the portal will check if it is within a parent portal
     * and append itself to the parent's portal node.
     * This provides nesting for portals.
     *
     * If `false`, the portal will always append to `document.body`
     * regardless of nesting. It is used to opt out of portal nesting.
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
 */
export function Portal(props: PortalProps) {
    const portalProps: PortalProps = {
        appendToParentPortal: true,
        ...props
    };

    const { containerRef, ...rest } = portalProps;
    return containerRef ? (
        <ContainerPortal containerRef={containerRef} {...rest} />
    ) : (
        <DefaultPortal {...rest} />
    );
}

Portal.className = PORTAL_CLASSNAME;
Portal.selector = PORTAL_SELECTOR;

Portal.displayName = "Portal";
