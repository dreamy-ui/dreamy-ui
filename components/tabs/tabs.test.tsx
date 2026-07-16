import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Tabs from "./index";

describe("Tabs", () => {
    it("exposes tablist / tab / tabpanel roles and associations", () => {
        render(
            <Tabs.Root>
                <Tabs.List>
                    <Tabs.Tab>Tab 1</Tabs.Tab>
                    <Tabs.Tab>Tab 2</Tabs.Tab>
                    <Tabs.Tab>Tab 3</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                    <Tabs.Panel>Panel 1</Tabs.Panel>
                    <Tabs.Panel>Panel 2</Tabs.Panel>
                    <Tabs.Panel>Panel 3</Tabs.Panel>
                </Tabs.Panels>
            </Tabs.Root>
        );

        const tablist = screen.getByRole("tablist");
        expect(tablist).toHaveAttribute("aria-orientation", "horizontal");

        const tabs = screen.getAllByRole("tab");
        expect(tabs).toHaveLength(3);
        expect(tabs[0]).toHaveAttribute("aria-selected", "true");
        expect(tabs[1]).toHaveAttribute("aria-selected", "false");
        expect(tabs[0]).toHaveAttribute("tabIndex", "0");
        expect(tabs[1]).toHaveAttribute("tabIndex", "-1");

        const panels = screen.getAllByRole("tabpanel");
        expect(panels.length).toBeGreaterThanOrEqual(1);

        const controls = tabs[0].getAttribute("aria-controls");
        expect(controls).toBeTruthy();
        const panel = document.getElementById(controls!);
        expect(panel).toHaveAttribute("role", "tabpanel");
        expect(panel).toHaveAttribute("aria-labelledby", tabs[0].id);
        expect(panel).toHaveTextContent("Panel 1");
    });

    it("moves selection with ArrowRight / ArrowLeft (roving tabindex)", async () => {
        const user = userEvent.setup();

        render(
            <Tabs.Root>
                <Tabs.List>
                    <Tabs.Tab>One</Tabs.Tab>
                    <Tabs.Tab>Two</Tabs.Tab>
                    <Tabs.Tab>Three</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                    <Tabs.Panel>P1</Tabs.Panel>
                    <Tabs.Panel>P2</Tabs.Panel>
                    <Tabs.Panel>P3</Tabs.Panel>
                </Tabs.Panels>
            </Tabs.Root>
        );

        const tabs = screen.getAllByRole("tab");
        tabs[0].focus();
        expect(tabs[0]).toHaveFocus();

        await user.keyboard("{ArrowRight}");
        await waitFor(() => {
            expect(tabs[1]).toHaveFocus();
            expect(tabs[1]).toHaveAttribute("aria-selected", "true");
            expect(tabs[1]).toHaveAttribute("tabIndex", "0");
            expect(tabs[0]).toHaveAttribute("tabIndex", "-1");
        });

        await user.keyboard("{ArrowLeft}");
        await waitFor(() => {
            expect(tabs[0]).toHaveFocus();
            expect(tabs[0]).toHaveAttribute("aria-selected", "true");
        });
    });

    it("supports vertical orientation arrow keys", async () => {
        const user = userEvent.setup();

        render(
            <Tabs.Root orientation="vertical">
                <Tabs.List>
                    <Tabs.Tab>A</Tabs.Tab>
                    <Tabs.Tab>B</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                    <Tabs.Panel>PA</Tabs.Panel>
                    <Tabs.Panel>PB</Tabs.Panel>
                </Tabs.Panels>
            </Tabs.Root>
        );

        const tablist = screen.getByRole("tablist");
        expect(tablist).toHaveAttribute("aria-orientation", "vertical");

        const tabs = screen.getAllByRole("tab");
        tabs[0].focus();
        await user.keyboard("{ArrowDown}");

        await waitFor(() => {
            expect(tabs[1]).toHaveFocus();
            expect(tabs[1]).toHaveAttribute("aria-selected", "true");
        });
    });

    it("hides inactive panels from interaction", async () => {
        const user = userEvent.setup();

        render(
            <Tabs.Root>
                <Tabs.List>
                    <Tabs.Tab>First</Tabs.Tab>
                    <Tabs.Tab>Second</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                    <Tabs.Panel>
                        <button type="button">In first</button>
                    </Tabs.Panel>
                    <Tabs.Panel>
                        <button type="button">In second</button>
                    </Tabs.Panel>
                </Tabs.Panels>
            </Tabs.Root>
        );

        expect(screen.getByRole("button", { name: "In first" })).toBeVisible();
        expect(screen.queryByRole("button", { name: "In second" })).not.toBeInTheDocument();

        await user.click(screen.getByRole("tab", { name: "Second" }));

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "In second" })).toBeVisible();
        });
        expect(screen.queryByRole("button", { name: "In first" })).not.toBeInTheDocument();
    });

    it("supports controlled index and onChange", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        function Fixture() {
            const [index, setIndex] = useState(0);

            return (
                <Tabs.Root
                    index={index}
                    onChange={(next) => {
                        onChange(next);
                        setIndex(next);
                    }}
                >
                    <Tabs.List>
                        <Tabs.Tab>Alpha</Tabs.Tab>
                        <Tabs.Tab>Beta</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panels>
                        <Tabs.Panel>A</Tabs.Panel>
                        <Tabs.Panel>B</Tabs.Panel>
                    </Tabs.Panels>
                </Tabs.Root>
            );
        }

        render(<Fixture />);

        await user.click(screen.getByRole("tab", { name: "Beta" }));
        expect(onChange).toHaveBeenCalledWith(1);
        expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("aria-selected", "true");
    });

    it("keeps selection manual until activation when isManual", async () => {
        const user = userEvent.setup();

        render(
            <Tabs.Root isManual>
                <Tabs.List>
                    <Tabs.Tab>Manual 1</Tabs.Tab>
                    <Tabs.Tab>Manual 2</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                    <Tabs.Panel>M1</Tabs.Panel>
                    <Tabs.Panel>M2</Tabs.Panel>
                </Tabs.Panels>
            </Tabs.Root>
        );

        const tabs = screen.getAllByRole("tab");
        tabs[0].focus();
        await user.keyboard("{ArrowRight}");

        await waitFor(() => {
            expect(tabs[1]).toHaveFocus();
        });
        expect(tabs[0]).toHaveAttribute("aria-selected", "true");
        expect(tabs[1]).toHaveAttribute("aria-selected", "false");

        await user.keyboard("{Enter}");
        await waitFor(() => {
            expect(tabs[1]).toHaveAttribute("aria-selected", "true");
        });
    });

    it("skips disabled tabs", async () => {
        const user = userEvent.setup();

        render(
            <Tabs.Root>
                <Tabs.List>
                    <Tabs.Tab>Enabled</Tabs.Tab>
                    <Tabs.Tab isDisabled>Disabled</Tabs.Tab>
                    <Tabs.Tab>Also enabled</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                    <Tabs.Panel>1</Tabs.Panel>
                    <Tabs.Panel>2</Tabs.Panel>
                    <Tabs.Panel>3</Tabs.Panel>
                </Tabs.Panels>
            </Tabs.Root>
        );

        const tabs = screen.getAllByRole("tab");
        expect(tabs[1]).toBeDisabled();

        tabs[0].focus();
        await user.keyboard("{ArrowRight}");

        await waitFor(() => {
            expect(tabs[2]).toHaveFocus();
            expect(tabs[2]).toHaveAttribute("aria-selected", "true");
        });
    });
});
