"use client";

import { clampValue, getId, useDisableRipple } from "@dreamy-ui/react";
import type { HTMLMotionProps } from "motion/react";
import { AnimatePresence } from "motion/react";
import type React from "react";
import { useCallback, useState } from "react";
import { MotionBox } from "./motion";

export interface RippleProps {
    ripples: RippleType[];
    currentRipple: string | null;
    color?: string;
    motionProps?: HTMLMotionProps<"div">;
    style?: React.CSSProperties;
    onClear: (key: React.Key) => void;
}

/**
 * Ripple component. Use with `useRipple` hook.
 */
export function Ripple(props: RippleProps) {
    const {
        ripples = [],
        currentRipple,
        motionProps,
        color = "currentColor",
        style,
        onClear
    } = props;

    return ripples.map((ripple) => {
        const isEdgingThisRipple = !!currentRipple && ripples.at(-1)?.key === ripple.key;
        const duration = clampValue(
            0.01 * ripple.size,
            isEdgingThisRipple ? 2 : 0.3,
            isEdgingThisRipple ? 3 : ripple.size > 100 ? 0.75 : 0.4
        );

        return (
            <AnimatePresence
                mode="popLayout"
                key={ripple.key}
            >
                <MotionBox
                    initial={{
                        scale: 0,
                        opacity: 0.4
                    }}
                    animate={{
                        scale: isEdgingThisRipple ? 1.8 : 2,
                        opacity: isEdgingThisRipple ? 0 : 0.01
                    }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: "absolute",
                        backgroundColor: color,
                        borderRadius: "100%",
                        transformOrigin: "center",
                        pointerEvents: "none",
                        overflow: "hidden",
                        inset: 0,
                        zIndex: 0,
                        top: ripple.y,
                        left: ripple.x,
                        width: `${ripple.size}px`,
                        height: `${ripple.size}px`,
                        willChange: "transform, opacity",
                        ...style
                    }}
                    transition={{ duration }}
                    onAnimationComplete={() => {
                        setTimeout(() => {
                            onClear(ripple.key);
                        }, duration * 1000);
                    }}
                    {...motionProps}
                    data-part="ripple"
                />
            </AnimatePresence>
        );
    });
}

export type RippleType = {
    key: React.Key;
    x: number;
    y: number;
    size: number;
};

export type UseRippleProps = {};

export function useRipple(props: UseRippleProps = {}) {
    const isGloballyDisabled = useDisableRipple();
    const [ripples, setRipples] = useState<RippleType[]>([]);

    const [currentRipple, setCurrentRipple] = useState<string | null>(null);

    const onPointerDown = useCallback(
        (event: React.PointerEvent<HTMLElement> | React.MouseEvent<HTMLElement, MouseEvent>) => {
            const trigger = event.currentTarget;
            /**
             * Allow only main mouse button clicks.
             * Allowing also secondary, since some people use left-handed mouse.
             */
            if (event.button !== 0 && event.button !== 2) return;

            const size = Math.max(trigger.clientWidth, trigger.clientHeight);
            const rect = trigger.getBoundingClientRect();

            const key = getId();

            setRipples((prevRipples) => [
                ...prevRipples.slice(-3),
                {
                    key,
                    size,
                    x: event.clientX - rect.left - size / 2,
                    y: event.clientY - rect.top - size / 2
                }
            ]);
            setCurrentRipple(key);
        },
        []
    );

    const onClick = useCallback((_event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setCurrentRipple(null);
    }, []);

    const onClear = useCallback((key: React.Key) => {
        setRipples((prevState) => prevState.filter((ripple) => ripple.key !== key));
    }, []);

    return {
        ripples,
        onClick,
        onPointerDown,
        onClear,
        currentRipple,
        isDisabled: isGloballyDisabled,
        ...props
    };
}

export type UseRippleReturn = ReturnType<typeof useRipple>;
