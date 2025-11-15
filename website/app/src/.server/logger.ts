export const CONFIG = {
    SYSTEM: {
        reset: "\x1b[0m",
        bold: "\x1b[1m",
        dim: "\x1b[2m",
        italic: "\x1b[3m",
        underscore: "\x1b[4m",
        reverse: "\x1b[7m",
        strikethrough: "\x1b[9m",
        backoneline: "\x1b[1A",
        cleanthisline: "\x1b[K"
    },
    FONT: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m"
    },
    BACKGROUND: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m"
    }
} as const;

function log(
    text: string | string[],
    color: keyof typeof CONFIG.FONT = "black",
    bg?: keyof typeof CONFIG.BACKGROUND,
    noDate = false
): void {
    if (noDate) {
        console.log(
            `${CONFIG.SYSTEM.bold}${CONFIG.FONT[color]}${bg ? CONFIG.BACKGROUND[bg] : ""}${Array.isArray(text) ? text.join(", ") : text}${CONFIG.SYSTEM.reset}`
        );
        return;
    }
    console.log(
        `[${new Date().toLocaleTimeString()}]`,
        `${CONFIG.SYSTEM.bold}${CONFIG.FONT[color]}${bg ? CONFIG.BACKGROUND[bg] : ""}`,
        Array.isArray(text) ? text.join(", ") : text,
        `${CONFIG.SYSTEM.reset}`
    );
}

export class Logger {
    static log(text: string | string[], noDate = false): void {
        log(text, undefined, undefined, noDate);
    }

    static info(text: string | string[], noDate = false): void {
        log(text, "blue", undefined, noDate);
    }

    static success(text: string | string[], noDate = false): void {
        log(text, "green", undefined, noDate);
    }

    static debug(text: string | string[], noDate = false): void {
        log(text, "white", "black", noDate);
    }

    static warn(text: string | string[], noDate = false): void {
        log(text, "white", "yellow", noDate);
    }

    static error(text: string | string[], noDate = false): void {
        log(text, "white", "red", noDate);
    }

    static custom(
        text: string | string[],
        color: keyof typeof CONFIG.FONT,
        bg?: keyof typeof CONFIG.BACKGROUND,
        noDate = false
    ): void {
        log(text, color, bg, noDate);
    }
}
