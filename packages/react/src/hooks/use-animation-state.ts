import { getOwnerWindow } from "@/utils/owner";
import { useEffect, useState } from "react";
import { useEventListener } from "./use-event-listener";

export interface UseAnimationStateProps {
    isOpen: boolean;
    ref: React.RefObject<HTMLElement | null>;
}

export function useAnimationState(props: UseAnimationStateProps) {
    const { isOpen, ref } = props;

    const [mounted, setMounted] = useState(isOpen);
    const [once, setOnce] = useState(false);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (!once) {
            setMounted(isOpen);
            setOnce(true);
        }
    }, [isOpen, once, mounted]);

    useEventListener(
        "animationend",
        () => {
            setMounted(isOpen);
        },
        ref.current
    );

    const hidden = isOpen ? false : !mounted;

    return {
        present: !hidden,
        onComplete() {
            const win = getOwnerWindow(ref.current);
            const evt = new win.CustomEvent("animationend", { bubbles: true });
            ref.current?.dispatchEvent(evt);
        }
    };
}
