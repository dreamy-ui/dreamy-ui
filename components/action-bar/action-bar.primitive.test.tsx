import { actionBarPrimitive, createActionBarController } from "@dreamy-ui/react";
import { checkDirection, checkServer, mount } from "@ui-sdk/core/testing";
import { createAgent } from "@ui-sdk/react/agent";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import { render } from "../test/render";
import * as ActionBar from "./index";

const actionBarMarkup = `
    <root>
        <content>
            <selection-trigger>2 selected</selection-trigger>
            <separator></separator>
            <button id="btn-delete" type="button">Delete</button>
            <button id="btn-share" type="button">Share</button>
            <close-trigger>Close</close-trigger>
        </content>
    </root>
`;

describe("actionBarPrimitive", () => {
    beforeEach(() => {
        (globalThis as Record<string, unknown>).__UI_SDK_STRICT__ = true;
    });

    afterEach(() => {
        (globalThis as Record<string, unknown>).__UI_SDK_STRICT__ = false;
    });

    it("handles toolbar arrow navigation, Escape dismissal, and RTL direction", async () => {
        const onOpenChange = vi.fn();
        const mounted = mount(
            actionBarPrimitive,
            { defaultOpen: true, onOpenChange },
            actionBarMarkup
        );

        try {
            const deleteBtn = mounted.root.querySelector("#btn-delete") as HTMLButtonElement;
            const shareBtn = mounted.root.querySelector("#btn-share") as HTMLButtonElement;
            deleteBtn.focus();
            await mounted.keys("ArrowRight");
            expect(document.activeElement).toBe(shareBtn);

            await mounted.keys("Escape");
            expect(mounted.state.open).toBe(false);
            expect(onOpenChange).toHaveBeenCalledWith(
                false,
                expect.objectContaining({ reason: "escape-key" })
            );
        } finally {
            mounted.unmount();
        }

        await checkDirection(actionBarPrimitive, { defaultOpen: true }, actionBarMarkup);
    });

    it("passes SSR checkServer without a DOM", () => {
        const html = checkServer(actionBarPrimitive, { defaultOpen: true }, actionBarMarkup);
        expect(html).toContain('role="toolbar"');
        expect(html).toContain('role="separator"');
        expect(html).toContain('aria-label="Close action bar"');
    });

    it("supports imperative controller and agent actions", async () => {
        const agent = createAgent();
        const controller = createActionBarController();

        render(
            <ActionBar.Root
                controller={controller}
                defaultOpen
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
                    <Button size="sm">Archive</Button>
                    <ActionBar.CloseTrigger />
                </ActionBar.Content>
            </ActionBar.Root>
        );

        expect(screen.getByRole("toolbar", { name: "Action bar" })).toBeInTheDocument();

        const entry = agent.snapshot().find((c) => c.component === "action-bar");
        expect(entry?.ref).toBeDefined();

        if (entry) {
            const result = await agent.act({
                steps: [{ ref: entry.ref, action: "close" }]
            });
            expect(result.ok).toBe(true);
            await waitFor(() => {
                expect(
                    screen.queryByRole("toolbar", { name: "Action bar" })
                ).not.toBeInTheDocument();
            });
        }

        controller.open();
        await waitFor(() => {
            expect(screen.getByRole("toolbar", { name: "Action bar" })).toBeInTheDocument();
        });
    });
});
