import { createStepperController, stepperPrimitive } from "@dreamy-ui/react";
import { checkServer, mount } from "@ui-sdk/core/testing";
import { createAgent } from "@ui-sdk/react/agent";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Stepper from "./index";

const stepperMarkup = `
    <root>
        <list>
            <item index="0">
                <trigger index="0">Step 1</trigger>
                <indicator index="0"></indicator>
                <separator index="0"></separator>
            </item>
            <item index="1">
                <trigger index="1">Step 2</trigger>
                <indicator index="1"></indicator>
                <separator index="1"></separator>
            </item>
            <item index="2">
                <trigger index="2">Step 3</trigger>
                <indicator index="2"></indicator>
            </item>
        </list>
        <content index="0">Panel 1</content>
        <content index="1">Panel 2</content>
        <content index="2">Panel 3</content>
        <completed-content>Done</completed-content>
        <prev-trigger>Prev</prev-trigger>
        <next-trigger>Next</next-trigger>
    </root>
`;

describe("stepperPrimitive", () => {
    beforeEach(() => {
        (globalThis as Record<string, unknown>).__UI_SDK_STRICT__ = true;
    });

    afterEach(() => {
        (globalThis as Record<string, unknown>).__UI_SDK_STRICT__ = false;
    });

    it("mounts cleanly with core testing utilities and advances steps", async () => {
        const onStepChange = vi.fn();
        const mounted = mount(
            stepperPrimitive,
            { count: 3, defaultStep: 0, onStepChange },
            stepperMarkup
        );

        try {
            const nextBtn = mounted.part("next-trigger") as HTMLButtonElement;
            const prevBtn = mounted.part("prev-trigger") as HTMLButtonElement;
            expect(prevBtn.hasAttribute("disabled")).toBe(true);
            expect(nextBtn.hasAttribute("disabled")).toBe(false);

            await mounted.click(nextBtn);
            expect(mounted.state.step).toBe(1);
            expect(onStepChange).toHaveBeenCalledWith(
                1,
                expect.objectContaining({ reason: "next-press" })
            );
            expect(prevBtn.hasAttribute("disabled")).toBe(false);
        } finally {
            mounted.unmount();
        }
    });

    it("passes SSR checkServer without a DOM", () => {
        const html = checkServer(stepperPrimitive, { count: 3, defaultStep: 1 }, stepperMarkup);
        expect(html).toContain('aria-current="step"');
        expect(html).toContain('role="separator"');
        expect(html).toContain('role="tabpanel"');
    });

    it("supports imperative controller and agent actions", async () => {
        const agent = createAgent();
        const controller = createStepperController();

        render(
            <Stepper.Root
                aria-label="Onboarding"
                controller={controller}
                count={3}
                defaultStep={0}
            >
                <Stepper.List>
                    {[0, 1, 2].map((index) => (
                        <Stepper.Item
                            index={index}
                            key={index}
                        >
                            <Stepper.Trigger index={index}>
                                <Stepper.Title>Step {index + 1}</Stepper.Title>
                            </Stepper.Trigger>
                        </Stepper.Item>
                    ))}
                </Stepper.List>
                <Stepper.Content index={0}>Panel 1</Stepper.Content>
                <Stepper.Content index={1}>Panel 2</Stepper.Content>
                <Stepper.Content index={2}>Panel 3</Stepper.Content>
                <Stepper.CompletedContent>Completed</Stepper.CompletedContent>
            </Stepper.Root>
        );

        controller.setStep(1);
        await waitFor(() => {
            expect(screen.getByText("Panel 2")).toBeVisible();
        });

        const entry = agent.snapshot().find((c) => c.component === "stepper");
        expect(entry?.ref).toBeDefined();

        if (entry) {
            const result = await agent.act({
                steps: [{ ref: entry.ref, action: "next" }]
            });
            expect(result.ok).toBe(true);
            await waitFor(() => {
                expect(screen.getByText("Panel 3")).toBeVisible();
            });
        }
    });
});
