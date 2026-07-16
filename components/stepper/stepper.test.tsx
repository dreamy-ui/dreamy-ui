import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Stepper from "./index";

function BasicStepper(props: {
    defaultStep?: number;
    step?: number;
    onStepChange?: (step: number) => void;
    orientation?: "horizontal" | "vertical";
}) {
    return (
        <Stepper.Root
            count={3}
            {...props}
        >
            <Stepper.List>
                {[0, 1, 2].map(function renderStep(index) {
                    return (
                        <Stepper.Item
                            index={index}
                            key={index}
                        >
                            <Stepper.Trigger index={index}>
                                <Stepper.Indicator index={index} />
                                <Stepper.Title>Step {index + 1}</Stepper.Title>
                            </Stepper.Trigger>
                            {index < 2 ? <Stepper.Separator index={index} /> : null}
                        </Stepper.Item>
                    );
                })}
            </Stepper.List>
            <Stepper.Content index={0}>Content one</Stepper.Content>
            <Stepper.Content index={1}>Content two</Stepper.Content>
            <Stepper.Content index={2}>Content three</Stepper.Content>
            <Stepper.PrevTrigger>Previous</Stepper.PrevTrigger>
            <Stepper.NextTrigger>Next</Stepper.NextTrigger>
        </Stepper.Root>
    );
}

describe("Stepper", () => {
    it("renders ordered steps and marks the current step", () => {
        render(<BasicStepper defaultStep={1} />);

        const list = screen.getByRole("list");
        expect(list.tagName).toBe("OL");
        expect(within(list).getAllByRole("listitem")).toHaveLength(3);

        const currentTrigger = document.querySelector('[aria-current="step"]');
        expect(currentTrigger).not.toBeNull();
        expect(currentTrigger).toHaveTextContent("Step 2");

        expect(screen.getByText("Content two")).toBeInTheDocument();
        expect(screen.getByText("Content one")).not.toBeVisible();
    });

    it("names next/prev buttons and disables them at the ends", async () => {
        const user = userEvent.setup();
        const onStepChange = vi.fn();

        render(
            <BasicStepper
                defaultStep={0}
                onStepChange={onStepChange}
            />
        );

        const prev = screen.getByRole("button", { name: "Previous" });
        const next = screen.getByRole("button", { name: "Next" });

        expect(prev).toBeDisabled();
        expect(next).not.toBeDisabled();

        await user.click(next);
        expect(onStepChange).toHaveBeenCalledWith(1);
    });

    it("exposes separators and associates active content with tabpanel role", () => {
        render(<BasicStepper defaultStep={0} />);

        expect(screen.getAllByRole("separator").length).toBeGreaterThan(0);

        const panel = screen.getByRole("tabpanel");
        expect(panel).toHaveTextContent("Content one");
        expect(panel).toHaveAttribute("aria-labelledby");
    });

    it("forwards orientation size scheme and remaining props", () => {
        render(
            <Stepper.Root
                className="custom-stepper"
                count={2}
                data-testid="stepper-root"
                defaultStep={0}
                orientation="vertical"
                scheme="success"
                size="sm"
            >
                <Stepper.List>
                    <Stepper.Item index={0}>
                        <Stepper.Trigger index={0}>
                            <Stepper.Title>Only</Stepper.Title>
                        </Stepper.Trigger>
                    </Stepper.Item>
                </Stepper.List>
            </Stepper.Root>
        );

        const root = screen.getByTestId("stepper-root");
        expect(root).toHaveClass("custom-stepper");
        expect(root).toHaveAttribute("data-orientation", "vertical");
    });
});
