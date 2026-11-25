"use client";

import {
    Slider as UiSdkSlider,
    SliderControl as UiSdkSliderControl,
    SliderIndicator as UiSdkSliderIndicator,
    SliderThumb as UiSdkSliderThumb,
    SliderTrack as UiSdkSliderTrack,
    SliderValue as UiSdkSliderValue,
    createSliderController,
    type SliderController,
    type SliderOptions,
    type SliderThumbState,
    type SliderValueChangeDetails,
    type SliderValueCommitDetails,
    type SliderValueState
} from "@ui-sdk/react/slider";
import { dataAttr, useFieldProps } from "@dreamy-ui/react";
import {
    type CSSProperties,
    Children,
    cloneElement,
    createContext,
    isValidElement,
    useContext
} from "react";
import { css, cx } from "styled-system/css";
import { type HTMLDreamyProps, createStyleContext, splitCssProps } from "styled-system/jsx";
import { type RangeSliderVariantProps, rangeSlider } from "styled-system/recipes";
import { Box } from "../box";

const { withProvider, withContext } = createStyleContext(rangeSlider);

export { createSliderController };
export type { SliderThumbState, SliderValueState };

const RANGE_THUMB_TYPE = Symbol.for("dreamy.range-slider.thumb");
const RANGE_TRACK_TYPE = Symbol.for("dreamy.range-slider.track");

interface RangeSliderThumbAria {
    label?: string;
    labelledby?: string;
    describedby?: string;
}

interface RangeSliderState {
    isInvalid: boolean;
    isReadOnly: boolean;
    getThumbAria: (index: number) => RangeSliderThumbAria;
}

const RangeSliderStateContext = createContext<RangeSliderState>({
    isInvalid: false,
    isReadOnly: false,
    getThumbAria: () => ({})
});

interface RangeSliderMarkContextValue {
    min: number;
    max: number;
    orientation: "horizontal" | "vertical";
    reversed: boolean;
}

const RangeSliderMarkContext = createContext<RangeSliderMarkContextValue>({
    min: 0,
    max: 100,
    orientation: "horizontal",
    reversed: false
});

function isRangeThumbElement(child: React.ReactNode) {
    return (
        isValidElement(child) &&
        (child.type as { thumbType?: symbol }).thumbType === RANGE_THUMB_TYPE
    );
}

function isRangeTrackElement(child: React.ReactNode) {
    return (
        isValidElement(child) &&
        (child.type as { trackType?: symbol }).trackType === RANGE_TRACK_TYPE
    );
}

function mergeRootThumbsIntoTrack(children: React.ReactNode) {
    const rootThumbs: React.ReactNode[] = [];
    const rest: React.ReactNode[] = [];
    let firstTrack: React.ReactElement | null = null;
    let firstTrackIndex = -1;

    Children.forEach(children, (child) => {
        if (isRangeThumbElement(child)) {
            rootThumbs.push(child);
            return;
        }

        if (isRangeTrackElement(child)) {
            if (firstTrack === null) {
                firstTrack = child as React.ReactElement;
                firstTrackIndex = rest.length;
            }
        }

        rest.push(child);
    });

    if (rootThumbs.length === 0 || firstTrack === null || firstTrackIndex === -1) {
        return children;
    }

    const trackElement = firstTrack as React.ReactElement<{
        children?: React.ReactNode;
    }>;
    const mergedTrack = cloneElement(
        trackElement,
        {},
        ...(Children.toArray(trackElement.props.children) as React.ReactNode[]),
        ...rootThumbs
    );

    const result = [...rest];
    result[firstTrackIndex] = mergedTrack;
    return result;
}

type RangeValue = [number, number];

type UiSdkRangeSliderProps = SliderOptions<number[]> &
    Omit<
        React.ComponentProps<typeof UiSdkSlider>,
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
    >;

