import { Icon } from "@/ui";
import { HStack } from "@/ui";
import { m } from "motion/react";
import { useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { Link } from "../../global/Link";

export default function ExploreComponents() {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <Link
            alignSelf={"center"}
            color={"fg.medium"}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            to={"/docs/components/accordion"}
        >
            <HStack gap={2}>
                <m.span
                    animate={{
                        // animate letter spacing
                        letterSpacing: isHovering ? "2px" : "0px"
                    }}
                >
                    Explore components
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
