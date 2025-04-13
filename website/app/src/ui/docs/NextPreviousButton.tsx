import { Flex, HStack, Icon, Text } from "@dreamy-ui/react/rsc";
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
            asComp={<Link to={to} />}
            p={"4!"}
            border={1}
            borderColor={"border"}
            rounded={"l2"}
            w={"50%"}
            className="group"
        >
            <Flex
                col
                w={"full"}
                align={direction === "previous" ? "start" : "end"}
                gap={1.5}
            >
                <Text
                    normal
                    size="sm"
                    color={"fg.medium"}
                >
                    {direction === "previous" ? "Previous" : "Next"}
                </Text>
                <HStack gap={"1!"}>
                    {direction === "previous" && (
                        <Icon
                            as={BiChevronLeft}
                            transition={"transform {durations.fast} {easings.easeInOut}"}
                            _groupHover={{
                                transform: "translateX(-4px)"
                            }}
                        />
                    )}
                    <Text size={"sm"}>{label}</Text>
                    {direction === "next" && (
                        <Icon
                            as={BiChevronRight}
                            transition={"transform {durations.fast} {easings.easeInOut}"}
                            _groupHover={{
                                transform: "translateX(4px)"
                            }}
                        />
                    )}
                </HStack>
            </Flex>
        </Flex>
    );
}
