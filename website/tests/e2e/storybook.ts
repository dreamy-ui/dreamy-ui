import { expect, type Page } from "@playwright/test";

export function storybookIframeUrl(storyId: string) {
    return `/iframe.html?id=${storyId}&viewMode=story`;
}

export async function gotoStory(page: Page, storyId: string) {
    await page.goto(storybookIframeUrl(storyId));
    await page.locator("#storybook-root").waitFor({ state: "attached" });
}

export async function waitForStoryContent(page: Page, selector = "#storybook-root > *") {
    await page.locator(selector).first().waitFor({ state: "attached" });
}

export function watchForStoryErrors(page: Page) {
    const errors: string[] = [];

    page.on("pageerror", (error) => {
        errors.push(`pageerror: ${error.message}`);
    });

    page.on("console", (message) => {
        if (message.type() === "error") {
            errors.push(`console.error: ${message.text()}`);
        }
    });

    return errors;
}

export async function expectNoStoryErrors(page: Page, errors: string[]) {
    await page.waitForTimeout(250);
    expect(errors).toEqual([]);
}
