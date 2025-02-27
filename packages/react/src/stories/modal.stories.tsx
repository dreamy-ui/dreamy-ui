import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@/components";
import { useControllable } from "@/hooks";
import type { Meta } from "@storybook/react";
import type { ModalVariantProps } from "styled-system/recipes";

export default {
    title: "Modal"
} satisfies Meta;

export function Base({ size }: { size?: ModalVariantProps["size"] }) {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <>
            <Button
                variant={"primary"}
                onClick={onOpen}
            >
                {(size as string) ?? "Open Modal"}
            </Button>
            <Modal
                size={size}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Header</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>Modal Body</ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export function Sizes() {
    return (
        <>
            <Base size={"sm"} />
            <Base size={"md"} />
            <Base size={"lg"} />
            <Base size={"xl"} />
            <Base size={"2xl"} />
            <Base size={"3xl"} />
            <Base size={"4xl"} />
            <Base size={"5xl"} />
            <Base size={"6xl"} />
            <Base size={"7xl"} />
            <Base size={"8xl"} />
            <Base size={"full"} />
        </>
    );
}

// pregenerate recipes, since panda cannot extract size
<Modal
    size="sm"
    isOpen={false}
    onClose={() => null}
>
    a
</Modal>;
<Modal
    size="md"
    isOpen={false}
    onClose={() => null}
>
    a
</Modal>;
<Modal
    size="lg"
    isOpen={false}
    onClose={() => null}
>
    a
</Modal>;
<Modal
    size="xl"
    isOpen={false}
    onClose={() => null}
>
    a
</Modal>;
<Modal
    size="2xl"
    isOpen={false}
    onClose={() => null}
>
    a
</Modal>;
<Modal
    size="3xl"
    isOpen={false}
    onClose={() => null}
>
    a
</Modal>;
<Modal
    size="4xl"
    isOpen={false}
    onClose={() => null}
>
    a
</Modal>;
<Modal
    size="5xl"
    isOpen={false}
    onClose={() => null}
>
    a
</Modal>;
<Modal
    size="6xl"
    isOpen={false}
    onClose={() => null}
>
    a
</Modal>;
<Modal
    size="7xl"
    isOpen={false}
    onClose={() => null}
>
    a
</Modal>;
<Modal
    size="8xl"
    isOpen={false}
    onClose={() => null}
>
    a
</Modal>;
<Modal
    size="full"
    isOpen={false}
    onClose={() => null}
>
    a
</Modal>;
