import { cx } from "styled-system/css";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type ThemeVariantProps, theme } from "styled-system/recipes";

export interface ThemeProps extends HTMLDreamyProps<"div">, ThemeVariantProps {}

export interface DarkThemeProps extends ThemeProps {}

const StyledTheme = dreamy("div", theme);

/**
 * DarkTheme component — forces dark theme tokens for its children.
 *
 * @see Docs https://dreamy-ui.com/docs/components/theme
 *
 * @example
 * ```tsx
 * <DarkTheme>
 *   <Card.Root>Always dark</Card.Root>
 * </DarkTheme>
 * ```
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
 * LightTheme component — forces light theme tokens for its children.
 *
 * @see Docs https://dreamy-ui.com/docs/components/theme
 *
 * @example
 * ```tsx
 * <LightTheme>
 *   <Card.Root>Always light</Card.Root>
 * </LightTheme>
 * ```
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
