import {
    Checkbox,
    Field,
    FieldError,
    FieldHelpText,
    FieldLabel,
    Input,
    Radio,
    RadioGroup,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Switch,
    Textarea
} from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Field"
} satisfies Meta;

export function Base() {
    return (
        <Field>
            <FieldLabel>Label</FieldLabel>
            <Input />
        </Field>
    );
}

export function WithHelpText() {
    return (
        <Field>
            <FieldLabel>Label</FieldLabel>
            <Input />
            <FieldHelpText>Help text</FieldHelpText>
        </Field>
    );
}

export function InvalidWithFieldError() {
    return (
        <Field isInvalid>
            <FieldLabel>Label</FieldLabel>
            <Input />
            <FieldError>Error</FieldError>
        </Field>
    );
}

export function Disabled() {
    return (
        <Field isDisabled>
            <FieldLabel>Label</FieldLabel>
            <Input />
        </Field>
    );
}

export function WithRequiredIndicator() {
    return (
        <Field isRequired>
            <FieldLabel>Label</FieldLabel>
            <Input />
        </Field>
    );
}

export function WithTextarea() {
    return (
        <Field>
            <FieldLabel>Label</FieldLabel>
            <Textarea />
        </Field>
    );
}

export function WithCheckbox() {
    return (
        <Field>
            <FieldLabel>Label</FieldLabel>
            <Checkbox>Checkbox</Checkbox>
        </Field>
    );
}

export function WithSwitch() {
    return (
        <Field>
            <FieldLabel>Label</FieldLabel>
            <Switch>Switch</Switch>
        </Field>
    );
}

export function WithRadio() {
    return (
        <Field>
            <FieldLabel>Label</FieldLabel>
            <RadioGroup>
                <Radio value="1">Radio 1</Radio>
                <Radio value="2">Radio 2</Radio>
            </RadioGroup>
        </Field>
    );
}

export function WithSlider() {
    return (
        <Field>
            <FieldLabel>Label</FieldLabel>
            <Slider>
                <SliderTrack>
                    <SliderFilledTrack />
                    <SliderThumb />
                </SliderTrack>
            </Slider>
        </Field>
    );
}
