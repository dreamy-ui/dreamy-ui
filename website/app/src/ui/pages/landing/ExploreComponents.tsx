import { HStack, Icon } from "@dreamy-ui/react/rsc";
import { m } from "motion/react";
import { useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { Link } from "../../global/Link";

export default function ExploreComponents() {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <Link
            to={"/docs/components/accordion"}
            alignSelf={"center"}
            color={"fg.medium"}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
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
