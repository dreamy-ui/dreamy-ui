import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as RangeSlider from "./index";

describe("RangeSlider", () => {
    it("exposes two distinctly named slider thumbs with aria value attributes", () => {
        render(
            <RangeSlider.Root
                aria-label={["Minimum price", "Maximum price"]}
                defaultValue={[20, 80]}
                max={100}
                min={0}
            >
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
        );

        const minThumb = screen.getByRole("slider", { name: "Minimum price" });
        const maxThumb = screen.getByRole("slider", { name: "Maximum price" });

        expect(minThumb).toHaveValue("20");
        expect(minThumb).toHaveAttribute("min", "0");
        expect(minThumb).toHaveAttribute("max", "80");
        expect(minThumb).toHaveAttribute("aria-orientation", "horizontal");

        expect(maxThumb).toHaveValue("80");
        expect(maxThumb).toHaveAttribute("min", "20");
        expect(maxThumb).toHaveAttribute("max", "100");
    });

    it("keeps distinct thumb names when composed inside Field", () => {
        render(
            <Field.Root>
                <Field.Label>Price range</Field.Label>
                <RangeSlider.Root
                    aria-label={["Minimum price", "Maximum price"]}
                    defaultValue={[20, 80]}
                >
                    <RangeSlider.Track>
                        <RangeSlider.FilledTrack />
                    </RangeSlider.Track>
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Root>
            </Field.Root>
        );

        // Group label from Field must not erase per-thumb names (APG multi-thumb)
        expect(screen.getByRole("slider", { name: "Minimum price" })).toBeInTheDocument();
        expect(screen.getByRole("slider", { name: "Maximum price" })).toBeInTheDocument();
    });

    it("supports vertical orientation on both thumbs", () => {
        render(
            <RangeSlider.Root
                aria-label={["Min", "Max"]}
                defaultValue={[10, 90]}
                orientation="vertical"
            >
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
        );

        for (const thumb of screen.getAllByRole("slider")) {
            expect(thumb).toHaveAttribute("aria-orientation", "vertical");
        }
    });

    it("tabs between thumbs and adjusts the focused thumb with arrows", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <RangeSlider.Root
                aria-label={["Minimum", "Maximum"]}
                defaultValue={[30, 70]}
                max={100}
                min={0}
                onValueChange={onValueChange}
                step={1}
            >
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
        );

        const minThumb = screen.getByRole("slider", { name: "Minimum" });
        const maxThumb = screen.getByRole("slider", { name: "Maximum" });

        minThumb.focus();
        await user.keyboard("{ArrowRight}");
        expect(minThumb).toHaveValue("31");
        expect(onValueChange.mock.calls.at(-1)?.[0]).toEqual([31, 70]);

        await user.tab();
        expect(maxThumb).toHaveFocus();

        await user.keyboard("{ArrowLeft}");
        expect(maxThumb).toHaveValue("69");
    });

    it("does not change values when disabled", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <RangeSlider.Root
                aria-label={["Minimum", "Maximum"]}
                defaultValue={[25, 75]}
                disabled
                onValueChange={onValueChange}
            >
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
        );

        const minThumb = screen.getByRole("slider", { name: "Minimum" });

        expect(minThumb).toBeDisabled();
        minThumb.focus();
        await user.keyboard("{ArrowRight}");
        expect(onValueChange).not.toHaveBeenCalled();
        expect(minThumb).toHaveValue("25");
    });

    it("reflects read-only and invalid state on thumbs", () => {
        render(
            <RangeSlider.Root
                aria-label={["Minimum price", "Maximum price"]}
                defaultValue={[20, 80]}
                isInvalid
                readOnly
            >
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
        );

        for (const thumb of screen.getAllByRole("slider")) {
            expect(thumb).toHaveAttribute("aria-readonly", "true");
            expect(thumb.closest('[data-slot="slider-thumb"]')).toHaveAttribute("data-invalid");
        }
    });

    it("supports three or more thumbs with distinct names and values", async () => {
        const user = userEvent.setup();

        render(
            <RangeSlider.Root
                aria-label={["Low", "Medium", "High"]}
                defaultValue={[10, 20, 70]}
                step={10}
            >
                <RangeSlider.Value />
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                    <RangeSlider.Thumb index={2} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        );

        const low = screen.getByRole("slider", { name: "Low" });
        const medium = screen.getByRole("slider", { name: "Medium" });
        const high = screen.getByRole("slider", { name: "High" });

        expect(low).toHaveValue("10");
        expect(medium).toHaveValue("20");
        expect(high).toHaveValue("70");

        medium.focus();
        await user.keyboard("{ArrowRight}");
        expect(medium).toHaveValue("30");
    });

    it("enforces minStepsBetweenThumbs", async () => {
        const user = userEvent.setup();

        render(
            <RangeSlider.Root
                aria-label={["Start", "End"]}
                defaultValue={[20, 40]}
                minStepsBetweenThumbs={2}
                step={10}
            >
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        );

        const start = screen.getByRole("slider", { name: "Start" });
        start.focus();
        await user.keyboard("{ArrowRight}");
        expect(start).toHaveValue("20");
    });

    it("renders RangeSlider.Value with format and locale", () => {
        render(
            <RangeSlider.Root
                aria-label={["Min price", "Max price"]}
                defaultValue={[25, 50]}
                format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
                locale="en-US"
            >
                <RangeSlider.Value />
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        );

        const output = document.querySelector('[data-slot="slider-value"]');
        expect(output?.textContent).toContain("$25");
        expect(output?.textContent).toContain("$50");
    });

    it("calls onValueCommit and supports createSliderController", async () => {
        const user = userEvent.setup();
        const onValueCommit = vi.fn();
        const controller = RangeSlider.createSliderController<[number, number]>();

        render(
            <RangeSlider.Root
                aria-label={["Min", "Max"]}
                controller={controller}
                defaultValue={[20, 80]}
                onValueCommit={onValueCommit}
            >
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        );

        expect(controller.getValue()).toEqual([20, 80]);
        expect(controller.setValue([30, 70])).toBe(true);
        expect(controller.getValue()).toEqual([30, 70]);

        const minThumb = screen.getByRole("slider", { name: "Min" });
        minThumb.focus();
        await user.keyboard("{ArrowRight}");
        expect(onValueCommit).toHaveBeenCalledTimes(1);
        expect(onValueCommit.mock.calls[0]?.[0]).toEqual([31, 70]);
    });

    it("submits range value as start/end in a form", async () => {
        render(
            <form data-testid="range-form">
                <RangeSlider.Root
                    aria-label={["Min price", "Max price"]}
                    defaultValue={[200, 800]}
                    max={1000}
                    name="price"
                    step={10}
                >
                    <RangeSlider.Track>
                        <RangeSlider.FilledTrack />
                        <RangeSlider.Thumb index={0} />
                        <RangeSlider.Thumb index={1} />
                    </RangeSlider.Track>
                </RangeSlider.Root>
            </form>
        );

        const form = screen.getByTestId("range-form") as HTMLFormElement;
        expect(new FormData(form).get("price")).toBe("200/800");

        const minThumb = screen.getByRole("slider", { name: "Min price" });
        fireEvent.keyDown(minThumb, { key: "ArrowRight" });
        fireEvent.keyUp(minThumb, { key: "ArrowRight" });
        expect(new FormData(form).get("price")).toBe("210/800");

        act(() => {
            form.reset();
        });
        await waitFor(() => {
            expect(new FormData(form).get("price")).toBe("200/800");
        });
    });
});
