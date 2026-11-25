import { createEditableController, editablePrimitive } from "@dreamy-ui/react";
import { checkServer, mount } from "@ui-sdk/core/testing";
import { createAgent } from "@ui-sdk/react/agent";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Editable from "./index";

const editableMarkup = `
    <root>
        <preview>Ada</preview>
        <input tabindex="0"></input>
        <edit-trigger>Edit</edit-trigger>
        <submit-trigger>Submit</submit-trigger>
        <cancel-trigger>Cancel</cancel-trigger>
    </root>
`;

describe("editablePrimitive", () => {
    beforeEach(() => {
        (globalThis as Record<string, unknown>).__UI_SDK_STRICT__ = true;
    });

    afterEach(() => {
        (globalThis as Record<string, unknown>).__UI_SDK_STRICT__ = false;
    });

    it("enters edit mode, commits on Enter, and reverts on Escape", async () => {
        const onValueCommit = vi.fn();
        const onValueRevert = vi.fn();

        const mounted = mount(
            editablePrimitive,
            {
                defaultValue: "Ada",
                submitMode: "enter",
                onValueCommit,
                onValueRevert
            },
            editableMarkup
        );

        try {
            const editBtn = mounted.part("edit-trigger")!;
            await mounted.click(editBtn);
            expect(mounted.state.editing).toBe(true);

            const input = mounted.part("input") as HTMLInputElement;
            input.value = "Grace";
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.focus();
            await mounted.keys("Enter");

            expect(mounted.state.editing).toBe(false);
            expect(mounted.state.value).toBe("Grace");
            expect(onValueCommit).toHaveBeenCalledWith("Grace");

            await mounted.click(editBtn);
            input.value = "Alan";
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.focus();
            await mounted.keys("Escape");

            expect(mounted.state.editing).toBe(false);
            expect(mounted.state.value).toBe("Grace");
            expect(onValueRevert).toHaveBeenCalledWith("Grace");
        } finally {
            mounted.unmount();
        }
    });

    it("passes SSR checkServer without a DOM", () => {
        const html = checkServer(editablePrimitive, { defaultValue: "Ada" }, editableMarkup);
        expect(html).toContain('data-editable-state="view"');
        expect(html).toContain('tabindex="0"');
    });

    it("supports imperative controller and agent actions", async () => {
        const agent = createAgent();
        const controller = createEditableController();

        render(
            <Editable.Root
                aria-label="Project title"
                controller={controller}
                defaultValue="Ada"
            >
                <Editable.Preview />
                <Editable.Input />
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </Editable.Root>
        );

        controller.edit();
        await waitFor(() => {
            expect(screen.getByDisplayValue("Ada")).toBeVisible();
        });

        const entry = agent.snapshot().find((c) => c.component === "editable");
        expect(entry?.ref).toBeDefined();

        if (entry) {
            const result = await agent.act({
                steps: [
                    { ref: entry.ref, action: "setValue", args: ["Grace"] },
                    { ref: entry.ref, action: "submit" }
                ]
            });
            expect(result.ok).toBe(true);
            await waitFor(() => {
                expect(screen.getByText("Grace")).toBeVisible();
            });
        }
    });
});
