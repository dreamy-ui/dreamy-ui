import { expect, test } from "@playwright/test";
import {
    expectNoStoryErrors,
    gotoStory,
    waitForStoryContent,
    watchForStoryErrors
} from "./storybook";

test.describe("UI SDK Phase 2 overlays and form controls", () => {
    test("menu opens, highlights items, and closes on Escape", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "menu--base");
        await waitForStoryContent(page);

        const trigger = page.getByRole("button", { name: "Open Menu" });
        await trigger.click();

        const menu = page.getByRole("menu");
        await expect(menu).toBeVisible();
        await expect(menu).toHaveAttribute("data-slot", "menu-content");
        await expect(page.getByRole("menuitem", { name: /Add new/i })).toBeVisible();

        await page.keyboard.press("Escape");
        await expect(menu).toBeHidden();
        await expectNoStoryErrors(page, errors);
    });

    test("select opens listbox, picks an option, and updates trigger label", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "select--base");
        await waitForStoryContent(page);

        const trigger = page.getByRole("combobox");
        await trigger.click();

        const listbox = page.getByRole("listbox");
        await expect(listbox).toBeVisible();

        await page.getByRole("option", { name: "Banana" }).click();
        await expect(listbox).toBeHidden();
        await expect(trigger).toContainText("Banana");
        await expectNoStoryErrors(page, errors);
    });

    test("autocomplete filters items and selects an option", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "autocomplete--base");
        await waitForStoryContent(page);

        const input = page.getByRole("combobox");
        await expect(input).toHaveAttribute("data-slot", "combobox-input");

        await input.click();
        await input.fill("man");

        const option = page.getByRole("option", { name: "Mango" });
        await expect(option).toBeVisible();
        await option.click();

        await expect(input).toHaveValue("Mango");
        await expectNoStoryErrors(page, errors);
    });

    test("modal opens, exposes dialog semantics, and closes on Escape", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "modal--base");
        await waitForStoryContent(page);

        const openButton = page.getByRole("button", { name: "Open Modal" });
        await openButton.click();

        const dialog = page.getByRole("dialog", { name: "Modal Header" });
        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveAttribute("data-slot", "dialog-content");
        await expect(dialog).toHaveAttribute("aria-modal", "true");

        await page.keyboard.press("Escape");
        await expect(dialog).toBeHidden();
        await expectNoStoryErrors(page, errors);
    });

    test("drawer opens, exposes sheet dialog semantics, and closes via Close button", async ({
        page
    }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "drawer--base");
        await waitForStoryContent(page);

        await page.getByRole("button", { name: "Open Drawer" }).click();

        const dialog = page.getByRole("dialog", { name: "Drawer Header" });
        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveAttribute("data-slot", "drawer-content");

        await dialog.getByRole("button", { name: "Close" }).first().click();
        await expect(dialog).toBeHidden();
        await expectNoStoryErrors(page, errors);
    });

    test("pin-input accepts typed code into UI SDK OTP slots", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "pin-input--base");
        await waitForStoryContent(page);

        const input = page.getByRole("textbox");
        await input.click();
        await input.fill("429");

        const slots = page.locator('[data-slot="otp-input-slot"]');
        await expect(slots).toHaveCount(3);
        await expect(slots.nth(0)).toHaveText("4");
        await expect(slots.nth(1)).toHaveText("2");
        await expect(slots.nth(2)).toHaveText("9");
        await expectNoStoryErrors(page, errors);
    });

    test("editable toggles between preview and input and commits on Enter", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "editable--base");
        await waitForStoryContent(page);

        await page.getByRole("button", { name: "Edit" }).click();
        const input = page.getByRole("textbox");
        await expect(input).toBeVisible();
        await input.fill("Woof");
        await page.keyboard.press("Enter");

        await expect(page.getByText("Woof")).toBeVisible();
        await expectNoStoryErrors(page, errors);
    });

    test("toast displays notification in UI SDK ToastRegion", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "toast--base");
        await waitForStoryContent(page);

        await page.getByRole("button", { name: "Toast" }).click();

        const toast = page.locator('[data-slot="toast"]');
        await expect(toast).toBeVisible();
        await expect(toast).toContainText("Welcome!");
        await expectNoStoryErrors(page, errors);
    });
});
