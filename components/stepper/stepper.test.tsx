import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
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
        expect(onStepChange).toHaveBeenCalledWith(
            1,
            expect.objectContaining({ reason: "next-press" })
        );
    });

    it("navigates steps when triggers render a Button with asChild", async () => {
        const user = userEvent.setup();
        const onStepChange = vi.fn();

        render(
            <Stepper.Root
                count={2}
                onStepChange={onStepChange}
            >
                <Stepper.Content index={0}>Content one</Stepper.Content>
                <Stepper.Content index={1}>Content two</Stepper.Content>
                <Stepper.CompletedContent>All done</Stepper.CompletedContent>
                <Stepper.PrevTrigger asChild>
                    <Button variant="outline">Previous</Button>
                </Stepper.PrevTrigger>
                <Stepper.NextTrigger asChild>
                    <Button>Next</Button>
                </Stepper.NextTrigger>
            </Stepper.Root>
        );

        const prev = screen.getByRole("button", { name: "Previous" });
        const next = screen.getByRole("button", { name: "Next" });

        expect(screen.getAllByRole("button")).toHaveLength(2);
        expect(prev).toBeDisabled();

        await user.click(next);
        expect(onStepChange).toHaveBeenCalledWith(
            1,
            expect.objectContaining({ reason: "next-press" })
        );
        expect(screen.getByText("Content two")).toBeVisible();
        expect(prev).not.toBeDisabled();

        await user.click(next);
        expect(screen.getByText("All done")).toBeInTheDocument();
        expect(next).toBeDisabled();

        await user.click(prev);
        expect(screen.getByText("Content two")).toBeVisible();
    });

    it("calls a user onClick alongside step navigation", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        const onStepChange = vi.fn();

        render(
            <Stepper.Root
                count={2}
                onStepChange={onStepChange}
            >
                <Stepper.NextTrigger onClick={onClick}>Next</Stepper.NextTrigger>
            </Stepper.Root>
        );

        await user.click(screen.getByRole("button", { name: "Next" }));
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onStepChange).toHaveBeenCalledWith(
            1,
            expect.objectContaining({ reason: "next-press" })
        );
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
