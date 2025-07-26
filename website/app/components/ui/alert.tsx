import type { Status } from "@dreamy-ui/react";
import { forwardRef, useMemo } from "react";
import { type AlertVariantProps, alert } from "styled-system/recipes";
import { type HTMLDreamyProps, dreamy } from "./factory";
import { Icon } from "./icon";
import { Text } from "./text";

export interface AlertProps extends Omit<HTMLDreamyProps<"div">, "title">, AlertVariantProps {
    /**
     * The status of the alert.
     * @default "info"
     */
    status?: Status;
    /**
     * The title of the alert.
     */
    title?: React.ReactNode;
    /**
     * The description of the alert.
     */
    description?: React.ReactNode;
    /**
     * Custom alert icon
     */
    icon?: React.ReactNode;
}

const StyledAlert = dreamy("div", alert);

/**
 * Alert component
 *
 * @See Docs https://dreamy-ui.com/docs/components/alert
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    const { status = "info", title, description, ...rest } = props;

    const statusIcon = useStatusIcon(status);

    return (
        <StyledAlert
            data-status={status}
            {...rest}
            ref={ref}
        >
            <Text
                data-part={"title"}
                as={"h4"}
            >
                <Icon
                    role="img"
                    data-part={"icon"}
                    asChild
                >
                    {statusIcon}
                </Icon>
                {title}
            </Text>
            {description && <Text data-part={"description"}>{description}</Text>}
        </StyledAlert>
    );
});

export function useStatusIcon(status: Status) {
    return useMemo(() => {
        switch (status) {
            case "success":
                return (
                    <svg
                        viewBox="0 0 512 512"
                        role={"img"}
                        aria-hidden
                    >
                        <path
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="32"
                            d="M416 128 192 384l-96-96"
                        />
                    </svg>
                );
            case "warning":
                return (
                    <svg
                        strokeWidth="0"
                        viewBox="0 0 256 256"
                        role={"img"}
                        aria-hidden
                    >
                        <path
                            d="M224,91.55v72.9a8,8,0,0,1-2.34,5.66l-51.55,51.55a8,8,0,0,1-5.66,2.34H91.55a8,8,0,0,1-5.66-2.34L34.34,170.11A8,8,0,0,1,32,164.45V91.55a8,8,0,0,1,2.34-5.66L85.89,34.34A8,8,0,0,1,91.55,32h72.9a8,8,0,0,1,5.66,2.34l51.55,51.55A8,8,0,0,1,224,91.55Z"
                            opacity="0.2"
                        />
                        <path d="M120,136V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0ZM232,91.55v72.9a15.86,15.86,0,0,1-4.69,11.31l-51.55,51.55A15.86,15.86,0,0,1,164.45,232H91.55a15.86,15.86,0,0,1-11.31-4.69L28.69,175.76A15.86,15.86,0,0,1,24,164.45V91.55a15.86,15.86,0,0,1,4.69-11.31L80.24,28.69A15.86,15.86,0,0,1,91.55,24h72.9a15.86,15.86,0,0,1,11.31,4.69l51.55,51.55A15.86,15.86,0,0,1,232,91.55Zm-16,0L164.45,40H91.55L40,91.55v72.9L91.55,216h72.9L216,164.45ZM128,160a12,12,0,1,0,12,12A12,12,0,0,0,128,160Z" />
                    </svg>
                );
            case "error":
                return (
                    <svg
                        viewBox="0 0 256 256"
                        role={"img"}
                        aria-hidden
                    >
                        <path
                            d="M215.46,216H40.54C27.92,216,20,202.79,26.13,192.09L113.59,40.22c6.3-11,22.52-11,28.82,0l87.46,151.87C236,202.79,228.08,216,215.46,216Z"
                            opacity="0.2"
                        />
                        <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" />
                    </svg>
                );
            default:
                return (
                    <svg
                        strokeWidth="0"
                        viewBox="0 0 256 256"
                        role={"img"}
                        aria-hidden
                    >
                        <path
                            d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
                            opacity="0.2"
                        />
                        <path d="M144,176a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176Zm88-48A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128ZM124,96a12,12,0,1,0-12-12A12,12,0,0,0,124,96Z" />
                    </svg>
                );
        }
    }, [status]);
}
