import { Button } from "@dreamy-ui/react";
import { Flex, Text } from "@dreamy-ui/react/rsc";

export default function Home() {
    return (
        <Flex
            col
            w={"fit"}
        >
            <Text>Dreamy UI</Text>
            <Button>Click me</Button>
        </Flex>
    );
}
