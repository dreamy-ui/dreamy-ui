import { useDisableRipple } from "@/provider";
import { getId } from "@/utils";
import type React from "react";
import { useCallback, useState } from "react";

export interface IRipple {
    key: React.Key;
    x: number;
    y: number;
    size: number;
}

export type UseRippleProps = {};

export function useRipple(props: UseRippleProps = {}) {
    const isGloballyDisabled = useDisableRipple();
    const [ripples, setRipples] = useState<IRipple[]>([]);

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
