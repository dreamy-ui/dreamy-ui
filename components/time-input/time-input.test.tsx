import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as TimeInput from "./index";

describe("TimeInput", () => {
    it("renders hour and minute spinbuttons by default with UI SDK slot", () => {
        render(
            <TimeInput.Root
                defaultValue="14:30"
                hourCycle={24}
            >
                <TimeInput.Trigger aria-label="Meeting time" />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        const group = screen.getByRole("group", { name: "Meeting time" });
        expect(group).toHaveAttribute("data-slot", "time-input");
        expect(group).toHaveAttribute("aria-expanded", "false");
        expect(group).toHaveAttribute("aria-haspopup", "dialog");

        expect(screen.getByRole("spinbutton", { name: /hour/i })).toHaveValue("14");
        expect(screen.getByRole("spinbutton", { name: /minute/i })).toHaveValue("30");
        expect(screen.queryByRole("spinbutton", { name: /second/i })).not.toBeInTheDocument();
    });

    it("renders second segment when granularity is second", () => {
        render(
            <TimeInput.Root
                defaultValue="14:30:45"
                granularity="second"
                hourCycle={24}
            >
                <TimeInput.Trigger aria-label="Precise time" />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        expect(screen.getByRole("spinbutton", { name: /second/i })).toHaveValue("45");
    });

    it("shows an AM/PM segment in 12-hour mode", () => {
        render(
            <TimeInput.Root
                defaultValue="14:30"
                hourCycle={12}
            >
                <TimeInput.Trigger aria-label="12h time" />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        expect(
            (screen.getByRole("spinbutton", { name: /hour/i }) as HTMLInputElement).value
        ).toMatch(/0?2/);
        expect(
            (screen.getByRole("spinbutton", { name: /am\/pm|day period/i }) as HTMLInputElement)
                .value
        ).toMatch(/PM/i);
    });

    it("opens the wheel popover on click and exposes columns", async () => {
        const user = userEvent.setup();

        render(
            <TimeInput.Root
                defaultValue="09:15"
                hourCycle={24}
            >
                <TimeInput.Trigger aria-label="Appointment" />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        await user.click(screen.getByRole("spinbutton", { name: /hour/i }));

        await waitFor(() => {
            expect(screen.getByRole("dialog", { name: "Choose time" })).toBeInTheDocument();
            expect(screen.getByRole("group", { name: "Appointment" })).toHaveAttribute(
                "aria-expanded",
                "true"
            );
        });

        expect(screen.getByText("Hour")).toBeInTheDocument();
        expect(screen.getByText("Min")).toBeInTheDocument();
    });

    it("increments the focused segment with ArrowUp and calls onValueChange", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <TimeInput.Root
                defaultValue="14:30"
                hourCycle={24}
                onValueChange={onValueChange}
            >
                <TimeInput.Trigger aria-label="Time" />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        const hour = screen.getByRole("spinbutton", { name: /hour/i });
        await user.click(hour);
        await user.keyboard("{ArrowUp}");

        await waitFor(() => {
            expect(onValueChange).toHaveBeenCalledWith("15:30", expect.anything());
        });
    });

    it("moves between segments with ArrowRight and ArrowLeft", async () => {
        const user = userEvent.setup();

        render(
            <TimeInput.Root
                defaultValue="14:30"
                hourCycle={24}
            >
                <TimeInput.Trigger aria-label="Time" />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        const hour = screen.getByRole("spinbutton", { name: /hour/i });
        const minute = screen.getByRole("spinbutton", { name: /minute/i });

        await user.click(hour);
        await user.keyboard("{ArrowRight}");
        expect(minute).toHaveFocus();

        await user.keyboard("{ArrowLeft}");
        expect(hour).toHaveFocus();
    });

    it("closes the popover on Escape", async () => {
        const user = userEvent.setup();

        render(
            <TimeInput.Root
                defaultValue="09:00"
                hourCycle={24}
            >
                <TimeInput.Trigger aria-label="Time" />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        await user.click(screen.getByRole("spinbutton", { name: /hour/i }));
        expect(await screen.findByRole("dialog", { name: "Choose time" })).toBeInTheDocument();

        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(screen.getByRole("group", { name: "Time" })).toHaveAttribute(
                "aria-expanded",
                "false"
            );
        });
    });

    it("submits the value through a hidden input", () => {
        render(
            <form>
                <TimeInput.Root
                    defaultValue="08:15"
                    hourCycle={24}
                    name="appointmentTime"
                >
                    <TimeInput.Trigger aria-label="Appointment" />
                    <TimeInput.Content>
                        <TimeInput.Columns />
                    </TimeInput.Content>
                </TimeInput.Root>
            </form>
        );

        const input = document.querySelector('input[name="appointmentTime"]');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue("08:15");
    });

    it("respects disabled state", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <TimeInput.Root
                defaultValue="08:15"
                disabled
                hourCycle={24}
                onValueChange={onValueChange}
            >
                <TimeInput.Trigger aria-label="Time" />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        const hour = screen.getByRole("spinbutton", { name: /hour/i });
        expect(hour).toBeDisabled();

        await user.click(hour);
        expect(onValueChange).not.toHaveBeenCalled();
        expect(screen.getByRole("group", { name: "Time" })).toHaveAttribute(
            "aria-expanded",
            "false"
        );
    });

    it("works as an all-in-one composed control inside Field", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <Field.Root>
                <Field.Label>Start time</Field.Label>
                <TimeInput.AIO
                    defaultValue="10:00"
                    hourCycle={24}
                    name="startTime"
                    onValueChange={onValueChange}
                />
                <Field.Hint>Pick a time</Field.Hint>
            </Field.Root>
        );

        expect(screen.getByText("Start time")).toBeInTheDocument();
        expect(document.querySelector('input[name="startTime"]')).toBeInTheDocument();

        await user.click(screen.getByRole("spinbutton", { name: /minute/i }));
        await user.keyboard("{ArrowUp}");

        await waitFor(() => {
            expect(onValueChange).toHaveBeenCalledWith("10:01", expect.anything());
        });
    });
});
