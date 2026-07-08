export interface SetClientCookieOptions {
    path?: string;
    expires?: number;
    sameSite?: "strict" | "lax" | "none";
    secure?: boolean;
}

function getDefaultSecure(sameSite: "strict" | "lax" | "none") {
    if (sameSite === "none") {
        return true;
    }

    return typeof globalThis.location !== "undefined" && globalThis.location.protocol === "https:";
}

export function setClientCookie(name: string, value: string, options: SetClientCookieOptions = {}) {
    const path = options.path ?? "/";
    const sameSite = options.sameSite ?? "lax";
    const secure = options.secure ?? getDefaultSecure(sameSite);

    if (typeof cookieStore !== "undefined") {
        return cookieStore.set({
            name,
            value,
            path,
            sameSite,
            expires: options.expires
        });
    }

    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}; SameSite=${sameSite}`;

    if (secure) {
        cookie += "; Secure";
    }

    if (options.expires) {
        cookie += `; expires=${new Date(options.expires).toUTCString()}`;
    }

    document.cookie = cookie;
}
