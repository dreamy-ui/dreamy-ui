import { cx } from "styled-system/css";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type ThemeVariantProps, theme } from "styled-system/recipes";

export interface ThemeProps extends HTMLDreamyProps<"div">, ThemeVariantProps {}

export interface DarkThemeProps extends ThemeProps {}

const StyledTheme = dreamy("div", theme);

/**
 * Dark Theme component
 *
 * @See Docs https://dreamy-ui.com/docs/components/theme
 */
export function DarkTheme(props: ThemeProps) {
    return (
        <StyledTheme
            {...props}
            data-theme="dark"
            className={cx("dark", props.className)}
        />
    );
}

export interface LightThemeProps extends ThemeProps {}

/**
 * Light Theme component
 *
 * @See Docs https://dreamy-ui.com/docs/components/theme
 */
export function LightTheme(props: ThemeProps) {
    return (
        <StyledTheme
            {...props}
            data-theme="light"
            className={cx("light", props.className)}
        />
    );
}
