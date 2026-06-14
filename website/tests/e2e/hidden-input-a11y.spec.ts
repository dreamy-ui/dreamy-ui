import { expect, test, type Page } from "@playwright/test";

async function gotoStory(page: Page, storyId: string) {
    await page.goto(`http://localhost:6006/iframe.html?id=form-accessibility--${storyId}&viewMode=story`);
    await page.locator("#storybook-root").waitFor({ state: "attached" });
}

async function gotoComponentStory(page: Page, storyId: string) {
    await page.goto(`http://localhost:6006/iframe.html?id=${storyId}&viewMode=story`);
    await page.locator("#storybook-root").waitFor({ state: "attached" });
}

test.describe("Hidden input prop forwarding", () => {
    test("select hidden select receives name, required, autocomplete, and custom props", async ({
        page
    }) => {
        await gotoStory(page, "hidden-input-props");
        const hidden = page.locator('[data-testid="fruit-hidden-select"]');
        await expect(hidden).toBeAttached();
        await expect(hidden).toHaveAttribute("name", "fruit");
        await expect(hidden).toHaveAttribute("autocomplete", "on");
        await expect(hidden).toHaveJSProperty("required", true);
        await expect(hidden).toHaveAttribute("data-custom", "fruit-select");
        await expect(hidden).toHaveAttribute("tabindex", "-1");
    });

    test("switch hidden input receives custom props via inputProps", async ({ page }) => {
        await gotoStory(page, "hidden-input-props");
        const hidden = page.locator('[data-testid="notifications-hidden-input"]');
        await expect(hidden).toBeAttached();
        await expect(hidden).toHaveAttribute("name", "notifications");
        await expect(hidden).toHaveAttribute("type", "checkbox");
    });

    test("slider hidden input receives custom props via inputProps", async ({ page }) => {
        await gotoStory(page, "hidden-input-props");
        const hidden = page.locator('[data-testid="volume-hidden-input"]');
        await expect(hidden).toBeAttached();
        await expect(hidden).toHaveAttribute("name", "volume");
        await expect(hidden).toHaveAttribute("type", "range");
        await expect(hidden).toHaveAttribute("hidden", "");
    });

    test("checkbox hidden input has correct type and name", async ({ page }) => {
        await gotoStory(page, "hidden-input-props");
        const hidden = page.locator('input[name="newsletter"]');
        await expect(hidden).toBeAttached();
        await expect(hidden).toHaveAttribute("type", "checkbox");
        await expect(hidden).toHaveAttribute("value", "yes");
    });

    test("radio hidden inputs share name attribute", async ({ page }) => {
        await gotoStory(page, "hidden-input-props");
        const radios = page.locator('input[name="plan"]');
        await expect(radios).toHaveCount(2);
    });
});

test.describe("Field label focus", () => {
    test("clicking input label focuses the text input", async ({ page }) => {
        await gotoStory(page, "label-focus");
        await page.locator('[data-testid="username-label"]').click();
        await expect(page.locator('[data-testid="username-input"]')).toBeFocused();
    });

    test("clicking select label focuses the select trigger", async ({ page }) => {
        await gotoStory(page, "label-focus");
        const label = page.locator('[data-testid="role-label"]');
        const trigger = page.locator('[data-testid="role-trigger"]');
        await expect(label).toHaveAttribute("for", "role-field");
        await expect(trigger).toHaveAttribute("id", "role-field");
        await label.click();
        await expect(trigger).toBeFocused();
    });

    test("clicking checkbox label focuses the hidden checkbox input", async ({ page }) => {
        await gotoStory(page, "label-focus");
        const label = page.locator('[data-testid="terms-label"]');
        const checkbox = page.locator("#terms-field");
        await expect(checkbox).toBeAttached();
        await expect(label).toHaveAttribute("for", "terms-field");
        await label.click();
        await expect(checkbox).toBeFocused();
    });
});

test.describe("Hidden select autofill simulation", () => {
    test("changing hidden select updates visible trigger and controlled value", async ({ page }) => {
        await gotoStory(page, "hidden-select-autofill");
        await page.locator('[data-testid="autofill-simulator"]').selectOption("uk");
        await expect(page.locator('[data-testid="autofill-value"]')).toContainText("uk");
        await expect(page.locator('[data-testid="autofill-trigger"]')).toContainText(
            "United Kingdom"
        );
    });
});

test.describe("Autocomplete form", () => {
    test("form fields have correct autocomplete attributes", async ({ page }) => {
        await gotoStory(page, "autocomplete-form");
        await expect(page.locator('[data-testid="given-name-input"]')).toHaveAttribute(
            "autocomplete",
            "given-name"
        );
        await expect(page.locator('[data-testid="family-name-input"]')).toHaveAttribute(
            "autocomplete",
            "family-name"
        );
        await expect(page.locator('[data-testid="email-input"]')).toHaveAttribute(
            "autocomplete",
            "email"
        );
        await expect(page.locator('[data-testid="country-hidden-select"]')).toHaveAttribute(
            "autocomplete",
            "country"
        );
    });

    test("filling inputs and submitting captures values", async ({ page }) => {
        await gotoStory(page, "autocomplete-form");
        await page.locator('[data-testid="given-name-input"]').fill("Jane");
        await page.locator('[data-testid="family-name-input"]').fill("Smith");
        await page.locator('[data-testid="email-input"]').fill("jane@example.com");

        await page.locator('[data-testid="country-trigger"]').click();
        await page.getByRole("button", { name: "Poland", exact: true }).click();

        await page.locator('[data-testid="bio-textarea"]').fill("Hello world");
        await page.locator('[data-testid="submit-button"]').click();

        const output = page.locator('[data-testid="form-output"]');
        await expect(output).toContainText('"given-name": "Jane"');
        await expect(output).toContainText('"family-name": "Smith"');
        await expect(output).toContainText('"email": "jane@example.com"');
        await expect(output).toContainText('"country": "pl"');
        await expect(output).toContainText('"bio": "Hello world"');
    });

    test("label click focuses country select trigger", async ({ page }) => {
        await gotoStory(page, "autocomplete-form");
        await page.locator('[data-testid="country-label"]').click();
        await expect(page.locator('[data-testid="country-trigger"]')).toBeFocused();
    });
});

test.describe("Select story hidden input", () => {
    test("base select has hidden native select for form integration", async ({ page }) => {
        await gotoComponentStory(page, "select--base");
        const hidden = page.locator('select[tabindex="-1"]');
        await expect(hidden).toBeAttached();
        await expect(hidden).toHaveAttribute("autocomplete", "off");
    });
});

test.describe("Checkbox story hidden input", () => {
    test("checkbox has visually hidden native input", async ({ page }) => {
        await gotoComponentStory(page, "checkbox--base");
        const hidden = page.locator('input[type="checkbox"]');
        await expect(hidden).toBeAttached();
        await expect(hidden).toHaveClass(/peer/);
    });
});

test.describe("Switch story hidden input", () => {
    test("switch has visually hidden native input", async ({ page }) => {
        await gotoComponentStory(page, "switch--base");
        const hidden = page.locator('input[type="checkbox"]');
        await expect(hidden).toBeAttached();
    });
});

test.describe("Slider story hidden input", () => {
    test("slider has hidden range input", async ({ page }) => {
        await gotoComponentStory(page, "slider--base");
        const hidden = page.locator('input[type="range"][hidden]');
        await expect(hidden).toBeAttached();
    });
});
