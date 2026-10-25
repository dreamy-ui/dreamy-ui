import { useRef, useState } from "react";

/**
 * Keeps the floating layer mounted while Motion runs the exit animation.
 */
export function useFloatingPresent(open: boolean, reduceMotion: boolean) {
    const hasBeenOpenRef = useRef(false);
    const [exitDone, setExitDone] = useState(false);

    if (open) {
        hasBeenOpenRef.current = true;
        if (exitDone) {
            setExitDone(false);
        }
    }

    const isExiting = !open && hasBeenOpenRef.current && !reduceMotion && !exitDone;
    const present = open || isExiting;

    function handleExitComplete() {
        setExitDone(true);
    }

    return { present, handleExitComplete };
}
