"use client";

import { Slider as ArkSlider } from "@ark-ui/react/slider";
import { ariaAttr, dataAttr, useFieldContext, useFieldProps } from "@dreamy-ui/react";
import { Children, createContext, isValidElement, useContext } from "react";
import { type HTMLDreamyProps, createStyleContext } from "styled-system/jsx";
import { slider } from "styled-system/recipes";
import { Box } from "../box";
import { fromSliderValue, toSliderValue } from "./map-slider-value";

const SLIDER_THUMB_TYPE = Symbol.for("dreamy.slider.thumb");

interface SliderControlState {
    isInvalid?: boolean;
    isReadOnly?: boolean;
}

const SliderControlContext = createContext<SliderControlState>({});

const { withProvider, withContext } = createStyleContext(slider);

export interface SliderProps
    extends Omit<
        React.ComponentProps<typeof ArkSlider.Root>,
        "value" | "defaultValue" | "onValueChange" | "onValueChangeEnd"
    > {
    size?: "sm" | "md" | "lg";
    hideThumb?: boolean;
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
    onChangeValue?: (value: number) => void;
    onChangeEnd?: (value: number) => void;
    focusThumbOnChange?: boolean;
    isDisabled?: boolean;
    isInvalid?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
}

const SIZE_CONFIG = {
    sm: { thumbSize: 20, trackSize: "8px" },
    md: { thumbSize: 22, trackSize: "16px" },
    lg: { thumbSize: 24, trackSize: "24px" }
} as const;

export const Root = withProvider(function Component(props: SliderProps) {
    const field = useFieldProps(props);
    const fieldContext = useFieldContext();

    const {
        size = "md",
        orientation = "horizontal",
        hideThumb = false,
        value,
        defaultValue,
        onChange,
        onChangeValue,
        onChangeEnd,
        ref,
        className,
        style,
        children,
        isDisabled,
        isInvalid,
        isReadOnly,
        isRequired,
        disabled,
        invalid,
        readOnly,
        required,
        ids,
        ...restProps
    } = props;

    const config = SIZE_CONFIG[size];
    const thumbSize = hideThumb ? 0 : config.thumbSize;
    const rootIds =
        fieldContext?.labelId != null
            ? { ...ids, label: fieldContext.labelId }
            : ids;
    const controlState = {
        isInvalid: Boolean(invalid ?? isInvalid ?? field.isInvalid),
        isReadOnly: Boolean(readOnly ?? isReadOnly ?? field.isReadOnly)
    };

    return (
        <ArkSlider.Root
            {...restProps}
            asChild
            defaultValue={toSliderValue(defaultValue)}
            disabled={disabled ?? isDisabled ?? field.isDisabled}
            id={field.id ?? restProps.id}
            ids={rootIds}
            invalid={invalid ?? isInvalid ?? field.isInvalid}
            onValueChange={(details) => {
                const next = fromSliderValue(details.value);
                onChange?.(next);
                onChangeValue?.(next);
            }}
            onValueChangeEnd={(details) => {
                onChangeEnd?.(fromSliderValue(details.value));
            }}
            orientation={orientation}
            readOnly={readOnly ?? isReadOnly ?? field.isReadOnly}
            ref={ref}
            required={required ?? isRequired ?? field.isRequired}
            thumbSize={hideThumb ? undefined : config.thumbSize}
            value={toSliderValue(value)}
        >
            <Box
                className={className}
                data-hide-thumb={hideThumb ? "" : undefined}
                data-part="root"
                style={
                    {
                        ...style,
                        // @ts-expect-error css vars
                        "--slider-thumb-size": `${thumbSize}px`,
                        ...(orientation === "horizontal"
                            ? { height: config.trackSize }
                            : { width: config.trackSize })
                    } as React.CSSProperties
                }
            >
                <SliderControlContext.Provider value={controlState}>
                    {children}
                </SliderControlContext.Provider>
            </Box>
        </ArkSlider.Root>
    );
}, "root");

export interface SliderTrackProps extends HTMLDreamyProps<"div"> {}

function splitTrackChildren(children: React.ReactNode) {
    const trackChildren: React.ReactNode[] = [];
    const thumbs: React.ReactNode[] = [];

    Children.forEach(children, (child) => {
        if (isValidElement(child) && (child.type as { thumbType?: symbol }).thumbType === SLIDER_THUMB_TYPE) {
            thumbs.push(child);
            return;
        }
        trackChildren.push(child);
    });

    return { trackChildren, thumbs };
}

export const Track = withContext(function Component(props: SliderTrackProps) {
    const { children, ...rest } = props;
    const { trackChildren, thumbs } = splitTrackChildren(children);

    return (
        <ArkSlider.Control>
            <ArkSlider.Track {...rest}>{trackChildren}</ArkSlider.Track>
            {thumbs}
        </ArkSlider.Control>
    );
}, "track");

export interface SliderFilledTrackProps extends HTMLDreamyProps<"div"> {}

export const FilledTrack = withContext(function Component(props: SliderFilledTrackProps) {
    return <ArkSlider.Range {...props} />;
}, "trackFilled");

export interface SliderThumbProps extends HTMLDreamyProps<"div"> {}

function SliderThumbComponent(props: SliderThumbProps) {
    const control = useContext(SliderControlContext);

    return (
        <ArkSlider.Thumb
            aria-readonly={ariaAttr(control.isReadOnly)}
            data-invalid={dataAttr(control.isInvalid)}
            index={0}
            {...props}
        >
            <ArkSlider.HiddenInput />
        </ArkSlider.Thumb>
    );
}

SliderThumbComponent.thumbType = SLIDER_THUMB_TYPE;

export const Thumb = withContext(SliderThumbComponent, "thumb");

(Thumb as { thumbType?: symbol }).thumbType = SLIDER_THUMB_TYPE;

export interface SliderMarkProps extends HTMLDreamyProps<"div"> {
    value: number;
}

export const Mark = withContext(function Component(props: SliderMarkProps) {
    const { value, ...rest } = props;
    return (
        <ArkSlider.Marker
            value={value}
            {...rest}
        />
    );
}, "marker");
