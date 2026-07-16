import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Accordion from "./index";

describe("Accordion", () => {
    it("exposes APG button / region relationships", async () => {
        const user = userEvent.setup();

        render(
            <Accordion.Root reduceMotion>
                <Accordion.Item>
                    <Accordion.Trigger>Section one</Accordion.Trigger>
                    <Accordion.Content>Panel one content</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Trigger>Section two</Accordion.Trigger>
                    <Accordion.Content>Panel two content</Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        );

        const triggers = screen.getAllByRole("button");
        expect(triggers).toHaveLength(2);

        for (const trigger of triggers) {
            expect(trigger).toHaveAttribute("aria-expanded");
            expect(trigger).toHaveAttribute("aria-controls");
            expect(trigger.closest("h2")).toBeTruthy();
        }

        expect(triggers[0]).toHaveAttribute("aria-expanded", "false");

        await user.click(triggers[0]);

        await waitFor(() => {
            expect(triggers[0]).toHaveAttribute("aria-expanded", "true");
        });

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
            <Accordion.Root
                allowToggle
                reduceMotion
            >
                <Accordion.Item>
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

    it("moves focus between headers with ArrowDown / ArrowUp", async () => {
        const user = userEvent.setup();

        render(
            <Accordion.Root reduceMotion>
                <Accordion.Item>
                    <Accordion.Trigger>First</Accordion.Trigger>
                    <Accordion.Content>A</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Trigger>Second</Accordion.Trigger>
                    <Accordion.Content>B</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Trigger>Third</Accordion.Trigger>
                    <Accordion.Content>C</Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        );

        const first = screen.getByRole("button", { name: /First/ });
        const second = screen.getByRole("button", { name: /Second/ });
        const third = screen.getByRole("button", { name: /Third/ });

        first.focus();
        await user.keyboard("{ArrowDown}");
        expect(second).toHaveFocus();

        await user.keyboard("{ArrowDown}");
        expect(third).toHaveFocus();

        await user.keyboard("{ArrowUp}");
        expect(second).toHaveFocus();

        await user.keyboard("{Home}");
        expect(first).toHaveFocus();

        await user.keyboard("{End}");
        expect(third).toHaveFocus();
    });

    it("hides collapsed panel content from interaction", async () => {
        const user = userEvent.setup();

        render(
            <Accordion.Root
                allowMultiple={false}
                defaultIndex={0}
                reduceMotion
            >
                <Accordion.Item>
                    <Accordion.Trigger>Open</Accordion.Trigger>
                    <Accordion.Content>
                        <button type="button">Inside open</button>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Trigger>Closed</Accordion.Trigger>
                    <Accordion.Content>
                        <button type="button">Inside closed</button>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        );

        expect(screen.getByRole("button", { name: "Inside open" })).toBeVisible();

        const closedTrigger = screen.getByRole("button", { name: /Closed/ });
        const closedPanelId = closedTrigger.getAttribute("aria-controls")!;
        const closedPanel = document.getElementById(closedPanelId);
        expect(closedPanel).toHaveAttribute("hidden");

        await user.click(closedTrigger);
        await waitFor(() => {
            expect(closedTrigger).toHaveAttribute("aria-expanded", "true");
        });
        expect(screen.getByRole("button", { name: "Inside closed" })).toBeVisible();
    });

    it("supports controlled index and onChange", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        function Fixture() {
            const [index, setIndex] = useState<number | number[]>(0);

            return (
                <Accordion.Root
                    index={index}
                    onChange={(next) => {
                        onChange(next);
                        setIndex(next);
                    }}
                    reduceMotion
                >
                    <Accordion.Item>
                        <Accordion.Trigger>One</Accordion.Trigger>
                        <Accordion.Content>1</Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Trigger>Two</Accordion.Trigger>
                        <Accordion.Content>2</Accordion.Content>
                    </Accordion.Item>
                </Accordion.Root>
            );
        }

        render(<Fixture />);

        await user.click(screen.getByRole("button", { name: /Two/ }));
        expect(onChange).toHaveBeenCalled();
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Two/ })).toHaveAttribute(
                "aria-expanded",
                "true"
            );
        });
    });

    it("marks the chevron icon as aria-hidden", () => {
        render(
            <Accordion.Root reduceMotion>
                <Accordion.Item>
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
            <Accordion.Root reduceMotion>
                <Accordion.Item isDisabled>
                    <Accordion.Trigger>Disabled</Accordion.Trigger>
                    <Accordion.Content>Nope</Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        );

        const trigger = screen.getByRole("button", { name: /Disabled/ });
        expect(trigger).toBeDisabled();
        await user.click(trigger);
        expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
});
