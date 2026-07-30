import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    formatTime,
    getSegments,
    normalizeFields,
    parseTime
} from "@dreamy-ui/react";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as TimeInput from "./index";

describe("time-utils", () => {
    it("normalizes fields into canonical order", () => {
        expect(normalizeFields(["millisecond", "hour", "second"])).toEqual([
            "hour",
            "second",
            "millisecond"
        ]);
        expect(normalizeFields([])).toEqual(["hour", "minute"]);
    });

    it("parses and formats values for each fields combination", () => {
        expect(parseTime("14:30")).toEqual({
            hours: 14,
            minutes: 30,
            seconds: 0,
            milliseconds: 0
        });
        expect(formatTime({ hours: 14, minutes: 30, seconds: 0, milliseconds: 0 })).toBe("14:30");

        expect(parseTime("14:30:45", ["hour", "minute", "second"])).toEqual({
            hours: 14,
            minutes: 30,
            seconds: 45,
            milliseconds: 0
        });
        expect(
            formatTime(
                { hours: 14, minutes: 30, seconds: 45, milliseconds: 0 },
                ["hour", "minute", "second"]
            )
        ).toBe("14:30:45");

        expect(parseTime("14:30:45.123", ["hour", "minute", "second", "millisecond"])).toEqual({
            hours: 14,
            minutes: 30,
            seconds: 45,
            milliseconds: 123
        });

        expect(parseTime("45.250", ["second", "millisecond"])).toEqual({
            hours: 0,
            minutes: 0,
            seconds: 45,
            milliseconds: 250
        });
        expect(
            formatTime({ hours: 0, minutes: 0, seconds: 45, milliseconds: 250 }, [
                "second",
                "millisecond"
            ])
        ).toBe("45.250");

        expect(parseTime("05:30", ["minute", "second"])).toEqual({
            hours: 0,
            minutes: 5,
            seconds: 30,
            milliseconds: 0
        });
    });

    it("builds segments from fields and hour12", () => {
        expect(getSegments(["hour", "minute"], false)).toEqual(["hour", "minute"]);
        expect(getSegments(["hour", "minute"], true)).toEqual(["hour", "minute", "period"]);
        expect(getSegments(["second", "millisecond"], true)).toEqual(["second", "millisecond"]);
    });

    it("rejects invalid time strings", () => {
        expect(parseTime("25:00")).toBeNull();
        expect(parseTime("12:60")).toBeNull();
        expect(parseTime("14:30:60", ["hour", "minute", "second"])).toBeNull();
        expect(parseTime("not-a-time")).toBeNull();
        expect(parseTime("")).toBeNull();
    });
});

