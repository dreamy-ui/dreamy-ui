import { Box, type BoxProps } from "@/components/box/box";
import { type SpinnerVariantProps, spinner } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";
import { dreamy } from "../factory";

export interface SpinnerProps extends BoxProps, SpinnerVariantProps {
    /**
     * Speed of the spinner animation
     */
    speed?: `${number}s` | `${number}ms`;
    /**
     * The label of the spinner
     */
    label?: string;
    /**
     * Props to be forwarded to the label
     * Alternatively, you can use `css` prop in the `Spinner` component
     * to style the label like:
     * ```ts
     * <Spinner
     *   label={"Loading"}
     *   css={{
     *     "& [data-part=label]": {
     *       color: "fg"
     *     }
     *   }}
     * />
     * ```
     */
    labelProps?: BoxProps;
}

const StyledSpinner = dreamy("div", spinner);

/**
 * Spinner indicates a loading state for a user.
 *
 * @See Docs https://dream-ui.com/docs/components/spinner
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>((props, ref) => {
    const { label, labelProps, speed, style, ...rest } = props;

    return (
        <StyledSpinner
            ref={ref}
            {...rest}
            data-part="root"
            style={{
                // @ts-expect-error
                "--spinner-speed": speed,
                ...style
            }}
        >
            <div data-part="wrapper">
                <i data-part="circle1" />
                <i data-part="circle2" />
            </div>
            {label && (
                <Box
                    as={"span"}
                    {...labelProps}
                    data-part="label"
                >
                    {label}
                </Box>
            )}
        </StyledSpinner>
    );
});

Spinner.displayName = "Spinner";
