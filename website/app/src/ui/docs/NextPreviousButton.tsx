import { Flex } from "@/flex";
import { Icon } from "@/icon";
import { HStack } from "@/stack";
import { Text } from "@/text";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { Link } from "../global/Link";

interface NextPreviousButtonProps {
    direction: "previous" | "next";
    to: string;
    label: string;
}

export default function NextPreviousButton({ direction, to, label }: NextPreviousButtonProps) {
    return (
        <Flex
            as={<Link to={to} />}
            border={1}
            borderColor={"border"}
            className="group"
            p={"4!"}
            rounded={"l2"}
            w={"50%"}
        >
            <Flex
                align={direction === "previous" ? "start" : "end"}
                col
                gap={1.5}
                w={"full"}
            >
                <Text
                    color={"fg.medium"}
                    normal
                    size="sm"
                >
                    {direction === "previous" ? "Previous" : "Next"}
                </Text>
                <HStack gap={"1!"}>
                    {direction === "previous" && (
                        <Icon
                            _groupHover={{
                                transform: "translateX(-4px)"
                            }}
                            as={BiChevronLeft}
                            transition={"transform {durations.fast} {easings.easeInOut}"}
                        />
                    )}
                    <Text size={"sm"}>{label}</Text>
                    {direction === "next" && (
                        <Icon
                            _groupHover={{
                                transform: "translateX(4px)"
                            }}
                            as={BiChevronRight}
                            transition={"transform {durations.fast} {easings.easeInOut}"}
                        />
                    )}
                </HStack>
            </Flex>
        </Flex>
    );
}
