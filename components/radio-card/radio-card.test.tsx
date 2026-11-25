import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { RadioGroup } from "../radio";
import { render } from "../test/render";
import * as RadioCard from "./index";

describe("RadioCard", () => {
    it("exposes a radio role as the only radio widget per card", () => {
        render(
            <RadioGroup
                defaultValue="pro"
                name="plan"
            >
                <RadioCard.Root value="pro">
                    <RadioCard.Header>
                        <RadioCard.Title>Pro</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                    <RadioCard.Description>For individuals</RadioCard.Description>
                </RadioCard.Root>
            </RadioGroup>
        );

        const radios = screen.getAllByRole("radio");

        expect(radios).toHaveLength(1);
        expect(radios[0]).toHaveAttribute("data-slot", "root");
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

    it("selects via root click within a group", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <RadioGroup
                aria-label="Plan"
                defaultValue="pro"
                name="plan"
                onValueChange={onValueChange}
                role="radiogroup"
            >
                <RadioCard.Root
                    data-testid="pro-card"
                    value="pro"
                >
                    <RadioCard.Header>
                        <RadioCard.Title>Pro</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                </RadioCard.Root>
                <RadioCard.Root
                    data-testid="team-card"
                    value="team"
                >
                    <RadioCard.Header>
                        <RadioCard.Title>Team</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                </RadioCard.Root>
            </RadioGroup>
        );

        expect(screen.getAllByRole("radiogroup", { name: "Plan" }).length).toBeGreaterThan(0);

        const radios = screen.getAllByRole("radio");
        const inputs = document.querySelectorAll('input[type="radio"]');

        expect(inputs[0]).toHaveAttribute("name", "plan");
        expect(inputs[1]).toHaveAttribute("name", "plan");
        expect(radios[0]).toBeChecked();

        await user.click(screen.getByTestId("team-card"));
        expect(onValueChange).toHaveBeenCalledWith("team", expect.anything());
        expect(radios[1]).toBeChecked();
    });

    it("wires Field describedby and expects Field invalid on card controls", () => {
        render(
            <Field.Root invalid>
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

        for (const radio of screen.getAllByRole("radio")) {
            expect(radio.getAttribute("aria-describedby")).toBeTruthy();
            expect(radio).toHaveAttribute("aria-invalid", "true");
        }
    });

    it("does not select when disabled", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <RadioGroup
                defaultValue="pro"
                disabled
                onValueChange={onValueChange}
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

        await user.click(screen.getAllByRole("radio")[1]);
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it("moves selection across cards with arrow keys", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <RadioGroup
                aria-label="Plan"
                defaultValue="pro"
                name="plan"
                onValueChange={onValueChange}
                role="radiogroup"
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

        const radios = screen.getAllByRole("radio");

        radios[0].focus();
        await user.keyboard("{ArrowDown}");

        expect(radios[1]).toBeChecked();
        expect(onValueChange).toHaveBeenCalledWith("team", expect.anything());
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

        expect(screen.getByRole("radio", { name: "Pro plan" })).toBeInTheDocument();
    });

    it("does not assign duplicate field ids inside RadioGroup", () => {
        render(
            <Field.Root>
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
            </Field.Root>
        );

        const group = screen.getByRole("radiogroup");
        const radios = screen.getAllByRole("radio");

        expect(group.id).toBeTruthy();
        expect(radios[0].id).not.toBe(group.id);
        expect(radios[1].id).not.toBe(group.id);
        expect(radios[0].id || radios[1].id).toBe("");
    });

    it("inherits size and scheme from RadioGroup when unset", () => {
        render(
            <RadioGroup
                aria-label="Plan"
                defaultValue="pro"
                scheme="success"
                size="lg"
            >
                <RadioCard.Root value="pro">
                    <RadioCard.Header>
                        <RadioCard.Title>Pro</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                </RadioCard.Root>
                <RadioCard.Root
                    scheme="warning"
                    size="sm"
                    value="team"
                >
                    <RadioCard.Header>
                        <RadioCard.Title>Team</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                </RadioCard.Root>
            </RadioGroup>
        );

        const radios = screen.getAllByRole("radio");
        expect(radios[0].className).toContain("size_lg");
        expect(radios[0].className).toContain("scheme_success");
        expect(radios[1].className).toContain("size_sm");
        expect(radios[1].className).toContain("scheme_warning");
    });

    it("forwards form on standalone RadioCard.Root and respects readOnly", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <>
                <RadioCard.Root
                    defaultChecked
                    form="external-card-form"
                    name="plan"
                    readOnly
                    value="pro"
                >
                    <RadioCard.Header>
                        <RadioCard.Title>Pro</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                </RadioCard.Root>
                <form
                    id="external-card-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit(new FormData(event.currentTarget).get("plan"));
                    }}
                >
                    <button type="submit">Submit</button>
                </form>
            </>
        );

        const radio = screen.getByRole("radio", { name: "Pro" });
        expect(radio).toHaveAttribute("data-readonly", "");

        await user.click(screen.getByRole("button", { name: "Submit" }));
        expect(onSubmit).toHaveBeenCalledWith("pro");
    });
});
