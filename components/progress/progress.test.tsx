import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Progress } from "./index";

describe("Progress", () => {
    it("exposes progressbar role with valuemin valuemax and valuenow", () => {
        render(
            <Progress
                aria-label="Upload progress"
                max={100}
                min={0}
                value={40}
            />
        );

        const progressbar = screen.getByRole("progressbar", { name: "Upload progress" });
        expect(progressbar).toHaveAttribute("aria-valuemin", "0");
        expect(progressbar).toHaveAttribute("aria-valuemax", "100");
        expect(progressbar).toHaveAttribute("aria-valuenow", "40");
    });

    it("uses custom min and max for the progressbar value range", () => {
        render(
            <Progress
                aria-label="File upload"
                max={4}
                min={0}
                value={2}
            />
        );

        const progressbar = screen.getByRole("progressbar", { name: "File upload" });
        expect(progressbar).toHaveAttribute("aria-valuemin", "0");
        expect(progressbar).toHaveAttribute("aria-valuemax", "4");
        expect(progressbar).toHaveAttribute("aria-valuenow", "2");
    });

    it("forwards size scheme and remaining props to the root", () => {
        render(
            <Progress
                aria-label="Loading"
                className="custom-progress"
                data-testid="progress-root"
                scheme="success"
                size="lg"
                value={75}
            />
        );

        const root = screen.getByTestId("progress-root");
        expect(root).toHaveClass("custom-progress");
        expect(screen.getByRole("progressbar", { name: "Loading" })).toHaveAttribute(
            "aria-valuenow",
            "75"
        );
    });

    it("exposes aria-valuetext when percent alone is unclear", () => {
        render(
            <Progress
                aria-label="File upload"
                aria-valuetext="3 of 4 files"
                max={4}
                min={0}
                value={3}
            />
        );

        expect(screen.getByRole("progressbar", { name: "File upload" })).toHaveAttribute(
            "aria-valuetext",
            "3 of 4 files"
        );
    });

    it("renders ProgressLabel and formatted ProgressValue via label and showValue", () => {
        render(
            <Progress
                format={{ style: "unit", unit: "gigabyte" }}
                label="Download"
                locale="en-US"
                max={250}
                showValue
                value={120}
            />
        );

        const progressbar = screen.getByRole("progressbar", { name: "Download" });
        expect(progressbar).toHaveAttribute("aria-valuenow", "120");
        expect(progressbar).toHaveAttribute("aria-valuemax", "250");
        expect(screen.getByText(/120\s*GB/)).toBeInTheDocument();
    });

    it("supports getValueLabel and custom visible valueLabel", () => {
        render(
            <Progress
                getValueLabel={(value, details) =>
                    `${value} of ${details.max} files, ${details.formatted}`
                }
                label="Copying files"
                max={12}
                showValue
                value={3}
                valueLabel="3 of 12"
            />
        );

        const progressbar = screen.getByRole("progressbar", { name: "Copying files" });
        expect(progressbar).toHaveAttribute("aria-valuetext", "3 of 12 files, 25%");
        expect(screen.getByText("3 of 12")).toBeInTheDocument();
    });

    it("marks indeterminate progress when value is null or omitted", () => {
        render(
            <Progress
                label="Connecting to server"
                value={null}
            />
        );

        const progressbar = screen.getByRole("progressbar", { name: "Connecting to server" });
        expect(progressbar).toHaveAttribute("data-indeterminate");
        expect(progressbar).not.toHaveAttribute("aria-valuenow");
    });
});
