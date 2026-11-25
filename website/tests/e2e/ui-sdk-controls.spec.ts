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

    test("switch stretches thumb while active in unchecked and checked states", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "switch--states");
        await waitForStoryContent(page);

        const defaultControl = page.getByRole("switch", { name: "Default" });
        const defaultThumb = defaultControl.locator('[data-part="thumb"]');

        await expect(defaultControl).toHaveCSS("cursor", "pointer");
        await expect(defaultThumb).toHaveCSS("cursor", "pointer");

        const restBox = await defaultThumb.boundingBox();
        expect(restBox).not.toBeNull();

        const controlBox = await defaultControl.boundingBox();
        expect(controlBox).not.toBeNull();

        await page.mouse.move(
            controlBox!.x + controlBox!.width / 2,
            controlBox!.y + controlBox!.height / 2
        );
        await page.mouse.down();

        await expect
            .poll(async () => (await defaultThumb.boundingBox())?.width ?? 0)
            .toBeGreaterThan(restBox!.width + 4);

        const activeUncheckedBox = await defaultThumb.boundingBox();
        expect(activeUncheckedBox).not.toBeNull();
        expect(Math.abs(activeUncheckedBox!.x - restBox!.x)).toBeLessThan(2);

        await page.mouse.up();

        await expect(defaultControl).toHaveAttribute("aria-checked", "true");
        await expect
            .poll(async () => (await defaultThumb.boundingBox())?.width ?? 0)
            .toBeLessThan(restBox!.width + 1);

        const checkedRestBox = await defaultThumb.boundingBox();
        expect(checkedRestBox).not.toBeNull();

        await page.mouse.down();

        await expect
            .poll(async () => (await defaultThumb.boundingBox())?.width ?? 0)
            .toBeGreaterThan(checkedRestBox!.width + 4);

        const activeCheckedBox = await defaultThumb.boundingBox();
        expect(activeCheckedBox).not.toBeNull();
        // When checked, the right edge stays anchored while stretching leftward.
        expect(
            Math.abs(
                activeCheckedBox!.x +
                    activeCheckedBox!.width -
                    (checkedRestBox!.x + checkedRestBox!.width)
            )
        ).toBeLessThan(2);
        expect(activeCheckedBox!.x).toBeLessThan(checkedRestBox!.x - 4);

        await page.mouse.up();

        // Disabled and read-only switches must not stretch when pressed.
        for (const label of ["Disabled", "Read only"]) {
            const control = page.getByRole("switch", { name: label, exact: true });
            const thumb = control.locator('[data-part="thumb"]');
            const before = await thumb.boundingBox();
            const box = await control.boundingBox();
            expect(before).not.toBeNull();
            expect(box).not.toBeNull();

            await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
            await page.mouse.down();
            await page.waitForTimeout(200);
            const during = await thumb.boundingBox();
            await page.mouse.up();

            expect(Math.abs((during?.width ?? 0) - before!.width)).toBeLessThan(1);
            if (label === "Disabled") {
                await expect(control).toHaveCSS("cursor", "not-allowed");
                await expect(thumb).toHaveCSS("cursor", "not-allowed");
            }
        }

        await expectNoStoryErrors(page, errors);
    });
});
