import { renderAsync } from "@resvg/resvg-js";
import fs from "node:fs/promises";
import satori, { type FontStyle, type FontWeight } from "satori";

const ASPECT_RATIO = 21 / 9;
const WIDTH = 1920;
const HEIGHT = WIDTH / ASPECT_RATIO;

export async function generateOgImage(title: string, description: string, origin: string) {
    const [fonts, template] = await Promise.all([
        getFonts(),
        getOgTemplate(title, description, origin)
    ]);
    const svg = await satori(template, {
        width: WIDTH,
        height: HEIGHT,
        debug: false,
        fonts
    });

    const image = await renderAsync(svg);

    return image.asPng();
}

async function getOgTemplate(title: string, description: string, origin: string) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                justifyContent: "space-between",
                // background: `linear-gradient(to right, ${token("colors.primary")}, ${token("colors.secondary")}, ${token("colors.tertiary")})`,
                background: "#080808",
                color: "white",
                fontFamily: "Geist",
                padding: 100
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <h1 style={{ fontSize: 150, fontFamily: "GeistBold" }}>{title}</h1>
                <p style={{ fontSize: 80, maxWidth: 1300 }}>{description}</p>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 40
                }}
            >
                <p style={{ fontSize: 80, fontFamily: "GeistBold" }}>Dreamy UI</p>
                <img
                    src={origin + "/dream-ui-no-bg.png"}
                    alt="Dreamy UI"
                    style={{ height: 120 }}
                />
            </div>

            <div
                style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: "500px",
                    height: "500px",
                    transform: "translate(0%, 20%)",
                    translate: "auto",
                    borderRadius: "9999px",
                    background: "rgb(73, 31, 171)",
                    opacity: 0.1,
                    filter: "blur(80px)"
                }}
            />
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "750px",
                    height: "750px",
                    transform: "translate(-20%, 50%)",
                    borderRadius: "9999px",
                    background: "rgb(205, 60, 190)",
                    opacity: 0.1,
                    filter: "blur(80px)"
                }}
            />
        </div>
    );
}

let geistRegular: Buffer | ArrayBuffer | null = null;
let geistBold: Buffer | ArrayBuffer | null = null;
async function getFonts() {
    if (!geistRegular) {
        geistRegular = await fs.readFile("./public/Geist-Regular.ttf");
    }
    if (!geistBold) {
        geistBold = await fs.readFile("./public/Geist-Bold.ttf");
    }

    return [
        {
            data: geistRegular,
            name: "Geist",
            weight: 500
        },
        {
            data: geistBold,
            name: "GeistBold",
            weight: 800
        }
    ] satisfies {
        data: Buffer | ArrayBuffer;
        name: string;
        weight?: FontWeight;
        style?: FontStyle;
        lang?: string;
    }[];
}
