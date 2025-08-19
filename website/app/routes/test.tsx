import { Editable } from "@/editable";
import { Flex } from "@/flex";
import { HStack } from "@/stack";
import type { Route } from "./+types/test";

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

export default function Test() {
    return (
        <Flex
            col
            gap={10}
            align={"start"}
        >
            <Editable.Root defaultValue="Hello">
                <Editable.Preview />
                <Editable.Input />
                <HStack>
                    <Editable.EditButton />
                    <Editable.SubmitButton />
                    <Editable.CancelButton />
                </HStack>
            </Editable.Root>
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
