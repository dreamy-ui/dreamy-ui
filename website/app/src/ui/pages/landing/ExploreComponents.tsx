import { HStack, Icon } from "@/ui";
import { m } from "motion/react";
import { useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { Link } from "../../global/Link";

export default function ExploreComponents() {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <Link
            _hover={{ color: "fg" }}
            alignSelf={"center"}
            color={"fg.medium"}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            to={"/docs/components/accordion"}
        >
            <HStack gap={2}>
                <m.span
                    animate={{
                        letterSpacing: isHovering ? "1.5px" : "0px"
                    }}
                >
                    Explore all 60+ components
                </m.span>
                <Icon
                    as={LuArrowRight}
                    transform={isHovering ? "translateX(4px)" : "translateX(0px)"}
                    transition={"transform {durations.normal} {easings.easeInOut}"}
                />
            </HStack>
        </Link>
    );
}
