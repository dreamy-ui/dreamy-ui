import { Input, PinInput, PinInputField, Radio, RadioGroup } from "@dreamy-ui/react";
import { Flex, Grid, Spinner, Text } from "@dreamy-ui/react/rsc";

const components = [
    {
        title: "Pin Input",
        component: (
            <PinInput stacked>
                <PinInputField />
                <PinInputField />
                <PinInputField />
            </PinInput>
        )
    },
    {
        title: "Radio",
        component: (
            <RadioGroup defaultValue="dreamy-ui">
                <Radio value="dreamy-ui">Dreamy UI</Radio>
                <Radio value="panda-css">Panda CSS</Radio>
            </RadioGroup>
        )
    },
    {
        title: "Input",
        component: (
            <Input
                defaultValue="Dreamy UI"
                placeholder="Dreamy UI"
            />
        )
    },
    {
        title: "Spinner",
        component: <Spinner color={"primary"} />
    }
];

export default function FloatingComponents() {
    return (
        <Grid
            wFull
            columns={{
                base: 1,
                md: 2,
                xl: 4
            }}
        >
            {components.map((component, i) => (
                <Flex
                    wFull
                    key={`component-${i}`}
                    p={6}
                    rounded={"md"}
                    // bg={"alpha.50"}
                    borderColor={"border.muted"}
                    borderWidth={1}
                    col
                    gap={2}
                    animation={"downUp 5s {easings.easeInOut} infinite"}
                    animationDelay={`${i * 0.5}s`}
                >
                    <Text fontWeight={"semibold"}>{component.title}</Text>
                    {component.component}
                </Flex>
            ))}
        </Grid>
    );
}
