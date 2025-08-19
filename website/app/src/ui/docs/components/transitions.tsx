import { Box } from "@/box";
import { Button } from "@/button";
import { Collapse, type CollapseProps, Scale, type ScaleProps } from "@/transitions";
import { useState } from "react";

export function Collapsed(props: CollapseProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                w={"min-content"}
                onClick={() => setIsOpen(!isOpen)}
            >
                Toggle
            </Button>
            <Collapse
                w={"full"}
                in={isOpen}
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
                w={"min-content"}
                onClick={() => setIsOpen(!isOpen)}
            >
                Toggle
            </Button>
            <Scale
                w={"full"}
                in={isOpen}
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
