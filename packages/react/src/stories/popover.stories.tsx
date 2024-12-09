import {
    Button,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger
} from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Popover"
} satisfies Meta;

export function Base() {
    return (
        <Popover>
            <PopoverTrigger>
                <Button variant={"primary"}>Open Popover</Button>
            </PopoverTrigger>

            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Delete Post</PopoverHeader>
                <PopoverBody>
                    Are you sure you want to delete this post? This action cannot be undone.
                </PopoverBody>
                <PopoverFooter>
                    <Button variant={"primary"}>Delete</Button>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
}
