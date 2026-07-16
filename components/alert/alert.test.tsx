import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Alert } from "./index";

describe("Alert", () => {
    it("uses role=status for informational / success alerts", () => {
        const { rerender } = render(
            <Alert
                description="Everything looks good."
                status="info"
                title="Info"
            />
        );

        const info = screen.getByRole("status");
        expect(info).toHaveTextContent("Info");
        expect(info).toHaveTextContent("Everything looks good.");
        expect(info).not.toHaveAttribute("role", "alertdialog");

        rerender(
            <Alert
                description="Saved successfully."
                status="success"
                title="Success"
            />
        );

        expect(screen.getByRole("status")).toHaveTextContent("Success");
    });

    it("uses role=alert for error (and urgent) status", () => {
        render(
            <Alert
                description="Something went wrong."
                status="error"
                title="Error"
            />
        );

        const alert = screen.getByRole("alert");
        expect(alert).toHaveTextContent("Error");
        expect(alert).toHaveTextContent("Something went wrong.");
        expect(alert).not.toHaveAttribute("role", "alertdialog");
    });

    it("exposes title and description structure and decorative icons", () => {
        render(
            <Alert
                description="Please verify your email."
                status="warning"
                title="Warning"
            />
        );

        const title = document.querySelector("[data-part='title']");
        const description = document.querySelector("[data-part='description']");
        const icon = document.querySelector("[data-part='icon']");

        expect(title).toHaveTextContent("Warning");
        expect(description).toHaveTextContent("Please verify your email.");
        expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("does not move focus into the alert on render", () => {
        render(
            <>
                <button type="button">Before</button>
                <Alert
                    data-testid="alert-root"
                    status="error"
                    title="Inline error"
                />
            </>
        );

        expect(document.activeElement).not.toBe(screen.getByTestId("alert-root"));
        expect(screen.getByRole("button", { name: "Before" })).toBeInTheDocument();
    });

    it("forwards status data attribute and custom className", () => {
        render(
            <Alert
                className="custom-alert"
                data-testid="alert-root"
                status="warning"
                title="Warn"
            />
        );

        const root = screen.getByTestId("alert-root");
        expect(root).toHaveAttribute("data-status", "warning");
        expect(root).toHaveClass("custom-alert");
    });
});
