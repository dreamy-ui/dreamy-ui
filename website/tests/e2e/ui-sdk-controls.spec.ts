import { expect, test } from "@playwright/test";
import { expectNoStoryErrors, gotoStory, waitForStoryContent, watchForStoryErrors } from "./storybook";

test.describe("UI SDK text controls", () => {
    test("input renders UI SDK slot/state and updates filled state", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "input--base");
        await waitForStoryContent(page);

        const input = page.getByRole("textbox");
        await expect(input).toHaveAttribute("data-slot", "input");
        await expect(input).not.toHaveAttribute("data-filled", "");

        await input.fill("ada");
        await expect(input).toHaveAttribute("data-filled", "");
        await expect(input).toHaveValue("ada");
        await expectNoStoryErrors(page, errors);
    });

    test("input invalid state is exposed through ARIA and data attributes", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "input--invalid");
        await waitForStoryContent(page);

        const inputs = page.getByRole("textbox");
        await expect(inputs).toHaveCount(4);
        for (const input of await inputs.all()) {
            await expect(input).toHaveAttribute("data-slot", "input");
            await expect(input).toHaveAttribute("aria-invalid", "true");
            await expect(input).toHaveAttribute("data-invalid", "");
        }
        await expectNoStoryErrors(page, errors);
    });

    test("textarea renders UI SDK slot/state and preserves newlines", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "textarea--base");
        await waitForStoryContent(page);

        const textarea = page.getByRole("textbox");
        await expect(textarea).toHaveAttribute("data-slot", "textarea");

        await textarea.fill("line1\nline2");
        await expect(textarea).toHaveValue("line1\nline2");
        await expect(textarea).toHaveAttribute("data-filled", "");
        await expectNoStoryErrors(page, errors);
    });

    test("textarea invalid state is exposed through ARIA and data attributes", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "textarea--invalid");
        await waitForStoryContent(page);

        const textareas = page.getByRole("textbox");
        await expect(textareas).toHaveCount(4);
        for (const textarea of await textareas.all()) {
            await expect(textarea).toHaveAttribute("data-slot", "textarea");
            await expect(textarea).toHaveAttribute("aria-invalid", "true");
            await expect(textarea).toHaveAttribute("data-invalid", "");
        }
        await expectNoStoryErrors(page, errors);
    });
});
