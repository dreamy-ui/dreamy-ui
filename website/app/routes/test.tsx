import { Flex } from "@dreamy-ui/react/rsc";
import type { ActionFunctionArgs } from "@remix-run/node";

export function meta() {
    return [
        {
            title: "Testing - Dreamy UI"
        }
    ];
}

export async function action({ request }: ActionFunctionArgs) {
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
        />
    );
}
