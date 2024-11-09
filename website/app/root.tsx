import { DreamProvider, getColorModeHTMLProps, getSSRColorMode } from "@dreamy-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    type ShouldRevalidateFunctionArgs,
    useRouteLoaderData
} from "@remix-run/react";
import { type PropsWithChildren, useEffect } from "react";
import AppLayout from "~/src/ui/global/Layout";
import styles from "./index.css?url";
import { getServerCookie } from "./src/functions/cookies";

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

export function loader({ request }: LoaderFunctionArgs) {
    return {
        colorMode: getSSRColorMode(request),
        isMac: getServerCookie("isMac", request) === "true"
    };
}

export function shouldRevalidate(_: ShouldRevalidateFunctionArgs) {
    return false;
}

const motionFeatures = () => import("framer-motion").then((mod) => mod.domMax);

export function Layout({ children }: PropsWithChildren) {
    const data = useRouteLoaderData<typeof loader>("root");
    const { colorMode } = data ?? {};

    useEffect(() => {
        (window as any).hydrated = true;
    }, []);

    return (
        <html
            lang="en"
            {...getColorModeHTMLProps(colorMode ?? "light")}
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
                <DreamProvider
                    motionFeatures={motionFeatures}
                    colorMode={colorMode}
                >
                    <AppLayout>{children}</AppLayout>
                </DreamProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}
