import { expect, test } from "@playwright/test";
import {
    expectNoStoryErrors,
    gotoStory,
    waitForStoryContent,
    watchForStoryErrors
} from "./storybook";

test.describe("UI SDK Phase 3 composites & Field", () => {
    test("accordion expands items with UI SDK slots and region semantics", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "accordion--base");
        await waitForStoryContent(page);

        await expect(page.locator('[data-slot="accordion"]')).toBeVisible();
        const firstTrigger = page.getByRole("button", { name: "Item 1" });
        await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");

        await firstTrigger.click();
        await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
        await expect(page.getByRole("region", { name: "Item 1" })).toContainText("Hi!");
        await expectNoStoryErrors(page, errors);
    });

    test("tabs switches panels via click and arrow keys with UI SDK indicator", async ({
        page
    }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "tabs--base");
        await waitForStoryContent(page);

        const tablist = page.getByRole("tablist");
        await expect(tablist).toHaveAttribute("data-slot", "tabs-list");

        const tab1 = page.getByRole("tab", { name: "Tab 1" });
        const tab2 = page.getByRole("tab", { name: "Tab 2" });
        await expect(tab1).toHaveAttribute("aria-selected", "true");

        await tab1.focus();
        await page.keyboard.press("ArrowRight");
        await expect(tab2).toHaveAttribute("aria-selected", "true");
        await expect(page.getByRole("tabpanel")).toContainText("Tab 2");
        await expectNoStoryErrors(page, errors);
    });

    test("checkbox-card toggles checked state on click", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "checkbox-card--base");
        await waitForStoryContent(page);

        const card = page.getByRole("checkbox");
        await expect(card).toHaveAttribute("aria-checked", "false");

        await card.click();
        await expect(card).toHaveAttribute("aria-checked", "true");
        await expectNoStoryErrors(page, errors);
    });

    test("radio-card switches selection within RadioGroup", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "radio-card--base");
        await waitForStoryContent(page);

        const radios = page.getByRole("radio");
        await expect(radios.nth(0)).toHaveAttribute("aria-checked", "true");

        await radios.nth(1).click();
        await expect(radios.nth(1)).toHaveAttribute("aria-checked", "true");
        await expect(radios.nth(0)).toHaveAttribute("aria-checked", "false");
        await expectNoStoryErrors(page, errors);
    });

    test("action-bar opens from toggle, exposes toolbar, and dismisses with Escape", async ({
        page
    }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "action-bar--base");
        await waitForStoryContent(page);

        await page.getByText("Show Action Bar").click();
        const toolbar = page.getByRole("toolbar", { name: "Action bar" });
        await expect(toolbar).toBeVisible();

        await page.keyboard.press("Escape");
        await expect(toolbar).toBeHidden();
        await expectNoStoryErrors(page, errors);
    });

    test("field wires label, hint, and error via UI SDK slots", async ({ page }) => {
        const errors = watchForStoryErrors(page);
        await gotoStory(page, "field--field-error");
        await waitForStoryContent(page);

        await expect(page.locator('[data-slot="field"]')).toBeVisible();
        await expect(page.locator('[data-slot="field-label"]')).toContainText("Username");
        await expect(page.locator('[data-slot="field-error"]')).toContainText(
            "This username is too short!"
        );

        const input = page.getByRole("textbox", { name: "Username" });
        await expect(input).toHaveAttribute("aria-invalid", "true");
        await expectNoStoryErrors(page, errors);
    });
});
