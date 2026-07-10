"use client";

import {
    SnippetProvider,
    type UseSnippetBodyProps,
    type UseSnippetRootProps,
    useSnippetBody,
    useSnippetHeader,
    useSnippetRoot
} from "@dreamy-ui/react";
import { type SVGProps, cloneElement } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type SnippetVariantProps, snippet } from "styled-system/recipes";
import { IconButton, type IconButtonProps } from "./icon-button";
import { DarkTheme } from "./theme";

const { withProvider, withContext } = createStyleContext(snippet);

const HeaderInner = withContext(dreamy.div, "headerInner");
const HeaderContent = withContext(dreamy.div, "headerContent");
const CopyTrigger = withContext(function SnippetCopyTrigger(props: Partial<IconButtonProps>) {
    return (
        <IconButton
            disableRipple
            variant="link"
            size="sm"
            aria-label="Copy to clipboard"
            {...props}
        />
    );
}, "copy");
const Pre = withContext(dreamy.pre, "pre");

const HeaderIcon = withContext(function SnippetHeaderIcon({
    as: AsComponent,
    ...props
}: HTMLDreamyProps<"svg"> & { as?: React.ElementType }) {
    const IconComponent = AsComponent ?? TerminalIcon;
    return <IconComponent {...props} />;
}, "headerIcon");

function TerminalIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            fill="currentColor"
            height="1em"
            stroke="currentColor"
            strokeWidth="0"
            viewBox="0 0 640 512"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M257.981 272.971L63.638 467.314c-9.373 9.373-24.569 9.373-33.941 0L7.029 444.647c-9.357-9.357-9.375-24.522-.04-33.901L161.011 256 6.99 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L257.981 239.03c9.373 9.372 9.373 24.568 0 33.941zM640 456v-32c0-13.255-10.745-24-24-24H312c-13.255 0-24 10.745-24 24v32c0 13.255 10.745 24 24 24h304c13.255 0 24-10.745 24-24z" />
        </svg>
    );
}

export interface SnippetRootProps
    extends UseSnippetRootProps,
        Omit<HTMLDreamyProps<"div">, keyof UseSnippetRootProps>,
        SnippetVariantProps {}

/**
 * Snippet component
 *
 * @See Docs https://dreamy-ui.com/docs/components/snippet
 */
export const Root = withProvider(function SnippetRoot(props: SnippetRootProps) {
    const { children, timeout, disableCopy, onCopy, ...rest } = props;
    const { context, getRootProps } = useSnippetRoot({ timeout, disableCopy, onCopy });

    return (
        <SnippetProvider value={context}>
            <dreamy.div {...getRootProps(rest)}>
                <DarkTheme full>{children}</DarkTheme>
            </dreamy.div>
        </SnippetProvider>
    );
}, "root");

export interface SnippetHeaderProps extends Omit<HTMLDreamyProps<"div">, "children"> {
    /**
     * The icon displayed at the start of the header.
     */
    icon?: React.ElementType;
    /**
     * Whether to hide the default copy button.
     * @default false
     */
    hideCopyButton?: boolean;
    /**
     * Snippet copy icon.
     */
    copyIcon?: React.ReactElement;
    /**
     * Snippet check icon shown after copying.
     */
    checkIcon?: React.ReactElement;
    children?: React.ReactNode;
}

export const Header = withContext(function SnippetHeader(props: SnippetHeaderProps) {
    const {
        icon: IconComponent = TerminalIcon,
        hideCopyButton = false,
        copyIcon = <CopyIcon />,
        checkIcon = <CheckIcon />,
        children,
        ...rest
    } = props;

    const { copied, disableCopy, getHeaderProps, getCopyButtonProps } = useSnippetHeader();

    const clonedCheckIcon = checkIcon && cloneElement(checkIcon, { "data-part": "check-icon" });
    const clonedCopyIcon = copyIcon && cloneElement(copyIcon, { "data-part": "copy-icon" });

    return (
        <dreamy.div {...getHeaderProps(rest)}>
            <HeaderInner>
                <HeaderIcon as={IconComponent} />
                <HeaderContent>{children}</HeaderContent>
            </HeaderInner>

            {!hideCopyButton && (
                <CopyTrigger
                    icon={copied ? clonedCheckIcon : clonedCopyIcon}
                    {...getCopyButtonProps({ isDisabled: disableCopy })}
                />
            )}
        </dreamy.div>
    );
}, "header");

export interface SnippetBodyProps
    extends UseSnippetBodyProps,
        Omit<HTMLDreamyProps<"div">, keyof UseSnippetBodyProps> {}

export const Body = withContext(function SnippetBody(props: SnippetBodyProps) {
    const { children, codeString, ...rest } = props;
    const { children: bodyChildren, getBodyProps, getPreProps } = useSnippetBody({
        children,
        codeString
    });

    return (
        <dreamy.div {...getBodyProps(rest)}>
            <Pre {...getPreProps()}>
                <code>{bodyChildren}</code>
            </Pre>
        </dreamy.div>
    );
}, "body");

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            {...props}
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect
                height="14"
                rx="2"
                ry="2"
                width="14"
                x="8"
                y="8"
            />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
    );
}

export { useSnippetContext } from "@dreamy-ui/react";