export interface RangeSliderProps<Value extends number[] = RangeValue>
    extends Omit<
        UiSdkRangeSliderProps,
        | "aria-label"
        | "controller"
        | "value"
        | "defaultValue"
        | "onValueChange"
        | "onValueCommit"
    > {
    size?: "sm" | "md" | "lg";
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
    value?: Value;
    defaultValue?: Value;
    onValueChange?: (value: Value, details: SliderValueChangeDetails) => void;
    onValueCommit?: (value: Value, details: SliderValueCommitDetails) => void;
    min?: number;
    max?: number;
    orientation?: "horizontal" | "vertical";
    controller?: SliderController<Value>;
    /**
     * Names each thumb for screen readers: one label per thumb, in thumb
     * order. A single string labels the whole slider group instead.
     */
    "aria-label"?: string | string[];
}

const SIZE_CONFIG = {
    sm: { thumbSize: 20, trackSize: "8px" },
    md: { thumbSize: 22, trackSize: "16px" },
    lg: { thumbSize: 24, trackSize: "24px" }
} as const;

function RangeSliderRoot<Value extends number[] = RangeValue>(props: RangeSliderProps<Value>) {
    const field = useFieldProps(props as Parameters<typeof useFieldProps>[0]);

    const {
        size = "md",
        orientation = "horizontal",
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
        controller,
        ...rest
    } = props;

    const config = SIZE_CONFIG[size];
    const thumbSize = thumbSizeProp ?? config.thumbSize;
    const isInvalid = Boolean(isInvalidProp ?? field.isInvalid);
    const isDisabled = Boolean(disabledProp ?? field.isDisabled);
    const isReadOnly = Boolean(readOnlyProp ?? field.isReadOnly);
    const isRequired = Boolean(requiredProp ?? field.isRequired);
    const reversed = isReversed && orientation === "horizontal";
    const resolvedDir = reversed ? (dir === "rtl" ? "ltr" : "rtl") : dir;

    const usingArrayLabels = Array.isArray(ariaLabel);
    const getThumbAria = (index: number): RangeSliderThumbAria => ({
        label: usingArrayLabels ? ariaLabel[index] : undefined,
        labelledby:
            ariaLabelledby ??
            (usingArrayLabels || !field.id ? undefined : `${field.id}-label`),
        describedby: field["aria-describedby"]
    });

    const sliderState: RangeSliderState = {
        isInvalid,
        isReadOnly,
        getThumbAria
    };

    const markContext: RangeSliderMarkContextValue = {
        min,
        max,
        orientation,
        reversed: isReversed && orientation === "horizontal"
    };

    return (
        <UiSdkSlider
            {...rest}
            aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
            controller={controller as SliderController<number[]> | undefined}
            ref={ref}
            className={className}
            data-invalid={dataAttr(isInvalid)}
            defaultValue={defaultValue ?? ([min, max] as RangeValue)}
            dir={resolvedDir}
            disabled={isDisabled}
            id={field.id}
            max={max}
            min={min}
            onValueChange={(next, details) => {
                onValueChange?.(next as Value, details);
            }}
            onValueCommit={(next, details) => {
                onValueCommit?.(next as Value, details);
            }}
            orientation={orientation}
            readOnly={isReadOnly}
            required={isRequired}
            style={
                {
                    ...style,
                    "--range-slider-thumb-size": `${thumbSize}px`,
                    "--range-slider-track-size": config.trackSize
                } as unknown as React.CSSProperties
            }
            value={value}
        >
            <RangeSliderStateContext.Provider value={sliderState}>
                <RangeSliderMarkContext.Provider value={markContext}>
                    {mergeRootThumbsIntoTrack(children as React.ReactNode) as React.ReactElement}
                </RangeSliderMarkContext.Provider>
            </RangeSliderStateContext.Provider>
        </UiSdkSlider>
    );
}

export const Root = withProvider(RangeSliderRoot, "root") as {
    <Value extends number[] = RangeValue>(
        props: RangeSliderProps<Value> &
            RangeSliderVariantProps &
            Omit<
                HTMLDreamyProps<"div">,
                keyof RangeSliderProps<Value> | keyof RangeSliderVariantProps
            >
    ): React.JSX.Element;
    (
        props: RangeSliderProps<RangeValue> &
            RangeSliderVariantProps &
            Omit<
                HTMLDreamyProps<"div">,
                keyof RangeSliderProps<RangeValue> | keyof RangeSliderVariantProps
            >
    ): React.JSX.Element;
};

