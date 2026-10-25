"use client";

import { Slider as ArkSlider, useSliderContext } from "@ark-ui/react/slider";
import { useFieldContext, useFieldProps } from "@dreamy-ui/react";
import { Children, cloneElement, createContext, isValidElement, useContext } from "react";
import { type HTMLDreamyProps, createStyleContext } from "styled-system/jsx";
import { rangeSlider } from "styled-system/recipes";
import { Box } from "../box";

const { withProvider, withContext } = createStyleContext(rangeSlider);

const RANGE_THUMB_TYPE = Symbol.for("dreamy.range-slider.thumb");
const RANGE_TRACK_TYPE = Symbol.for("dreamy.range-slider.track");

interface RangeSliderState {
    isInvalid: boolean;
    isReadOnly: boolean;
}

const RangeSliderStateContext = createContext<RangeSliderState>({
    isInvalid: false,
    isReadOnly: false
});

function isRangeThumbElement(child: React.ReactNode) {
    return isValidElement(child) && (child.type as { thumbType?: symbol }).thumbType === RANGE_THUMB_TYPE;
}

function isRangeTrackElement(child: React.ReactNode) {
    return isValidElement(child) && (child.type as { trackType?: symbol }).trackType === RANGE_TRACK_TYPE;
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
                firstTrack = child;
                firstTrackIndex = rest.length;
            }
        }

        rest.push(child);
    });

    if (rootThumbs.length === 0 || firstTrack === null || firstTrackIndex === -1) {
        return children;
    }

    const mergedTrack = cloneElement(
        firstTrack,
        {},
        Children.toArray(firstTrack.props.children),
        ...rootThumbs
    );

    const result = [...rest];
    result[firstTrackIndex] = mergedTrack;
    return result;
}

export interface RangeSliderProps
    extends Omit<
        React.ComponentProps<typeof ArkSlider.Root>,
        "value" | "defaultValue" | "onValueChange" | "onValueChangeEnd"
    > {
    size?: "sm" | "md" | "lg";
    value?: [number, number];
    defaultValue?: [number, number];
    onChange?: (value: [number, number]) => void;
    onChangeValue?: (value: [number, number]) => void;
    onChangeEnd?: (value: [number, number]) => void;
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

function toTuple(value?: [number, number]) {
    return value ? [...value] : undefined;
}

export const Root = withProvider(function Component(props: RangeSliderProps) {
    const field = useFieldProps(props);
    const fieldContext = useFieldContext();

    const {
        size = "md",
        orientation = "horizontal",
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
    const rootIds =
        fieldContext?.labelId != null ? { ...ids, label: fieldContext.labelId } : ids;
    const sliderState: RangeSliderState = {
        isInvalid: Boolean(invalid ?? isInvalid ?? field.isInvalid),
        isReadOnly: Boolean(readOnly ?? isReadOnly ?? field.isReadOnly)
    };

    return (
        <ArkSlider.Root
            {...restProps}
            asChild
            defaultValue={toTuple(defaultValue)}
            disabled={disabled ?? isDisabled ?? field.isDisabled}
            id={field.id ?? restProps.id}
            ids={rootIds}
            invalid={invalid ?? isInvalid ?? field.isInvalid}
            onValueChange={(details) => {
                const tuple = details.value as [number, number];
                onChange?.(tuple);
                onChangeValue?.(tuple);
            }}
            onValueChangeEnd={(details) => {
                onChangeEnd?.(details.value as [number, number]);
            }}
            orientation={orientation}
            readOnly={readOnly ?? isReadOnly ?? field.isReadOnly}
            ref={ref}
            required={required ?? isRequired ?? field.isRequired}
            thumbSize={config.thumbSize}
            value={toTuple(value)}
        >
            <Box
                className={className}
                data-part="root"
                style={
                    {
                        ...style,
                        "--range-slider-thumb-size": `${config.thumbSize}px`,
                        ...(orientation === "horizontal"
                            ? { height: config.trackSize }
                            : { width: config.trackSize })
                    } as React.CSSProperties
                }
            >
                <RangeSliderStateContext.Provider value={sliderState}>
                    {mergeRootThumbsIntoTrack(children)}
                </RangeSliderStateContext.Provider>
            </Box>
        </ArkSlider.Root>
    );
}, "root");

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

export const Track = withContext(function Component(props: RangeSliderTrackProps) {
    const { children, ...rest } = props;
    const { trackChildren, thumbs } = splitTrackChildren(children);

    return (
        <ArkSlider.Control>
            <ArkSlider.Track {...rest}>{trackChildren}</ArkSlider.Track>
            {thumbs}
        </ArkSlider.Control>
    );
}, "track");

(Track as { trackType?: symbol }).trackType = RANGE_TRACK_TYPE;

export interface RangeSliderFilledTrackProps extends HTMLDreamyProps<"div"> {}

export const FilledTrack = withContext(function Component(props: RangeSliderFilledTrackProps) {
    return <ArkSlider.Range {...props} />;
}, "trackFilled");

export interface RangeSliderThumbProps extends HTMLDreamyProps<"div"> {
    index: 0 | 1;
}

function RangeSliderThumbComponent(props: RangeSliderThumbProps) {
    const { index, ...rest } = props;
    const slider = useSliderContext();
    const { isInvalid, isReadOnly } = useContext(RangeSliderStateContext);
    const thumbProps = { ...slider.getThumbProps({ index }), ...rest };

    if (thumbProps["aria-label"]) {
        delete thumbProps["aria-labelledby"];
    }

    if (isInvalid) {
        thumbProps["data-invalid"] = "";
    }

    if (isReadOnly) {
        thumbProps["aria-readonly"] = "true";
    }

    const hiddenInputProps = slider.getHiddenInputProps({ index });

    return (
        <div {...thumbProps}>
            <input {...hiddenInputProps} />
        </div>
    );
}

RangeSliderThumbComponent.thumbType = RANGE_THUMB_TYPE;

export const Thumb = withContext(RangeSliderThumbComponent, "thumb");

(Thumb as { thumbType?: symbol }).thumbType = RANGE_THUMB_TYPE;

export interface RangeSliderMarkProps extends HTMLDreamyProps<"div"> {
    value: number;
}

export const Mark = withContext(function Component(props: RangeSliderMarkProps) {
    const { value, ...rest } = props;
    return (
        <ArkSlider.Marker
            value={value}
            {...rest}
        />
    );
}, "marker");
