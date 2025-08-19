import { Button } from "@/button";
import {
    Editable,
    EditableCancelButton,
    EditableEditButton,
    EditableInput,
    EditablePreview,
    EditableSubmitButton
} from "@/editable";
import { HStack } from "@/stack";
import { useRef, useState } from "react";

export function ControlledEditable() {
    const [value, setValue] = useState("Meow");

    return (
        <Editable
            value={value}
            onChange={setValue}
        >
            <EditablePreview />
            <EditableInput />
            <HStack>
                <EditableEditButton />
                <EditableSubmitButton />
                <EditableCancelButton />
            </HStack>
        </Editable>
    );
}

export function FinalFocusRefEditable() {
    const ref = useRef<HTMLButtonElement>(null);

    return (
        <>
            <Button ref={ref}>I receive focus</Button>

            <Editable
                defaultValue="Meow"
                finalFocusRef={ref}
            >
                <EditablePreview />
                <EditableInput />
                <HStack>
                    <EditableEditButton />
                    <EditableSubmitButton />
                    <EditableCancelButton />
                </HStack>
            </Editable>
        </>
    );
}

export function StartWithEditViewEditable() {
    const [isRendered, setIsRendered] = useState(false);

    return (
        <>
            <Button onClick={() => setIsRendered((prev) => !prev)}>Toggle Editable</Button>

            {isRendered && (
                <Editable
                    defaultValue="Meow"
                    placeholder="Enter an animal sound"
                    startWithEditView
                >
                    <EditablePreview />
                    <EditableInput />
                    <HStack>
                        <EditableEditButton />
                        <EditableSubmitButton />
                        <EditableCancelButton />
                    </HStack>
                </Editable>
            )}
        </>
    );
}
