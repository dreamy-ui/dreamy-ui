import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { RadioGroup } from "../radio";
import { render } from "../test/render";
import * as RadioCard from "./index";

describe("RadioCard", () => {
    it("exposes a native radio as the only radio widget per card", () => {
        render(
            <RadioGroup defaultValue="pro">
                <RadioCard.Root
                    name="plan"
                    value="pro"
                >
                    <RadioCard.Header>
                        <RadioCard.Title>Pro</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                    <RadioCard.Description>For individuals</RadioCard.Description>
                </RadioCard.Root>
            </RadioGroup>
        );

        const radios = screen.getAllByRole("radio", { hidden: true });

        expect(radios).toHaveLength(1);
        expect(radios[0]).toHaveAttribute("type", "radio");
        expect(radios[0]).toBeChecked();
    });

    it("marks the visual radio control as decorative", () => {
        render(
            <RadioCard.Root
                defaultChecked
                value="pro"
            >
                <RadioCard.Header>
                    <RadioCard.Title>Pro</RadioCard.Title>
                    <RadioCard.Radio />
                </RadioCard.Header>
            </RadioCard.Root>
        );

        const wrapper = document.querySelector('[data-part="wrapper"]');

        expect(wrapper).toHaveAttribute("aria-hidden", "true");
    });

    it("selects via Space and root click within a group", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <RadioGroup
                defaultValue="pro"
                onChange={onChange}
                role="radiogroup"
                aria-label="Plan"
            >
                <RadioCard.Root
                    data-testid="pro-card"
                    name="plan"
                    value="pro"
                >
                    <RadioCard.Header>
                        <RadioCard.Title>Pro</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                </RadioCard.Root>
                <RadioCard.Root
                    data-testid="team-card"
                    name="plan"
                    value="team"
                >
                    <RadioCard.Header>
                        <RadioCard.Title>Team</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                </RadioCard.Root>
            </RadioGroup>
        );

        expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();

        const radios = screen.getAllByRole("radio", { hidden: true });

        expect(radios[0]).toHaveAttribute("name", "plan");
        expect(radios[1]).toHaveAttribute("name", "plan");
        expect(radios[0]).toBeChecked();

        await user.click(screen.getByTestId("team-card"));
        expect(onChange).toHaveBeenCalledWith("team");
    });

    it("wires Field describedby and expects Field invalid on card inputs", () => {
        render(
            <Field.Root isInvalid>
                <Field.Label>Plan</Field.Label>
                <RadioGroup defaultValue="pro">
                    <RadioCard.Root value="pro">
                        <RadioCard.Header>
                            <RadioCard.Title>Pro</RadioCard.Title>
                            <RadioCard.Radio />
                        </RadioCard.Header>
                    </RadioCard.Root>
                    <RadioCard.Root value="team">
                        <RadioCard.Header>
                            <RadioCard.Title>Team</RadioCard.Title>
                            <RadioCard.Radio />
                        </RadioCard.Header>
                    </RadioCard.Root>
                </RadioGroup>
                <Field.Error>Select a plan</Field.Error>
            </Field.Root>
        );

        for (const radio of screen.getAllByRole("radio", { hidden: true })) {
            expect(radio.getAttribute("aria-describedby")).toBeTruthy();
            expect(radio).toHaveAttribute("aria-invalid", "true");
        }
    });

    it("does not select when disabled", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <RadioGroup
                defaultValue="pro"
                isDisabled
                onChange={onChange}
            >
                <RadioCard.Root value="pro">
                    <RadioCard.Header>
                        <RadioCard.Title>Pro</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                </RadioCard.Root>
                <RadioCard.Root value="team">
                    <RadioCard.Header>
                        <RadioCard.Title>Team</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                </RadioCard.Root>
            </RadioGroup>
        );

        await user.click(screen.getAllByRole("radio", { hidden: true })[1]);
        expect(onChange).not.toHaveBeenCalled();
    });

    it("moves selection across cards with arrow keys", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <RadioGroup
                defaultValue="pro"
                onChange={onChange}
                role="radiogroup"
                aria-label="Plan"
            >
                <RadioCard.Root
                    name="plan"
                    value="pro"
                >
                    <RadioCard.Header>
                        <RadioCard.Title>Pro</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                </RadioCard.Root>
                <RadioCard.Root
                    name="plan"
                    value="team"
                >
                    <RadioCard.Header>
                        <RadioCard.Title>Team</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                </RadioCard.Root>
            </RadioGroup>
        );

        const radios = screen.getAllByRole("radio", { hidden: true });

        radios[0].focus();
        await user.keyboard("{ArrowDown}");

        expect(radios[1]).toBeChecked();
        expect(onChange).toHaveBeenCalledWith("team");
    });

    it("names each option from Title content", () => {
        render(
            <RadioCard.Root value="pro">
                <RadioCard.Header>
                    <RadioCard.Title>Pro plan</RadioCard.Title>
                    <RadioCard.Radio />
                </RadioCard.Header>
            </RadioCard.Root>
        );

        expect(screen.getByText("Pro plan")).toBeInTheDocument();
        expect(screen.getByRole("radio", { hidden: true })).toBeInTheDocument();
    });
});
