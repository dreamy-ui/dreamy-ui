import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { DarkTheme, LightTheme } from "./index";

describe("Theme", () => {
    it("scopes dark theme without interactive semantics", () => {
        render(
            <DarkTheme data-testid="dark-theme">
                <p>Dark content</p>
            </DarkTheme>
        );

        const root = screen.getByTestId("dark-theme");

        expect(root.tagName).toBe("DIV");
        expect(root).toHaveAttribute("data-theme", "dark");
        expect(root).toHaveClass("dark");
        expect(root).not.toHaveAttribute("role");
        expect(root).not.toHaveAttribute("tabindex");
        expect(screen.getByText("Dark content")).toBeInTheDocument();
    });

    it("scopes light theme without interactive semantics", () => {
        render(
            <LightTheme data-testid="light-theme">
                <p>Light content</p>
            </LightTheme>
        );

        const root = screen.getByTestId("light-theme");

        expect(root.tagName).toBe("DIV");
        expect(root).toHaveAttribute("data-theme", "light");
        expect(root).toHaveClass("light");
        expect(root).not.toHaveAttribute("role");
        expect(root).not.toHaveAttribute("tabindex");
        expect(screen.getByText("Light content")).toBeInTheDocument();
    });

    it("forwards className and children through nested themes", () => {
        render(
            <DarkTheme
                className="outer"
                data-testid="outer"
            >
                <LightTheme
                    className="inner"
                    data-testid="inner"
                >
                    Nested
                </LightTheme>
            </DarkTheme>
        );

        const outer = screen.getByTestId("outer");
        const inner = screen.getByTestId("inner");

        expect(outer).toHaveClass("dark");
        expect(outer).toHaveClass("outer");
        expect(inner).toHaveAttribute("data-theme", "light");
        expect(inner).toHaveClass("light");
        expect(inner).toHaveClass("inner");
        expect(screen.getByText("Nested")).toBeInTheDocument();
    });

    it("does not become a focusable control", () => {
        render(
            <DarkTheme data-testid="theme">
                <button type="button">Inside</button>
            </DarkTheme>
        );

        const theme = screen.getByTestId("theme");
        const button = screen.getByRole("button", { name: "Inside" });

        expect(theme).not.toHaveAttribute("tabindex");
        expect(button).toBeInTheDocument();
    });
});
