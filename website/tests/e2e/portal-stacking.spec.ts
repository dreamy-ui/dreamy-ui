import { expect, test, type Locator, type Page } from "@playwright/test";

interface PortalLayer {
    base: string;
    local: string;
    zIndex: number;
}

async function gotoStory(page: Page, storyId: string) {
    await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
    await page.locator("#storybook-root").waitFor({ state: "attached" });
}

async function getPortalLayer(locator: Locator): Promise<PortalLayer> {
    return locator.evaluate(function readPortalLayer(element) {
        const portal = element.closest<HTMLElement>(".dreamy-portal");
        if (!portal) throw new Error("Expected element to be rendered inside a Dreamy UI Portal");

        const styles = getComputedStyle(portal);
        return {
            base: styles.getPropertyValue("--dreamy-portal-base-z-index").trim(),
            local: styles.getPropertyValue("--dreamy-portal-local-z-index").trim(),
            zIndex: Number(styles.zIndex)
        };
    });
}

test.describe("Shared overlay host", function sharedOverlayHostTests() {
    test("automatically stacks a Select inside a Modal", async function testSelectInModal({
        page
    }) {
        await gotoStory(page, "select--shared-overlay-stack");

        await expect(page.locator(".dreamy-portal-host")).toHaveCount(1);

        const pageSelectLayer = await getPortalLayer(page.getByTestId("page-select-content"));
        const modalLayer = await getPortalLayer(page.getByTestId("modal-content"));
        const modalSelectLayer = await getPortalLayer(page.getByTestId("modal-select-content"));

        expect(pageSelectLayer.zIndex).toBe(1000);
        expect(modalLayer.zIndex).toBe(1400);
        expect(modalSelectLayer.zIndex).toBe(2400);
    });

    test("adds a stacking scope for each nested Menu", async function testNestedMenus({ page }) {
        await gotoStory(page, "menu--nested-menu");

        await page.getByRole("button", { name: "Open Menu" }).click();
        await page.getByRole("button", { name: "More options" }).hover();
        await expect(page.getByRole("button", { name: "Battery" })).toBeVisible();
        await page.getByRole("button", { name: "Advanced" }).hover();
        await expect(page.getByRole("button", { name: "Export data" })).toBeVisible();

        expect((await getPortalLayer(page.getByRole("button", { name: "Add new" }))).zIndex).toBe(
            1000
        );
        expect((await getPortalLayer(page.getByRole("button", { name: "Battery" }))).zIndex).toBe(
            2000
        );
        expect(
            (await getPortalLayer(page.getByRole("button", { name: "Export data" }))).zIndex
        ).toBe(3000);
        await expect(page.locator(".dreamy-portal-host")).toHaveCount(1);
    });

    test("renders Toast in the shared toast layer", async function testToastLayer({ page }) {
        await gotoStory(page, "toast--base");

        await page.getByRole("button", { name: "Toast", exact: true }).click();
        const toast = page.getByText("Welcome!");
        await expect(toast).toBeVisible();

        expect((await getPortalLayer(toast)).zIndex).toBe(1700);
        await expect(page.locator(".dreamy-portal-host")).toHaveCount(1);
    });

    test("uses one Top Layer host and adds nested portal layers", async function testNestedScopes({
        page
    }) {
        await gotoStory(page, "portal--nested-scopes");

        const host = page.locator(".dreamy-portal-host");
        await expect(host).toHaveCount(1);
        await expect(page.locator(".dreamy-portal-host:popover-open")).toHaveCount(1);
        await expect(page.locator('.dreamy-portal-host[popover="manual"]')).toHaveCount(1);

        const pageDropdown = page.getByTestId("page-dropdown");
        const modal = page.getByTestId("modal-scope");
        const nestedDropdown = page.getByTestId("nested-dropdown");

        const pageLayer = await getPortalLayer(pageDropdown);
        const modalLayer = await getPortalLayer(modal);
        const nestedLayer = await getPortalLayer(nestedDropdown);

        expect(pageLayer.zIndex).toBe(1000);
        expect(modalLayer.zIndex).toBe(1400);
        expect(nestedLayer.zIndex).toBe(2400);
        expect(nestedLayer.base).toBe("1400");
        expect(nestedLayer.local).toBe("1000");

        const isNestedInModalPortal = await nestedDropdown.evaluate(function checkParent(element) {
            const nestedPortal = element.closest(".dreamy-portal");
            const modalPortal = document
                .querySelector('[data-testid="modal-scope"]')
                ?.closest(".dreamy-portal");
            return Boolean(nestedPortal && modalPortal && modalPortal.contains(nestedPortal));
        });
        expect(isNestedInModalPortal).toBe(true);
    });

    test("moves an activated equal layer to the front", async function testEqualLayerOrder({
        page
    }) {
        await gotoStory(page, "portal--equal-layer-open-order");

        const first = page.getByTestId("first-equal-layer");
        const second = page.getByTestId("second-equal-layer");

        await page.getByTestId("activate-first").click();
        await page.evaluate(function waitForFrame() {
            return new Promise<void>(function resolveOnFrame(resolve) {
                requestAnimationFrame(function resolveFrame() {
                    resolve();
                });
            });
        });

        let lastPortal = page.locator(".dreamy-portal-host > .dreamy-portal").last();
        await expect(lastPortal.getByTestId("first-equal-layer")).toBeAttached();

        await page.getByTestId("activate-second").click();
        await page.evaluate(function waitForFrame() {
            return new Promise<void>(function resolveOnFrame(resolve) {
                requestAnimationFrame(function resolveFrame() {
                    resolve();
                });
            });
        });

        lastPortal = page.locator(".dreamy-portal-host > .dreamy-portal").last();
        await expect(lastPortal.getByTestId("second-equal-layer")).toBeAttached();
        await expect(first).toBeAttached();
        await expect(second).toBeAttached();
    });

    test("keeps an earlier modal subtree below a later sibling modal", async function testSiblingScopes({
        page
    }) {
        await gotoStory(page, "portal--sibling-modal-scopes");

        const firstModal = page.getByTestId("first-modal-scope");
        const firstTooltip = page.getByTestId("first-modal-tooltip");

        const firstPortal = firstModal.locator("xpath=ancestor::*[contains(@class, 'dreamy-portal')][1]");
        const firstTooltipLayer = await getPortalLayer(firstTooltip);

        expect(firstTooltipLayer.zIndex).toBe(3200);
        expect(
            await firstPortal.evaluate(function isBefore(first) {
                const second = document
                    .querySelector('[data-testid="second-modal-scope"]')
                    ?.closest(".dreamy-portal");
                return Boolean(
                    second &&
                        (first.compareDocumentPosition(second) &
                            Node.DOCUMENT_POSITION_FOLLOWING)
                );
            })
        ).toBe(true);
    });

    test("falls back to the shared host without the Popover API", async function testFallback({
        page
    }) {
        await gotoStory(page, "portal--fallback-host");

        await expect(page.locator(".dreamy-portal-host")).toHaveCount(1);
        await expect(page.locator('.dreamy-portal-host[popover="manual"]')).toHaveCount(0);
        expect((await getPortalLayer(page.getByTestId("fallback-portal-content"))).zIndex).toBe(1500);
    });

    test("removes the shared host after its last portal unmounts", async function testCleanup({
        page
    }) {
        await gotoStory(page, "portal--host-cleanup");

        await expect(page.locator(".dreamy-portal-host")).toHaveCount(1);
        await page.getByTestId("toggle-portal").click();
        await expect(page.locator(".dreamy-portal-host")).toHaveCount(0);

        await page.getByTestId("toggle-portal").click();
        await expect(page.locator(".dreamy-portal-host")).toHaveCount(1);
    });
});
