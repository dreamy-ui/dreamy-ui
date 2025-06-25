import { forwardRef } from "react";
import { cx } from "styled-system/css";
import { type ThemeVariantProps, theme } from "styled-system/recipes";
import { type HTMLDreamyProps, dreamy } from "./factory";

export interface ThemeProps extends HTMLDreamyProps<"div">, ThemeVariantProps {}

export interface DarkThemeProps extends ThemeProps {}

const StyledTheme = dreamy("div", theme);

/**
 * Dark Theme component
 *
 * @See Docs https://dreamy-ui.com/docs/components/theme
 */
export const DarkTheme = forwardRef<HTMLDivElement, ThemeProps>((props, ref) => {
    return (
        <StyledTheme
            ref={ref}
            {...props}
            data-theme="dark"
            className={cx("dark", props.className)}
        />
    );
});

export interface LightThemeProps extends ThemeProps {}

/**
 * Light Theme component
 *
 * @See Docs https://dreamy-ui.com/docs/components/theme
 */
export const LightTheme = forwardRef<HTMLDivElement, ThemeProps>((props, ref) => {
    return (
        <StyledTheme
            ref={ref}
            {...props}
            data-theme="light"
            className={cx("light", props.className)}
        />
    );
});
