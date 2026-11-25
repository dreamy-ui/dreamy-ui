import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { ProgressCircular } from "./index";

describe("ProgressCircular", () => {
    it("exposes progressbar role with valuemin valuemax and valuenow", () => {
        render(
            <ProgressCircular
                aria-label="Upload progress"
                max={100}
                min={0}
                value={40}
            />
        );

        const progressbar = screen.getByRole("progressbar", { name: "Upload progress" });
        expect(progressbar).toHaveAttribute("role", "progressbar");
        expect(progressbar).toHaveAttribute("aria-valuemin", "0");
        expect(progressbar).toHaveAttribute("aria-valuemax", "100");
        expect(progressbar).toHaveAttribute("aria-valuenow", "40");
    });

    it("omits aria-valuenow when indeterminate", () => {
        render(<ProgressCircular aria-label="Working" />);

        const progressbar = screen.getByRole("progressbar", { name: "Working" });
        expect(progressbar).toHaveAttribute("aria-valuemin", "0");
        expect(progressbar).toHaveAttribute("aria-valuemax", "100");
        expect(progressbar).not.toHaveAttribute("aria-valuenow");
        expect(progressbar).toHaveAttribute("data-indeterminate");
    });

    it("hides the SVG rings from AT and exposes a named root", () => {
        const { container } = render(
            <ProgressCircular
                aria-label="Loading results"
                label="Loading results"
                value={60}
            />
        );

        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByLabelText("Loading results")).toBeInTheDocument();
        expect(screen.getByText("Loading results")).toBeInTheDocument();
    });

    it("supports determinate value labels and custom value text", () => {
        render(
            <ProgressCircular
                aria-label="Download"
                showValueLabel
                value={50}
                valueLabel="Half done"
            />
        );

        const progressbar = screen.getByRole("progressbar", { name: "Download" });

        expect(screen.getByText("Half done")).toBeInTheDocument();
        expect(progressbar).toHaveAttribute("aria-valuetext", "Half done");
        expect(progressbar).toHaveAttribute("aria-valuenow", "50");
    });

    it("marks indeterminate progress when value is omitted", () => {
        const { container } = render(<ProgressCircular aria-label="Working" />);

        const root = screen.getByRole("progressbar", { name: "Working" });
        expect(root).toHaveAttribute("data-indeterminate");
        expect(root).not.toHaveAttribute("aria-valuenow");
        expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    });

    it("forwards size scheme and remaining props to the root", () => {
        render(
            <ProgressCircular
                aria-label="Sync"
                className="custom-progress-circular"
                data-testid="progress-circular-root"
                scheme="info"
                size="lg"
                value={25}
            />
        );

        const root = screen.getByTestId("progress-circular-root");
        expect(root).toHaveClass("custom-progress-circular");
        expect(root).toHaveAttribute("aria-label", "Sync");
    });

    it("auto-formats ProgressValue when showValueLabel is enabled without valueLabel", () => {
        render(
            <ProgressCircular
                aria-label="Download"
                format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
                locale="en-US"
                showValueLabel
                value={69}
            />
        );

        expect(screen.getByText("$69")).toBeInTheDocument();
    });

    it("supports getValueLabel while keeping compact visible valueLabel", () => {
        render(
            <ProgressCircular
                getValueLabel={(value, details) =>
                    `${value} of ${details.max} files, ${details.formatted}`
                }
                label="Copying files"
                max={12}
                showValueLabel
                value={3}
                valueLabel="3/12"
            />
        );

        const progressbar = screen.getByRole("progressbar", { name: "Copying files" });
        expect(progressbar).toHaveAttribute("aria-valuetext", "3 of 12 files, 25%");
        expect(screen.getByText("3/12")).toBeInTheDocument();
    });
});
