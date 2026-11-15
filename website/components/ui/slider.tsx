"use client";

import {
    Slider as UiSdkSlider,
    SliderControl as UiSdkSliderControl,
    SliderIndicator as UiSdkSliderIndicator,
    SliderThumb as UiSdkSliderThumb,
    SliderTrack as UiSdkSliderTrack,
    type SliderController,
    type SliderOptions,
    type SliderValueChangeDetails,
    type SliderValueCommitDetails
} from "@ui-sdk/react/slider";
import { dataAttr, useFieldProps } from "@dreamy-ui/react";
import { Children, createContext, isValidElement, useContext } from "react";
import { type HTMLDreamyProps, createStyleContext } from "styled-system/jsx";
import { slider } from "styled-system/recipes";
import { Box } from "./box";

const SLIDER_THUMB_TYPE = Symbol.for("dreamy.slider.thumb");

interface SliderThumbAria {
    label?: string;
    labelledby?: string;
    describedby?: string;
}

interface SliderControlState {
    isInvalid?: boolean;
    isReadOnly?: boolean;
    thumbAria?: SliderThumbAria;
}

const SliderControlContext = createContext<SliderControlState>({});

interface SliderMarkContextValue {
    min: number;
    max: number;
    orientation: "horizontal" | "vertical";
    reversed: boolean;
}

const SliderMarkContext = createContext<SliderMarkContextValue>({
    min: 0,
    max: 100,
    orientation: "horizontal",
    reversed: false
});

const { withProvider, withContext } = createStyleContext(slider);

type UiSdkSliderProps = SliderOptions<number> &
    Omit<
        React.ComponentProps<typeof UiSdkSlider>,
        "value" | "defaultValue" | "onValueChange" | "onValueCommit"
    >;

export interface SliderProps
    extends Omit<
        UiSdkSliderProps,
        | "value"
        | "defaultValue"
        | "onValueChange"
        | "onValueCommit"
        | "min"
        | "max"
        | "orientation"
        | "disabled"
        | "readOnly"
        | "required"
        | "isDisabled"
        | "isInvalid"
        | "isReadOnly"
        | "isRequired"
    > {
    size?: "sm" | "md" | "lg";
    hideThumb?: boolean;
    /**
     * Thumb diameter in pixels. Overrides the thumb size of the `size` variant.
     */
    thumbSize?: number;
    /**
     * Places the minimum value on the right. Only applies to horizontal sliders.
     */
    isReversed?: boolean;
    /**
     * Marks the slider as invalid for styling purposes.
     */
    isInvalid?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number, details: SliderValueChangeDetails) => void;
    onValueCommit?: (value: number, details: SliderValueCommitDetails) => void;
    min?: number;
    max?: number;
    orientation?: "horizontal" | "vertical";
    controller?: SliderController<number>;
}

const SIZE_CONFIG = {
    sm: { thumbSize: 20, trackSize: "8px" },
    md: { thumbSize: 22, trackSize: "16px" },
    lg: { thumbSize: 24, trackSize: "24px" }
} as const;

export const Root = withProvider(function Component(props: SliderProps) {
    const field = useFieldProps(props);

    const {
        size = "md",
        orientation = "horizontal",
        hideThumb = false,
        thumbSize: thumbSizeProp,
        isReversed = false,
        dir,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledby,
        "aria-describedby": _ariaDescribedby,
        value,
        defaultValue,
        onValueChange,
        onValueCommit,
        ref,
        className,
        style,
        children,
        isInvalid: isInvalidProp,
        disabled: disabledProp,
        readOnly: readOnlyProp,
        required: requiredProp,
        min = 0,
        max = 100,
        ...rest
    } = props;

    const config = SIZE_CONFIG[size];
    const thumbSize = hideThumb ? 0 : (thumbSizeProp ?? config.thumbSize);
    const isInvalid = Boolean(isInvalidProp ?? field.isInvalid);
    const isDisabled = Boolean(disabledProp ?? field.isDisabled);
    const isReadOnly = Boolean(readOnlyProp ?? field.isReadOnly);
    const isRequired = Boolean(requiredProp ?? field.isRequired);
    const reversed = isReversed && orientation === "horizontal";
    const resolvedDir = reversed ? (dir === "rtl" ? "ltr" : "rtl") : dir;

    const controlState: SliderControlState = {
        isInvalid,
        isReadOnly,
        thumbAria: {
            label: ariaLabel,
            labelledby:
                ariaLabelledby ??
                (ariaLabel || !field.id ? undefined : `${field.id}-label`),
            describedby: field["aria-describedby"]
        }
    };

    const markContext: SliderMarkContextValue = {
        min,
        max,
        orientation,
        reversed: isReversed && orientation === "horizontal"
    };

    return (
        <UiSdkSlider
            {...rest}
            ref={ref}
            className={className}
            data-hide-thumb={hideThumb ? "" : undefined}
            data-invalid={dataAttr(isInvalid)}
            defaultValue={defaultValue}
            dir={resolvedDir}
            disabled={isDisabled}
            id={field.id}
            max={max}
            min={min}
            onValueChange={(next, details) => {
                onValueChange?.(next as number, details);
            }}
            onValueCommit={(next, details) => {
                onValueCommit?.(next as number, details);
            }}
            orientation={orientation}
            readOnly={isReadOnly}
            required={isRequired}
            style={
                {
                    ...style,
                    "--slider-thumb-size": `${thumbSize}px`,
                    ...(orientation === "horizontal"
                        ? { height: config.trackSize }
                        : { width: config.trackSize })
                } as unknown as React.CSSProperties
            }
            value={value}
        >
            <SliderControlContext.Provider value={controlState}>
                <SliderMarkContext.Provider value={markContext}>
                    {children as React.ReactNode}
                </SliderMarkContext.Provider>
            </SliderControlContext.Provider>
        </UiSdkSlider>
    );
}, "root");

