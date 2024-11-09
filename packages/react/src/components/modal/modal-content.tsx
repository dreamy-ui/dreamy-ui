import { MotionFlex, type MotionFlexProps } from "@/components/flex";
import { ModalContainer } from "@/components/modal/modal";
import { ModalFocusScope } from "@/components/modal/modal-focus";
import { useModalContext } from "@/components/modal/modal-root";
import { useDefaultTransition, useMotionVariants } from "@/provider";
import { forwardRef } from "react";

export interface ModalContentProps extends MotionFlexProps {}

export const ModalContentBase = forwardRef<HTMLDivElement, MotionFlexProps>(
    ({ children, ...props }, ref) => {
        const { getDialogProps } = useModalContext();
        const { modal } = useMotionVariants();
        const transition = useDefaultTransition();

        return (
            <>
                <ModalFocusScope>
                    <ModalContainer>
                        <MotionFlex
                            variants={modal.default}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={transition}
                            {...(getDialogProps(props as any, ref) as any)}
                        >
                            {children}
                        </MotionFlex>
                    </ModalContainer>
                </ModalFocusScope>
            </>
        );
    }
);
