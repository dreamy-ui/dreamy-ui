import { Flex, type FlexProps } from "@/components/flex";
import { createContext } from "@/provider/create-context";
import type { Status } from "@/utils/types";
import { forwardRef } from "react";

export interface AlertProps extends FlexProps {
    /**
     * The status of the alert.
     * @default "info"
     */
    status?: Status;
}

interface AlertContext {
    status: Status;
}

export const [AlertContextProvider, useAlertContext] = createContext<AlertContext>({
    name: "AlertContext",
    errorMessage:
        "useAlertContext: `context` is undefined. Seems you forgot to wrap alert components in `<Alert />`"
});

export const AlertRoot = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    const { status = "info", ...rest } = props;

    return (
        <AlertContextProvider value={{ status }}>
            <Flex data-status={status} {...rest} ref={ref} />
        </AlertContextProvider>
    );
});
