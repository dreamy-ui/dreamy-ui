import { Flex, type FlexProps } from "@/components/flex";
import { Heading } from "@/components/heading";
import { forwardRef } from "react";

export interface ModalHeaderProps extends FlexProps {}

export const ModalHeaderBase = forwardRef<HTMLDivElement, ModalHeaderProps>(
    ({ children, ...props }, ref) => {
        return (
            <Flex as={"header"} {...props} ref={ref}>
                {typeof children === "string" ? (
                    <Heading variant={"heading"} size="lg">
                        {children}
                    </Heading>
                ) : (
                    children
                )}
            </Flex>
        );
    }
);
