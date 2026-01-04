import { Box } from "@/ui";
import { Button } from "@/ui";
import { Collapse, type CollapseProps, Scale, type ScaleProps } from "@/ui";
import { useState } from "react";

export function Collapsed(props: CollapseProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                w={"min-content"}
            >
                Toggle
            </Button>
            <Collapse
                isOpen={isOpen}
                w={"full"}
                {...props}
            >
                <Box
                    bg={"fg"}
                    color={"bg"}
                    p={4}
                    rounded={"md"}
                    w={"full"}
                >
                    Hello
                </Box>
            </Collapse>
        </>
    );
}

export function Scaled(props: ScaleProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                w={"min-content"}
            >
                Toggle
            </Button>
            <Scale
                isOpen={isOpen}
                w={"full"}
                {...props}
            >
                <Box
                    bg={"fg"}
                    color={"bg"}
                    p={4}
                    rounded={"md"}
                    w={"full"}
                >
                    Hello
                </Box>
            </Scale>
        </>
    );
}