function splitTrackChildren(children: React.ReactNode) {
    const trackChildren: React.ReactNode[] = [];
    const thumbs: React.ReactNode[] = [];

    Children.forEach(children, (child) => {
        if (isRangeThumbElement(child)) {
            thumbs.push(child);
            return;
        }
        trackChildren.push(child);
    });

    return { trackChildren, thumbs };
}

export interface RangeSliderTrackProps extends HTMLDreamyProps<"div"> {}

const TrackBar = withContext(UiSdkSliderTrack, "track");

/**
 * Layout props (e.g. `maxW`) land on the UI SDK control, so thumb positioning
 * and pointer hit-testing always match the visible track.
 */
export const Track = withContext(function Component(props: RangeSliderTrackProps) {
    const { children, className, style, ...rest } = props;
    const { trackChildren, thumbs } = splitTrackChildren(children as React.ReactNode);
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkSliderControl
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkSliderControl>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            <TrackBar>{trackChildren as React.ReactNode[]}</TrackBar>
            {thumbs}
        </UiSdkSliderControl>
    );
}, "control");

(Track as { trackType?: symbol }).trackType = RANGE_TRACK_TYPE;

export interface RangeSliderFilledTrackProps extends HTMLDreamyProps<"div"> {}

export const FilledTrack = withContext(function Component(props: RangeSliderFilledTrackProps) {
    const { className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkSliderIndicator
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkSliderIndicator>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        />
    );
}, "trackFilled");

export interface RangeSliderThumbProps
    extends Omit<HTMLDreamyProps<"div">, "children">,
        Pick<React.ComponentProps<typeof UiSdkSliderThumb>, "children" | "render"> {
    index: number;
}

function RangeSliderThumbComponent(props: RangeSliderThumbProps) {
    const {
        index,
        "aria-readonly": ariaReadonly,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledby,
        "aria-describedby": ariaDescribedby,
        children,
        render,
        className,
        style,
        ...rest
    } = props;
    const [cssProps, domProps] = splitCssProps(rest);
    const { isInvalid, isReadOnly, getThumbAria } = useContext(RangeSliderStateContext);
    const fallback = getThumbAria(index);

    return (
        <UiSdkSliderThumb
            aria-describedby={ariaDescribedby ?? fallback?.describedby}
            aria-label={ariaLabel ?? fallback?.label}
            aria-labelledby={ariaLabelledby ?? fallback?.labelledby}
            aria-readonly={ariaReadonly ?? (isReadOnly || undefined)}
            className={cx(className as string | undefined, css(cssProps))}
            data-invalid={dataAttr(isInvalid)}
            index={index}
            render={render}
            style={style as CSSProperties | undefined}
            {...(domProps as unknown as Omit<
                React.ComponentProps<typeof UiSdkSliderThumb>,
                "index" | "children" | "render"
            >)}
        >
            {children}
        </UiSdkSliderThumb>
    );
}

RangeSliderThumbComponent.thumbType = RANGE_THUMB_TYPE;

export const Thumb = withContext(RangeSliderThumbComponent, "thumb");

(Thumb as { thumbType?: symbol }).thumbType = RANGE_THUMB_TYPE;

export interface RangeSliderValueProps
    extends Omit<HTMLDreamyProps<"output">, "children">,
        Pick<React.ComponentProps<typeof UiSdkSliderValue>, "children" | "render"> {}

export function Value(props: RangeSliderValueProps) {
    const { children, render, className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkSliderValue
            {...(domProps as unknown as Omit<
                React.ComponentProps<typeof UiSdkSliderValue>,
                "children" | "render"
            >)}
            className={cx(className as string | undefined, css(cssProps))}
            render={render}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkSliderValue>
    );
}

export interface RangeSliderMarkProps extends HTMLDreamyProps<"div"> {
    value: number;
}

export const Mark = withContext(function Component(props: RangeSliderMarkProps) {
    const { value, children, style, ...rest } = props;
    const { min, max, orientation, reversed } = useContext(RangeSliderMarkContext);
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
            {children}
        </Box>
    );
}, "marker");
