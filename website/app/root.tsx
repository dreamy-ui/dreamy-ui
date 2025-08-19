import { ToastProvider } from "@/toast-provider";
import { DreamyProvider } from "@dreamy-ui/react";
import { getColorModeHTMLProps, getSSRColorMode } from "@dreamy-ui/react/rsc";
import { useEffect } from "react";
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    type ShouldRevalidateFunctionArgs
} from "react-router";
import AppLayout from "~/src/ui/global/Layout";
import type { Route } from "./+types/root";
import styles from "./index.css?url";
import { clientTimingMiddleware } from "./src/.client/middlewares";
import {
    prefetchCacheControlHeaderMiddleware,
    requestMiddleware,
    timingsMiddleware
} from "./src/.server/middlewares";
import { getServerCookie } from "./src/functions/cookies";
import { useRoot } from "./src/hooks/useRoot";

export const unstable_clientMiddleware = [clientTimingMiddleware];

export const unstable_middleware = [
    requestMiddleware,
    timingsMiddleware,
    prefetchCacheControlHeaderMiddleware
];

export function links() {
    return [
        {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossOrigin: "anonymous"
        },
        {
            rel: "preload",
            href: "https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggexSg.woff2",
            as: "font",
            type: "font/woff2",
            crossOrigin: "anonymous"
        },
        {
            rel: "preload",
            href: "/Geist[wght].ttf",
            as: "font",
            type: "font/ttf",
            crossOrigin: "anonymous"
        },
        {
            rel: "icon",
            href: "/dream.svg",
            type: "image/svg+xml"
        },
        {
            rel: "stylesheet",
            href: styles
        }
    ];
}

export function loader({ request }: Route.LoaderArgs) {
    return {
        colorMode: getSSRColorMode(request),
        isMac: getServerCookie("isMac", request) === "true"
    };
}

export function shouldRevalidate(_: ShouldRevalidateFunctionArgs) {
    return false;
}

const motionFeatures = () => import("./features").then((mod) => mod.default);

export function Layout({ children }: { children: React.ReactNode }) {
    let root: any;
    try {
        root = useRoot();
    } catch (error) {
        console.error(error);
    }
    const { colorMode } = root ?? {};

    useEffect(() => {
        setTimeout(() => {
            (window as any).hydrated = true;
        }, 1000);
    }, []);

    return (
        <html
            lang="en"
            suppressContentEditableWarning
            suppressHydrationWarning
            {...getColorModeHTMLProps(colorMode)}
        >
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <DreamyProvider
                    motionFeatures={motionFeatures}
                    colorMode={colorMode}
                    useUserPreferenceColorMode
                    motionStrict
                >
                    <ToastProvider>
                        <AppLayout>{children}</AppLayout>
                    </ToastProvider>
                </DreamyProvider>
                <ScrollRestoration />
                <Scripts />
                <script
                    defer
                    src="https://analytics.dreamy-ui.com/script.js"
                    data-website-id="24f8ae64-8f5d-42f2-b50f-86f7b2b672a8"
                />
            </body>
        </html>
    );
}

export default Outlet;