describe("TimeInput", () => {
    it("renders hour and minute spinbuttons by default", () => {
        render(
            <TimeInput.Root
                defaultValue="14:30"
                popoverProps={{ usePortal: false }}
            >
                <TimeInput.Trigger />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        expect(screen.getByRole("spinbutton", { name: "Hour" })).toHaveAttribute(
            "aria-valuetext",
            "14"
        );
        expect(screen.getByRole("spinbutton", { name: "Minute" })).toHaveAttribute(
            "aria-valuetext",
            "30"
        );
        expect(screen.queryByRole("spinbutton", { name: "Second" })).not.toBeInTheDocument();
        expect(screen.getByRole("group")).toHaveAttribute("aria-expanded", "false");
        expect(screen.getByRole("group")).toHaveAttribute("aria-haspopup", "dialog");
    });

    it("renders second and millisecond fields when configured", () => {
        render(
            <TimeInput.Root
                defaultValue="14:30:45.100"
                fields={["hour", "minute", "second", "millisecond"]}
                popoverProps={{ usePortal: false }}
            >
                <TimeInput.Trigger />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        expect(screen.getByRole("spinbutton", { name: "Second" })).toHaveAttribute(
            "aria-valuetext",
            "45"
        );
        expect(screen.getByRole("spinbutton", { name: "Millisecond" })).toHaveAttribute(
            "aria-valuetext",
            "100"
        );
    });

    it("renders seconds-only fields without hour or minute", () => {
        render(
            <TimeInput.Root
                defaultValue="45.250"
                fields={["second", "millisecond"]}
                popoverProps={{ usePortal: false }}
            >
                <TimeInput.Trigger />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        expect(screen.queryByRole("spinbutton", { name: "Hour" })).not.toBeInTheDocument();
        expect(screen.queryByRole("spinbutton", { name: "Minute" })).not.toBeInTheDocument();
        expect(screen.getByRole("spinbutton", { name: "Second" })).toHaveAttribute(
            "aria-valuetext",
            "45"
        );
        expect(screen.getByRole("spinbutton", { name: "Millisecond" })).toHaveAttribute(
            "aria-valuetext",
            "250"
        );
    });

    it("shows an AM/PM segment in 12-hour mode", () => {
        render(
            <TimeInput.Root
                defaultValue="14:30"
                hour12
                popoverProps={{ usePortal: false }}
            >
                <TimeInput.Trigger />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        expect(screen.getByRole("spinbutton", { name: "Hour" })).toHaveAttribute(
            "aria-valuetext",
            "02"
        );
        expect(screen.getByRole("spinbutton", { name: "AM/PM" })).toHaveAttribute(
            "aria-valuetext",
            "PM"
        );
    });

    it("opens the dialog and exposes wheel columns", async () => {
        const user = userEvent.setup();

        render(
            <TimeInput.Root
                defaultValue="09:15"
                popoverProps={{ usePortal: false }}
            >
                <TimeInput.Trigger />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        await user.click(screen.getByRole("spinbutton", { name: "Hour" }));

        await waitFor(function assertOpen() {
            expect(screen.getByRole("dialog", { name: "Choose time" })).toBeInTheDocument();
            expect(screen.getByRole("group")).toHaveAttribute("aria-expanded", "true");
        });

        expect(screen.getByText("Hour")).toBeInTheDocument();
        expect(screen.getByText("Min")).toBeInTheDocument();
    });

    it("increments the focused segment with ArrowUp", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <TimeInput.Root
                defaultValue="14:30"
                onChange={onChange}
                popoverProps={{ usePortal: false }}
            >
                <TimeInput.Trigger />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        const hour = screen.getByRole("spinbutton", { name: "Hour" });
        await user.click(hour);
        await user.keyboard("{ArrowUp}");

        await waitFor(function assertChanged() {
            expect(onChange).toHaveBeenCalledWith("15:30");
        });
        expect(hour).toHaveAttribute("aria-valuetext", "15");
    });

    it("moves between segments with ArrowLeft and ArrowRight", async () => {
        const user = userEvent.setup();

        render(
            <TimeInput.Root
                defaultValue="14:30"
                popoverProps={{ usePortal: false }}
            >
                <TimeInput.Trigger />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        const hour = screen.getByRole("spinbutton", { name: "Hour" });
        const minute = screen.getByRole("spinbutton", { name: "Minute" });

        await user.click(hour);
        await user.keyboard("{ArrowRight}");
        expect(minute).toHaveFocus();

        await user.keyboard("{ArrowLeft}");
        expect(hour).toHaveFocus();
    });

    it("types digits into the hour and advances to minute", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <TimeInput.Root
                defaultValue="00:00"
                onChange={onChange}
                popoverProps={{ usePortal: false }}
            >
                <TimeInput.Trigger />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        await user.click(screen.getByRole("spinbutton", { name: "Hour" }));
        await user.keyboard("09");

        await waitFor(function assertTyped() {
            expect(onChange).toHaveBeenCalledWith("09:00");
        });
        expect(screen.getByRole("spinbutton", { name: "Minute" })).toHaveFocus();
    });

    it("sets AM/PM with A and P keys", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <TimeInput.Root
                defaultValue="14:30"
                hour12
                onChange={onChange}
                popoverProps={{ usePortal: false }}
            >
                <TimeInput.Trigger />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        await user.click(screen.getByRole("spinbutton", { name: "AM/PM" }));
        await user.keyboard("a");

        await waitFor(function assertAm() {
            expect(onChange).toHaveBeenCalledWith("02:30");
        });
        expect(screen.getByRole("spinbutton", { name: "AM/PM" })).toHaveAttribute(
            "aria-valuetext",
            "AM"
        );

        await user.keyboard("p");

        await waitFor(function assertPm() {
            expect(onChange).toHaveBeenCalledWith("14:30");
        });
    });

    it("closes on Escape", async () => {
        const user = userEvent.setup();

        render(
            <TimeInput.Root
                defaultValue="09:00"
                popoverProps={{ usePortal: false }}
            >
                <TimeInput.Trigger />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        await user.click(screen.getByRole("spinbutton", { name: "Hour" }));

        await waitFor(function assertOpen() {
            expect(screen.getByRole("dialog", { name: "Choose time" })).toBeInTheDocument();
        });

        await user.keyboard("{Escape}");

        await waitFor(function assertClosed() {
            expect(screen.getByRole("group")).toHaveAttribute("aria-expanded", "false");
        });
    });

    it("submits the value through a hidden input", () => {
        render(
            <TimeInput.Root
                defaultValue="08:15"
                name="appointmentTime"
                popoverProps={{ usePortal: false }}
            >
                <TimeInput.Trigger />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        const input = document.querySelector('input[name="appointmentTime"]');

        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("type", "hidden");
        expect(input).toHaveValue("08:15");
    });

    it("respects disabled state", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <TimeInput.Root
                defaultValue="08:15"
                isDisabled
                onChange={onChange}
                popoverProps={{ usePortal: false }}
            >
                <TimeInput.Trigger />
                <TimeInput.Content>
                    <TimeInput.Columns />
                </TimeInput.Content>
            </TimeInput.Root>
        );

        const hour = screen.getByRole("spinbutton", { name: "Hour" });
        expect(hour).toHaveAttribute("tabindex", "-1");

        await user.click(hour);
        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole("group")).toHaveAttribute("aria-expanded", "false");
    });

    it("gets context from Field", () => {
        render(
            <Field.Root>
                <Field.Label>Start time</Field.Label>
                <TimeInput.AIO
                    hour12
                    name="startTime"
                    popoverProps={{ usePortal: false }}
                />
                <Field.Hint>Pick a time</Field.Hint>
            </Field.Root>
        );

        expect(screen.getByText("Start time")).toBeInTheDocument();
        expect(screen.getByText("Pick a time")).toBeInTheDocument();
        expect(document.querySelector('input[name="startTime"]')).toBeInTheDocument();
    });

    it("works as an all-in-one composed control", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <TimeInput.AIO
                defaultValue="10:00"
                onChange={onChange}
                popoverProps={{ usePortal: false }}
            />
        );

        await user.click(screen.getByRole("spinbutton", { name: "Minute" }));
        await user.keyboard("{ArrowUp}");

        await waitFor(function assertChanged() {
            expect(onChange).toHaveBeenCalledWith("10:01");
        });
    });
});
