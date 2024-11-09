import { MotionBox, type MotionBoxProps } from "@/components/box";
import { useModalContext } from "@/components/modal/modal-root";
import { useMotionVariants } from "@/provider";
import { AnimatePresence } from "framer-motion";
import { forwardRef } from "react";

export interface ModalOverlayProps extends MotionBoxProps {}

export const ModalOverlayBase = forwardRef<HTMLDivElement, ModalOverlayProps>((props, ref) => {
    const { isOpen } = useModalContext();
    const { overlay } = useMotionVariants();

    return (
        <AnimatePresence>
            {isOpen && (
                <MotionBox
                    variants={overlay.default}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    ref={ref}
                    {...props}
                />
            )}
        </AnimatePresence>
    );
});
