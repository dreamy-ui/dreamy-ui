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
import { DarkTheme } from "./theme";

const { withProvider, withContext } = createStyleContext(snippet);

const HeaderInner = withContext(dreamy.div, "headerInner");
const HeaderContent = withContext(dreamy.div, "headerContent");
const CopyTrigger = withContext(dreamy.button, "copy");
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
            height="16"
            viewBox="0 0 24 24"
            width="16"
            {...props}
        >
            <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM8.5 15.5 5 12l3.5-3.5 1.06 1.06L7.12 12l2.44 2.44-1.06 1.06Zm6.44-7L15 12l-2.44 2.44-1.06-1.06L12.88 12 10.44 9.56l1.06-1.06Z" />
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
                <CopyTrigger {...getCopyButtonProps({ disabled: disableCopy, type: "button" })}>
                    {copied ? clonedCheckIcon : clonedCopyIcon}
                </CopyTrigger>
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
