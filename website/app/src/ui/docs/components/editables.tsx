import { Button } from "@/ui";
import { Editable } from "@/ui";
import { HStack } from "@/ui";
import { useRef, useState } from "react";

export function ControlledEditable() {
    const [value, setValue] = useState("Meow");

    return (
        <Editable.Root
            onChange={setValue}
            value={value}
        >
            <Editable.Preview />
            <Editable.Input />
            <HStack>
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </HStack>
        </Editable.Root>
    );
}

export function FinalFocusRefEditable() {
    const ref = useRef<HTMLButtonElement>(null);

    return (
        <>
            <Button ref={ref}>I receive focus</Button>

            <Editable.Root
                defaultValue="Meow"
                finalFocusRef={ref}
            >
                <Editable.Preview />
                <Editable.Input />
                <HStack>
                    <Editable.EditButton />
                    <Editable.SubmitButton />
                    <Editable.CancelButton />
                </HStack>
            </Editable.Root>
        </>
    );
}

export function StartWithEditViewEditable() {
    const [isRendered, setIsRendered] = useState(false);

    return (
        <>
            <Button onClick={() => setIsRendered((prev) => !prev)}>Toggle Editable</Button>

            {isRendered && (
                <Editable.Root
                    defaultValue="Meow"
                    placeholder="Enter an animal sound"
                    startWithEditView
                >
                    <Editable.Preview />
                    <Editable.Input />
                    <HStack>
                        <Editable.EditButton />
                        <Editable.SubmitButton />
                        <Editable.CancelButton />
                    </HStack>
                </Editable.Root>
            )}
        </>
    );
}
