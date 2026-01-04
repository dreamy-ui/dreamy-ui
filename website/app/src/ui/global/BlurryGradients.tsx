import { Box } from "@/ui";
import useScroll from "~/src/hooks/useScroll";

export default function BlurryGradients() {
    const { scrollYProgress } = useScroll();

    return (
        <Box
            inset={0}
            overflow={"hidden"}
            pos={"fixed"}
            zIndex={-10}
        >
            <Box
                bg={"rgb(73, 31, 171)"}
                blur={"80px"}
                bottom={"auto"}
                filter={"auto"}
                h={"500px"}
                left={"auto"}
                opacity={{
                    _light: 0.15,
                    _dark: 0.1
                }}
                pos={"absolute"}
                right={0}
                rounded={"full"}
                style={{
                    transform: `translateY(${(scrollYProgress / 2) * 100}%)`
                }}
                top={0}
                translate={"auto"}
                w={"500px"}
                x={{
                    base: "0%",
                    md: "-30%"
                }}
                y={"20%"}
            />
            {/* bottom left */}
            <Box
                bg={"rgb(205, 60, 190)"}
                blur={"80px"}
                bottom={"auto"}
                filter={"auto"}
                h={"750px"}
                left={0}
                opacity={{
                    _light: 0.15,
                    _dark: 0.1
                }}
                pos={"absolute"}
                right={"auto"}
                rounded={"full"}
                style={{
                    transform: `translateY(${-(scrollYProgress / 2) * 100}%)`
                }}
                top={0}
                translate={"auto"}
                w={"750px"}
                x={"-20%"}
                y={{
                    base: "110%",
                    md: "150%"
                }}
            />
        </Box>
    );
}
