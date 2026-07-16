import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Collapse, Scale } from "./index";

function CollapseHarness() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={function toggle() {
                    setIsOpen(function next(value) {
                        return !value;
                    });
                }}
            >
                Toggle collapse
            </button>
            <Collapse
                data-testid="collapse"
                isOpen={isOpen}
            >
                <p>Collapse content</p>
            </Collapse>
        </>
    );
}

function CollapseUnmountHarness() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={function toggle() {
                    setIsOpen(function next(value) {
                        return !value;
                    });
                }}
            >
                Toggle unmount
            </button>
            <Collapse
                data-testid="collapse-unmount"
                isOpen={isOpen}
                unmountOnExit
            >
                <button type="button">Inside collapse</button>
            </Collapse>
        </>
    );
}

function ScaleHarness() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={function toggle() {
                    setIsOpen(function next(value) {
                        return !value;
                    });
                }}
            >
                Toggle scale
            </button>
            <Scale
                data-testid="scale"
                isOpen={isOpen}
                unmountOnExit
            >
                <p>Scale content</p>
            </Scale>
        </>
    );
}

describe("Transitions", () => {
    it("does not add a widget role to Collapse", () => {
        render(
            <Collapse
                data-testid="collapse"
                isOpen
            >
                <p>Hello</p>
            </Collapse>
        );

        const root = screen.getByTestId("collapse");

        expect(root).not.toHaveAttribute("role");
        expect(screen.getByText("Hello")).toBeInTheDocument();
    });

    it("does not add a widget role to Scale", () => {
        render(
            <Scale
                data-testid="scale"
                isOpen
            >
                <p>Hello</p>
            </Scale>
        );

        const root = screen.getByTestId("scale");

        expect(root).not.toHaveAttribute("role");
        expect(screen.getByText("Hello")).toBeInTheDocument();
    });

    it("opens and closes Collapse while reduced motion is enabled", async () => {
        const user = userEvent.setup();

        render(<CollapseHarness />);

        expect(screen.getByText("Collapse content")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Toggle collapse" }));
        expect(screen.getByText("Collapse content")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Toggle collapse" }));
        expect(screen.getByText("Collapse content")).toBeInTheDocument();
    });

    it("unmounts Collapse content when closed with unmountOnExit", async () => {
        const user = userEvent.setup();

        render(<CollapseUnmountHarness />);

        expect(screen.queryByRole("button", { name: "Inside collapse" })).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Toggle unmount" }));
        expect(screen.getByRole("button", { name: "Inside collapse" })).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Toggle unmount" }));
        expect(screen.queryByRole("button", { name: "Inside collapse" })).not.toBeInTheDocument();
    });

    it("unmounts Scale content when closed with unmountOnExit", async () => {
        const user = userEvent.setup();

        render(<ScaleHarness />);

        expect(screen.queryByText("Scale content")).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Toggle scale" }));
        expect(screen.getByText("Scale content")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Toggle scale" }));
        expect(screen.queryByText("Scale content")).not.toBeInTheDocument();
    });

    it("keeps closed unmounted content out of the tab order", async () => {
        const user = userEvent.setup();

        render(<CollapseUnmountHarness />);

        await user.tab();
        expect(screen.getByRole("button", { name: "Toggle unmount" })).toHaveFocus();

        await user.tab();
        expect(screen.queryByRole("button", { name: "Inside collapse" })).not.toBeInTheDocument();
    });
});
