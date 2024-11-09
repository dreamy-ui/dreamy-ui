import { Text, type TextProps } from "@/components/text";
import { forwardRef } from "react";

export interface AlertTitleprops extends TextProps {}

export const AlertTitleBase = forwardRef<HTMLHeadingElement, AlertTitleprops>(
    function AlertTitle(props, ref) {
        const { ...rest } = props;

        return <Text as={"h4"} {...rest} ref={ref} />;
    }
);
