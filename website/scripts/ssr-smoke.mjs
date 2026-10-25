import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Flex } from "../components/ui/flex.tsx";
import * as Card from "../components/ui/card.tsx";

try {
    const flexHtml = renderToString(
        createElement(Flex, { col: true, maxW: "2xl", children: "ok" })
    );
    console.log("Flex SSR ok", flexHtml.slice(0, 80));
} catch (e) {
    console.error("Flex SSR failed", e);
}

try {
    const cardHtml = renderToString(
        createElement(
            Card.Root,
            { children: createElement(Card.Body, { children: "body" }) }
        )
    );
    console.log("Card SSR ok", cardHtml.slice(0, 120));
} catch (e) {
    console.error("Card SSR failed", e);
}

import { Box } from "../components/ui/box.tsx";
import { MdOutlineCloud } from "react-icons/md";
import * as Stat from "../components/ui/stat.tsx";

try {
    renderToString(createElement(Box, { as: MdOutlineCloud, boxSize: "4" }));
    console.log("Box as icon SSR ok");
} catch (e) {
    console.error("Box as icon SSR failed", e);
}

try {
    renderToString(
        createElement(Stat.Root, {
            children: [
                createElement(Stat.Label, { children: "Stars" }),
                createElement(Stat.ValueText, { children: "1" }),
                createElement(Stat.UpIndicator)
            ]
        })
    );
    console.log("Stat SSR ok");
} catch (e) {
    console.error("Stat SSR failed", e);
}

import { Link } from "../app/src/ui/global/Link.tsx";
import { MemoryRouter } from "react-router";

try {
    renderToString(
        createElement(
            MemoryRouter,
            {},
            createElement(Link, { to: "/docs", children: "docs" })
        )
    );
    console.log("Router Link SSR ok");
} catch (e) {
    console.error("Router Link SSR failed", e);
}

process.env.NODE_ENV = "development";

import Main from "../app/src/ui/pages/landing/Main.tsx";
import FloatingComponents from "../app/src/ui/pages/landing/FloatingComponents.tsx";
import Features from "../app/src/ui/pages/landing/Features.tsx";
import Index from "../app/routes/_index.tsx";
import { DreamyProvider } from "@dreamy-ui/react";
import { createMemoryRouter, RouterProvider } from "react-router";

async function renderRoute(element, loaderData = {}) {
    const router = createMemoryRouter(
        [
            {
                path: "/",
                element: createElement(DreamyProvider, { colorMode: "light" }, element),
                loader: () => loaderData
            }
        ],
        { initialEntries: ["/"] }
    );
    await router.navigate("/");
    return renderToString(createElement(RouterProvider, { router }));
}

try {
    await renderRoute(createElement(Main), { version: "2.0.0" });
    console.log("Main SSR ok");
} catch (e) {
    console.error("Main SSR failed", e);
}

try {
    await renderRoute(createElement(FloatingComponents), { githubStars: 42 });
    console.log("FloatingComponents SSR ok");
} catch (e) {
    console.error("FloatingComponents SSR failed", e);
}

try {
    await renderRoute(createElement(Features), { panda: null });
    console.log("Features SSR ok");
} catch (e) {
    console.error("Features SSR failed", e);
}

try {
    await renderRoute(createElement(Index), {
        version: "2.0.0",
        githubStars: 42,
        panda: null
    });
    console.log("Index SSR ok");
} catch (e) {
    console.error("Index SSR failed", e);
}
