import { ToastProvider } from "@/ui";
import { DreamyProvider } from "@dreamy-ui/react";
import { getColorModeHTMLProps, getSSRColorMode } from "@dreamy-ui/react/rsc";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import "./index.css";
import {
    prefetchCacheControlHeaderMiddleware,
    requestMiddleware,
    timingsMiddleware
} from "./src/.server/middlewares";
import { getServerCookie } from "./src/functions/cookies";
import { useRoot } from "./src/hooks/useRoot";
import GlobalContextProvider from "./src/ui/global/GlobalContext";
import AppLayout from "./src/ui/global/Layout";

export const middleware = [
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
        }
        // {
        //     rel: "stylesheet",
        //     href: styles
        // }
    ];
}

export function loader({ request }: Route.LoaderArgs) {
    return {
        colorMode: getSSRColorMode(request),
        isMac: getServerCookie("isMac", request) === "true",
        pm: getServerCookie("pm", request)
    };
}

export function shouldRevalidate() {
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
                    content="width=device-width, initial-scale=1"
                    name="viewport"
                />
                <meta
                    content="Dreamy UI, CSS-in-JS, React, Component Library, UI Framework, UI Components, UI Library, Component library for React, Accessible, Performant, Next-gen DX, CSS-in-JS component library for React"
                    property="keywords"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <DreamyProvider
                    colorMode={colorMode}
                    motionFeatures={motionFeatures}
                    motionStrict
                    useUserPreferenceColorMode
                >
                    <ToastProvider>
                        <GlobalContextProvider>
                            <AppLayout>{children}</AppLayout>
                        </GlobalContextProvider>
                    </ToastProvider>
                </DreamyProvider>
                <ScrollRestoration />
                <Scripts />
                <script
                    data-website-id="24f8ae64-8f5d-42f2-b50f-86f7b2b672a8"
                    defer
                    src="https://analytics.dreamy-ui.com/script.js"
                />
            </body>
        </html>
    );
}

export default Outlet;
