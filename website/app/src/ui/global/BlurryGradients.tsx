import { Box } from "@dreamy-ui/react/rsc";
import useScroll from "~/src/hooks/useScroll";

export default function BlurryGradients() {
    const { scrollYProgress } = useScroll();

    return (
        <Box
            pos={"fixed"}
            overflow={"hidden"}
            inset={0}
            zIndex={-10}
        >
            <Box
                pos={"absolute"}
                bottom={"auto"}
                left={"auto"}
                right={0}
                top={0}
                w={"500px"}
                h={"500px"}
                x={{
                    base: "0%",
                    md: "-30%"
                }}
                y={"20%"}
                translate={"auto"}
                rounded={"full"}
                bg={"rgb(73, 31, 171)"}
                opacity={{
                    _light: 0.15,
                    _dark: 0.1
                }}
                blur={"80px"}
                filter={"auto"}
                style={{
                    transform: `translateY(${(scrollYProgress / 2) * 100}%)`
                }}
            />
            {/* bottom left */}
            <Box
                pos={"absolute"}
                bottom={"auto"}
                right={"auto"}
                left={0}
                top={0}
                w={"750px"}
                h={"750px"}
                x={"-20%"}
                y={{
                    base: "110%",
                    md: "150%"
                }}
                translate={"auto"}
                rounded={"full"}
                bg={"rgb(205, 60, 190)"}
                opacity={{
                    _light: 0.15,
                    _dark: 0.1
                }}
                blur={"80px"}
                filter={"auto"}
                style={{
                    transform: `translateY(${-(scrollYProgress / 2) * 100}%)`
                }}
            />
        </Box>
    );
}
