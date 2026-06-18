import { useEffect, useState } from "react";

export interface UseAnimationStateProps {
    isOpen: boolean;
    ref: React.RefObject<HTMLElement | null>;
}

export function useAnimationState(props: UseAnimationStateProps) {
    const { isOpen } = props;

    const [mounted, setMounted] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
        }
    }, [isOpen]);

    const hidden = isOpen ? false : !mounted;

    return {
        present: !hidden,
        onComplete() {
            setMounted(isOpen);
        }
    };
}