export interface SliderTrackProps extends HTMLDreamyProps<"div"> {}

function splitTrackChildren(children: React.ReactNode) {
    const trackChildren: React.ReactNode[] = [];
    const thumbs: React.ReactNode[] = [];

    Children.forEach(children, (child) => {
        if (
            isValidElement(child) &&
            (child.type as { thumbType?: symbol }).thumbType === SLIDER_THUMB_TYPE
        ) {
            thumbs.push(child);
            return;
        }
        trackChildren.push(child);
    });

    return { trackChildren, thumbs };
}

const TrackBar = withContext(UiSdkSliderTrack, "track");

/**
 * Layout props (e.g. `maxW`) land on the UI SDK control, so thumb positioning
 * and pointer hit-testing always match the visible track.
 */
export const Track = withContext(function Component(props: SliderTrackProps) {
    const { children, ...rest } = props;
    const { trackChildren, thumbs } = splitTrackChildren(children as React.ReactNode);

    return (
        <UiSdkSliderControl {...rest}>
            <TrackBar>{trackChildren}</TrackBar>
            {thumbs}
        </UiSdkSliderControl>
    );
}, "control");

export interface SliderFilledTrackProps extends HTMLDreamyProps<"div"> {}

export const FilledTrack = withContext(function Component(props: SliderFilledTrackProps) {
    return <UiSdkSliderIndicator {...props} />;
}, "trackFilled");

export interface SliderThumbProps extends HTMLDreamyProps<"div"> {}

function SliderThumbComponent(props: SliderThumbProps) {
    const control = useContext(SliderControlContext);
    const {
        "aria-readonly": ariaReadonly,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledby,
        "aria-describedby": ariaDescribedby,
        ...rest
    } = props;
    const thumbAria = control.thumbAria;

    return (
        <UiSdkSliderThumb
            aria-describedby={ariaDescribedby ?? thumbAria?.describedby}
            aria-label={ariaLabel ?? thumbAria?.label}
            aria-labelledby={ariaLabelledby ?? thumbAria?.labelledby}
            aria-readonly={ariaReadonly ?? (control.isReadOnly || undefined)}
            data-invalid={dataAttr(control.isInvalid)}
            index={0}
            {...rest}
        />
    );
}

SliderThumbComponent.thumbType = SLIDER_THUMB_TYPE;

export const Thumb = withContext(SliderThumbComponent, "thumb");

(Thumb as { thumbType?: symbol }).thumbType = SLIDER_THUMB_TYPE;

export interface SliderMarkProps extends HTMLDreamyProps<"div"> {
    value: number;
}

export const Mark = withContext(function Component(props: SliderMarkProps) {
    const { value, children, style, ...rest } = props;
    const { min, max, orientation, reversed } = useContext(SliderMarkContext);
    const range = max - min;
    const percent = range === 0 ? 0 : ((value - min) / range) * 100;
    const position = reversed ? 100 - percent : percent;
    const horizontal = orientation === "horizontal";

    return (
        <Box
            data-part="marker"
            {...rest}
            style={{
                position: "absolute",
                ...(horizontal
                    ? { left: `${position}%`, top: "50%", translate: "-50% -50%" }
                    : {
                          bottom: `${position}%`,
                          left: "50%",
                          translate: "-50% 50%"
                      }),
                ...(style as React.CSSProperties)
            }}
        >
            {children as React.ReactNode}
        </Box>
    );
}, "marker");
