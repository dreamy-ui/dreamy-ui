import { getPresetOptions } from "@/theme/preset";

export function resolveButtonColors() {
    const options = getPresetOptions();

    if (options.primaryColor && !options.buttonPrimaryTextColor) {
        if (typeof options.primaryColor === "string") {
            options.buttonPrimaryTextColor = getContrast(options.primaryColor);
        } else {
            options.buttonPrimaryTextColor = {
                light: getContrast(options.primaryColor.light),
                dark: getContrast(options.primaryColor.dark)
            };
        }
    }

    if (options.secondaryColor && !options.buttonSecondaryTextColor) {
        if (typeof options.secondaryColor === "string") {
            options.buttonSecondaryTextColor = getContrast(options.secondaryColor);
        } else {
            options.buttonSecondaryTextColor = {
                light: getContrast(options.secondaryColor.light),
                dark: getContrast(options.secondaryColor.dark)
            };
        }
    }
}

function getContrast(color: string) {
    const [red, green, blue] = resolveColorScheme(color);

    return red * 0.299 + green * 0.587 + blue * 0.114 > 186 ? "#000000" : "#ffffff";
}

function resolveColorScheme(color: string) {
    // check if color is a hex value
    if (color.startsWith("#")) {
        const hex = color.slice(1);
        const [r, g, b] = hexToRgb(hex);
        return [r, g, b];
    }

    if (color.startsWith("rgb")) {
        const rgb = color.slice(4).split(")")[0].split(",");
        return rgb.map((value) => Number.parseInt(value, 10));
    }

    if (color.startsWith("hsl")) {
        const hsl = color.slice(4).split(")")[0].split(",");
        const [h, s, l] = hsl.map((value) => Number.parseInt(value, 10));
        return hslToRgb(h, s, l);
    }

    throw new Error(
        `Invalid color: ${color}. Make sure provided color is a valid hex value, rgb value, or hsl value.`
    );
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result) throw new Error(`Invalid hex color: ${hex}`);

    return [
        Number.parseInt(result[1], 16),
        Number.parseInt(result[2], 16),
        Number.parseInt(result[3], 16)
    ];
}

function hslToRgb(h: number, s: number, l: number) {
    let r: number;
    let g: number;
    let b: number;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hueToRgb(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}
