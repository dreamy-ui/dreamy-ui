"use client";

import { type IRipple, clampValue } from "@dreamy-ui/react";
import type { HTMLMotionProps } from "motion/react";
import { AnimatePresence } from "motion/react";
import type React from "react";
import { MotionBox } from "./motion";

export interface RippleProps {
    ripples: IRipple[];
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
                key={ripple.key}
                mode="popLayout"
            >
                <MotionBox
                    animate={{
                        scale: isEdgingThisRipple ? 1.8 : 2,
                        opacity: isEdgingThisRipple ? 0 : 0.01
                    }}
                    exit={{ opacity: 0 }}
                    initial={{
                        scale: 0,
                        opacity: 0.4
                    }}
                    onAnimationComplete={() => {
                        setTimeout(() => {
                            onClear(ripple.key);
                        }, duration * 1000);
                    }}
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
                    transition={{
                        type: "spring",
                        stiffness: isEdgingThisRipple ? 20 : 80,
                        damping: isEdgingThisRipple ? 25 : 20
                    }}
                    {...motionProps}
                    data-part="ripple"
                />
            </AnimatePresence>
        );
    });
}
