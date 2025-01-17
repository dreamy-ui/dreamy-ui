import type { ColorMode } from "@/provider";

export function getColorModeHTMLProps(ssrColorMode: ColorMode | undefined | null = "light") {
    return {
        style: {
            colorScheme: ssrColorMode || undefined
        },
        "data-theme": ssrColorMode || undefined
    } satisfies React.HTMLProps<HTMLHtmlElement> & {
        "data-theme"?: string | undefined;
    };
}

export function getSSRColorMode(
    cookiesOrRequest: string | Request | undefined
): ColorMode | undefined {
    if (typeof cookiesOrRequest === "undefined") {
        return undefined;
    }

    const colorModeCookie = getCookie("dreamy-ui-color-mode", cookiesOrRequest);

    if (!colorModeCookie) {
        return undefined;
    }

    if (colorModeCookie === "light" || colorModeCookie === "dark") {
        return colorModeCookie;
    }

    console.warn(
        `Invalid color mode cookie value provided in getSSRColorMode(): ${colorModeCookie}`
    );

    return undefined;
}

function getCookie(cname: string, requestOrCookie: Request | string) {
    const cookies =
        typeof requestOrCookie === "string"
            ? requestOrCookie
            : requestOrCookie.headers.get("Cookie") || "";
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(cookies);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
