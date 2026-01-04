import { Button } from "@/ui";
import { Flex } from "@/ui";
import { MotionFlex } from "@/ui";
import { Select } from "@/ui";
import { Switch } from "@/ui";
import { Text } from "@/ui";
import { useColorMode, useControllable, useUpdateLayoutEffect } from "@dreamy-ui/react";
import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import type { Route } from "./+types/testing";

export function meta() {
    return [
        {
            title: "Testing - Dreamy UI"
        }
    ];
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const value = formData.get("test-select");
    const sliderValue = formData.get("slider");
    const switchValue = formData.get("switch");
    const checkboxValue = formData.get("checkbox");

    console.table({
        value,
        sliderValue,
        switchValue: switchValue === "",
        checkboxValue: checkboxValue === ""
    });

    return {
        success: true
    };
}

const MotionButton = m.create(Button);

export default function Test() {
    const { isOpen, onOpen, onClose } = useControllable();
    const [plainSwitch, setPlainSwitch] = useState(false);
    const [controlledSwitch, setControlledSwitch] = useState(false);

    const { colorMode, toggleColorMode } = useColorMode();

    useUpdateLayoutEffect(() => {
        setPlainSwitch(colorMode === "dark");
    }, [colorMode]);

    return (
        <Flex
            align={"start"}
            col
            gap={10}
        >
            <Button
                size={"lg"}
                variant={"primary"}
            >
                Primary
            </Button>

            <MotionButton
                initial
                layout
                layoutId="modal"
                onClick={onOpen}
                transition={{
                    duration: 0.2,
                    ease: "easeInOut"
                }}
            >
                Open
            </MotionButton>

            <AnimatePresence>
                {isOpen && (
                    <Flex
                        bottom={0}
                        center
                        fixed
                        left={0}
                        onClick={onClose}
                        right={0}
                        top={0}
                    >
                        <MotionFlex
                            bg={"red"}
                            h={20}
                            initial
                            layout
                            layoutId="modal"
                            w={40}
                        />
                    </Flex>
                )}
            </AnimatePresence>

            {/* Test cases for switch animation */}
            <Flex
                col
                gap={4}
            >
                <Text
                    fontSize="lg"
                    fontWeight="bold"
                >
                    Switch Animation Tests
                </Text>

                <Flex
                    col
                    gap={2}
                >
                    <Text>1. Color Mode Switch (animates):</Text>
                    <Switch
                        isChecked={colorMode === "dark"}
                        onChangeValue={toggleColorMode}
                    />
                </Flex>

                <Flex
                    col
                    gap={2}
                >
                    <Text>2. Plain Switch (no animation):</Text>
                    <Switch
                        isChecked={plainSwitch}
                        onChangeValue={setPlainSwitch}
                    />
                </Flex>

                <Flex
                    col
                    gap={2}
                >
                    <Text>3. Controlled Switch (no animation):</Text>
                    <Switch
                        isChecked={controlledSwitch}
                        onChangeValue={setControlledSwitch}
                    />
                </Flex>
            </Flex>

            <Select.Root>
                <Select.Trigger
                    placeholder="Select a favorite fruit"
                    w={"250px"}
                />
                <Select.VirtualContent>
                    {Array.from({ length: 250 }).map((_, index) => (
                        <Select.Item
                            key={index}
                            value={index.toString()}
                        >
                            {index.toString()}
                        </Select.Item>
                    ))}
                </Select.VirtualContent>
            </Select.Root>
        </Flex>
    );
}

// function RenderDreamy() {
// 	const start = performance.now();
// 	const elements = Array.from({ length: 1000 }).map((_, index) => (
// 		<Box
// 			key={index}
// 			bg={"red"}
// 			w={"100px"}
// 			h={"100px"}
// 			m={2}
// 			rounded={"md"}
// 		/>
// 	));
// 	const end = performance.now();
// 	console.log(`Time taken dreamy: ${end - start} milliseconds`);
// 	return elements;
// }

// function RenderDiv() {
// 	const start = performance.now();
// 	const elements = Array.from({ length: 1000 }).map((_, index) => (
// 		<div
// 			key={index}
// 			style={{
// 				width: "100px",
// 				height: "100px",
// 				margin: "10px",
// 				borderRadius: "10px",
// 				backgroundColor: "red"
// 			}}
// 		/>
// 	));
// 	const end = performance.now();
// 	console.log(`Time taken div: ${end - start} milliseconds`);
// 	return elements;
// }
