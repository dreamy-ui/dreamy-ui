import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as Slider from "./index";

describe("Slider", () => {
    it("exposes a named slider thumb with aria value attributes inside Field", () => {
        render(
            <Field.Root>
                <Field.Label>Volume</Field.Label>
                <Slider.Root
                    defaultValue={40}
                    max={100}
                    min={0}
                >
                    <Slider.Track>
                        <Slider.FilledTrack />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Root>
                <Field.Hint>0–100</Field.Hint>
            </Field.Root>
        );

        const thumb = screen.getByRole("slider", { name: "Volume" });

        expect(thumb).toHaveValue("40");
        expect(thumb).toHaveAttribute("min", "0");
        expect(thumb).toHaveAttribute("max", "100");
        expect(thumb).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("supports vertical orientation", () => {
        render(
            <Slider.Root
                aria-label="Height"
                defaultValue={25}
                orientation="vertical"
            >
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        );

        expect(screen.getByRole("slider", { name: "Height" })).toHaveAttribute(
            "aria-orientation",
            "vertical"
        );
    });

    it("adjusts value with arrow keys, Home, and End", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <Slider.Root
                aria-label="Volume"
                defaultValue={50}
                max={100}
                min={0}
                onValueChange={onValueChange}
                step={1}
            >
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        );

        const thumb = screen.getByRole("slider", { name: "Volume" });
        thumb.focus();

        await user.keyboard("{ArrowRight}");
        expect(thumb).toHaveValue("51");
        expect(onValueChange.mock.calls.at(-1)?.[0]).toBe(51);

        await user.keyboard("{ArrowLeft}");
        expect(thumb).toHaveValue("50");

        await user.keyboard("{Home}");
        expect(thumb).toHaveValue("0");

        await user.keyboard("{End}");
        expect(thumb).toHaveValue("100");
    });

    it("does not change value when disabled", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <Slider.Root
                aria-label="Volume"
                defaultValue={30}
                disabled
                onValueChange={onValueChange}
            >
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        );

        const thumb = screen.getByRole("slider", { name: "Volume" });

        expect(thumb).toBeDisabled();
        thumb.focus();
        await user.keyboard("{ArrowRight}");
        expect(onValueChange).not.toHaveBeenCalled();
        expect(thumb).toHaveValue("30");
    });

    it("reflects read-only and invalid states", () => {
        render(
            <Field.Root invalid>
                <Field.Label>Volume</Field.Label>
                <Slider.Root
                    defaultValue={10}
                    isInvalid
                    readOnly
                >
                    <Slider.Track>
                        <Slider.FilledTrack />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Root>
                <Field.Error>Pick a louder volume.</Field.Error>
            </Field.Root>
        );

        const thumb = screen.getByRole("slider", { name: "Volume" });

        expect(thumb).toHaveAttribute("aria-readonly", "true");
        expect(thumb.closest('[data-slot="slider-thumb"]')).toHaveAttribute("data-invalid");
        expect(screen.getByText("Pick a louder volume.")).toBeVisible();
    });

    it("renders formatted Slider.Value with format and locale", () => {
        render(
            <Slider.Root
                aria-label="Budget"
                defaultValue={40}
                format={{ style: "currency", currency: "EUR" }}
                locale="de-DE"
            >
                <Slider.Value />
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        );

        const output = document.querySelector('[data-slot="slider-value"]');
        expect(output).not.toBeNull();
        expect(output?.textContent).toContain("40,00");
        expect(output?.textContent).toContain("€");
    });

    it("supports largeStep with PageUp and Shift+ArrowRight", async () => {
        const user = userEvent.setup();

        render(
            <Slider.Root
                aria-label="Zoom"
                defaultValue={100}
                largeStep={25}
                max={400}
                min={25}
                step={5}
            >
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        );

        const thumb = screen.getByRole("slider", { name: "Zoom" });
        thumb.focus();

        await user.keyboard("{PageUp}");
        expect(thumb).toHaveValue("125");

        await user.keyboard("{Shift>}{ArrowRight}{/Shift}");
        expect(thumb).toHaveValue("150");
    });

    it("calls onValueCommit when keyboard interaction ends", async () => {
        const user = userEvent.setup();
        const onValueCommit = vi.fn();

        render(
            <Slider.Root
                aria-label="Brightness"
                defaultValue={50}
                onValueCommit={onValueCommit}
            >
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        );

        const thumb = screen.getByRole("slider", { name: "Brightness" });
        thumb.focus();

        await user.keyboard("{ArrowRight}");
        expect(onValueCommit).toHaveBeenCalledTimes(1);
        expect(onValueCommit.mock.calls[0]?.[0]).toBe(51);
        expect(onValueCommit.mock.calls[0]?.[1]?.reason).toBe("step-key");
    });

    it("supports imperative control via createSliderController", () => {
        const controller = Slider.createSliderController<number>();

        render(
            <Slider.Root
                aria-label="Volume"
                controller={controller}
                defaultValue={40}
            >
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        );

        expect(controller.getValue()).toBe(40);
        expect(controller.setValue(75)).toBe(true);
        expect(controller.getValue()).toBe(75);
        expect(screen.getByRole("slider", { name: "Volume" })).toHaveValue("75");

        controller.focus();
        expect(screen.getByRole("slider", { name: "Volume" })).toHaveFocus();
    });

    it("participates in form submission and reset", async () => {
        const { container } = render(
            <form data-testid="slider-form">
                <Slider.Root
                    aria-label="Rating"
                    defaultValue={3}
                    max={5}
                    min={1}
                    name="rating"
                >
                    <Slider.Track>
                        <Slider.FilledTrack />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Root>
            </form>
        );

        const form = screen.getByTestId("slider-form") as HTMLFormElement;
        const hiddenInput = container.querySelector('input[type="hidden"][name="rating"]') as HTMLInputElement;
        expect(hiddenInput.value).toBe("3");

        const thumb = screen.getByRole("slider", { name: "Rating" });
        fireEvent.keyDown(thumb, { key: "ArrowRight" });
        fireEvent.keyUp(thumb, { key: "ArrowRight" });
        expect(new FormData(form).get("rating")).toBe("4");

        act(() => {
            form.reset();
        });
        await waitFor(() => {
            expect(new FormData(form).get("rating")).toBe("3");
        });
    });

    it("supports state-aware children on Slider.Value and Slider.Thumb", () => {
        render(
            <Slider.Root
                aria-label="Brightness"
                defaultValue={60}
            >
                <Slider.Value>{(state) => `${state.text}%`}</Slider.Value>
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb render={<span />}>
                        {(state) => <span data-testid="thumb-badge">{state.thumbValue}</span>}
                    </Slider.Thumb>
                </Slider.Track>
            </Slider.Root>
        );

        expect(screen.getByText("60%")).toBeInTheDocument();
        expect(screen.getByTestId("thumb-badge")).toHaveTextContent("60");
    });
});
