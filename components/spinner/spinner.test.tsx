import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Spinner } from "./index";

describe("Spinner", () => {
    it("renders a visible label for status loading", () => {
        render(
            <Spinner
                data-testid="spinner"
                label="Loading"
                role="status"
            />
        );

        const root = screen.getByTestId("spinner");

        expect(root).toHaveAttribute("role", "status");
        expect(screen.getByText("Loading")).toBeInTheDocument();
        expect(root.querySelector('[data-part="circle1"]')).toBeInTheDocument();
        expect(root.querySelector('[data-part="circle2"]')).toBeInTheDocument();
    });

    it("supports decorative mode with aria-hidden", () => {
        render(
            <Spinner
                aria-hidden="true"
                data-testid="spinner"
            />
        );

        expect(screen.getByTestId("spinner")).toHaveAttribute("aria-hidden", "true");
    });

    it("accepts size, speed, and aria-label", () => {
        render(
            <Spinner
                aria-label="Fetching data"
                data-testid="spinner"
                size="lg"
                speed="1.5s"
            />
        );

        const root = screen.getByTestId("spinner");

        expect(root).toHaveAttribute("aria-label", "Fetching data");
        expect(root).toHaveStyle({ "--spinner-speed": "1.5s" });
        expect(root.tagName).toBe("DIV");
    });

    it("does not announce circles separately or force focus onto the spinner", async () => {
        const user = userEvent.setup();

        render(
            <>
                <button type="button">Before</button>
                <Spinner
                    data-testid="spinner"
                    label="Loading"
                    role="status"
                />
                <button type="button">After</button>
            </>
        );

        const root = screen.getByTestId("spinner");
        const circle1 = root.querySelector('[data-part="circle1"]');
        const circle2 = root.querySelector('[data-part="circle2"]');

        expect(circle1).not.toHaveAttribute("aria-label");
        expect(circle2).not.toHaveAttribute("aria-label");
        expect(circle1).not.toHaveAttribute("role");
        expect(circle2).not.toHaveAttribute("role");
        expect(root).not.toHaveAttribute("tabindex");

        await user.tab();
        expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
});
