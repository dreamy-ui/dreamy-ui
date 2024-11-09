import { Text, type TextProps } from "@/components/text";
import { forwardRef } from "react";

export interface AlertDescriptionProps extends TextProps {}

export const AlertDescriptionBase = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
    function AlertDescription(props, ref) {
        const { ...rest } = props;

        return <Text {...rest} ref={ref} />;
    }
);
