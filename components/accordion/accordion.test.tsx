import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Accordion from "./index";

describe("Accordion", () => {
    it("exposes APG button / region relationships and UI SDK slots", async () => {
        const user = userEvent.setup();

        render(
            <Accordion.Root>
                <Accordion.Item value="one">
                    <Accordion.Trigger>Section one</Accordion.Trigger>
                    <Accordion.Content>Panel one content</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="two">
                    <Accordion.Trigger>Section two</Accordion.Trigger>
                    <Accordion.Content>Panel two content</Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        );

        expect(document.querySelector('[data-slot="accordion"]')).toBeInTheDocument();

        const triggers = screen.getAllByRole("button");
        expect(triggers).toHaveLength(2);

        for (const trigger of triggers) {
            expect(trigger).toHaveAttribute("aria-expanded");
            expect(trigger.closest("h2")).toBeTruthy();
        }

        expect(triggers[0]).toHaveAttribute("aria-expanded", "false");

        await user.click(triggers[0]);

        await waitFor(() => {
            expect(triggers[0]).toHaveAttribute("aria-expanded", "true");
        });

        expect(triggers[0]).toHaveAttribute("aria-controls");
        const panelId = triggers[0].getAttribute("aria-controls")!;
        const panel = document.getElementById(panelId);
        expect(panel).toHaveAttribute("role", "region");
        expect(panel).toHaveAttribute("aria-labelledby", triggers[0].id);
        expect(panel).toHaveTextContent("Panel one content");
        expect(panel).not.toHaveAttribute("hidden");
    });

    it("toggles with Enter and Space on the focused header", async () => {
        const user = userEvent.setup();

        render(
            <Accordion.Root collapsible>
                <Accordion.Item value="keyboard">
                    <Accordion.Trigger>Keyboard section</Accordion.Trigger>
                    <Accordion.Content>Keyboard panel</Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        );

        const trigger = screen.getByRole("button", { name: /Keyboard section/ });
        trigger.focus();

        await user.keyboard("{Enter}");
        await waitFor(() => {
            expect(trigger).toHaveAttribute("aria-expanded", "true");
        });

        await user.keyboard(" ");
        await waitFor(() => {
            expect(trigger).toHaveAttribute("aria-expanded", "false");
        });
    });

    it("moves focus between headers with Tab and supports multiple expanded items", async () => {
        const user = userEvent.setup();

        render(
            <Accordion.Root multiple>
                <Accordion.Item value="first">
                    <Accordion.Trigger>First</Accordion.Trigger>
                    <Accordion.Content>A</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="second">
                    <Accordion.Trigger>Second</Accordion.Trigger>
                    <Accordion.Content>B</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="third">
                    <Accordion.Trigger>Third</Accordion.Trigger>
                    <Accordion.Content>C</Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        );

        const first = screen.getByRole("button", { name: /First/ });
        const second = screen.getByRole("button", { name: /Second/ });
        const third = screen.getByRole("button", { name: /Third/ });

        first.focus();
        await user.tab();
        expect(second).toHaveFocus();

        await user.tab();
        expect(third).toHaveFocus();

        await user.click(first);
        await user.click(second);
        await waitFor(() => {
            expect(first).toHaveAttribute("aria-expanded", "true");
            expect(second).toHaveAttribute("aria-expanded", "true");
        });
    });

    it("hides collapsed panel content from interaction", async () => {
        const user = userEvent.setup();

        render(
            <Accordion.Root
                defaultValue={["open"]}
                keepMounted
            >
                <Accordion.Item value="open">
                    <Accordion.Trigger>Open</Accordion.Trigger>
                    <Accordion.Content>
                        <button type="button">Inside open</button>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="closed">
                    <Accordion.Trigger>Closed</Accordion.Trigger>
                    <Accordion.Content>
                        <button type="button">Inside closed</button>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        );

        expect(screen.getByRole("button", { name: "Inside open" })).toBeVisible();
        expect(screen.queryByRole("button", { name: "Inside closed" })).not.toBeInTheDocument();

        const panels = document.querySelectorAll('[data-slot="accordion-panel"]');
        expect(panels).toHaveLength(2);
        expect(panels[1]).toHaveAttribute("hidden");

        const closedTrigger = screen.getByRole("button", { name: /Closed/ });
        await user.click(closedTrigger);
        await waitFor(() => {
            expect(closedTrigger).toHaveAttribute("aria-expanded", "true");
        });
        expect(screen.getByRole("button", { name: "Inside closed" })).toBeVisible();
    });

    it("supports controlled value and onValueChange", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        function Fixture() {
            const [value, setValue] = useState<string[]>(["one"]);

            return (
                <Accordion.Root
                    onValueChange={(next, details) => {
                        onValueChange(next, details);
                        setValue(next);
                    }}
                    value={value}
                >
                    <Accordion.Item value="one">
                        <Accordion.Trigger>One</Accordion.Trigger>
                        <Accordion.Content>1</Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item value="two">
                        <Accordion.Trigger>Two</Accordion.Trigger>
                        <Accordion.Content>2</Accordion.Content>
                    </Accordion.Item>
                </Accordion.Root>
            );
        }

        render(<Fixture />);

        await user.click(screen.getByRole("button", { name: /Two/ }));
        expect(onValueChange).toHaveBeenCalledWith(["two"], expect.anything());
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Two/ })).toHaveAttribute(
                "aria-expanded",
                "true"
            );
        });
    });

    it("marks the chevron icon as aria-hidden", () => {
        render(
            <Accordion.Root>
                <Accordion.Item value="icon">
                    <Accordion.Trigger>Icon check</Accordion.Trigger>
                    <Accordion.Content>Body</Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        );

        const trigger = screen.getByRole("button", { name: /Icon check/ });
        const icon = trigger.querySelector("svg[aria-hidden='true']");
        expect(icon).toBeTruthy();
    });

    it("does not expand disabled items", async () => {
        const user = userEvent.setup();

        render(
            <Accordion.Root>
                <Accordion.Item
                    disabled
                    value="disabled"
                >
                    <Accordion.Trigger>Disabled</Accordion.Trigger>
                    <Accordion.Content>Nope</Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        );

        const trigger = screen.getByRole("button", { name: /Disabled/ });
        expect(trigger).toHaveAttribute("aria-disabled", "true");
        await user.click(trigger);
        expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
});
