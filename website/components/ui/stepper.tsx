"use client";

import {
    StepperProvider,
    callAllHandlers,
    type UseStepperProps,
    type UseStepperReturn,
    useStepper,
    useStepperContext
} from "@dreamy-ui/react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import type { StepperVariantProps } from "styled-system/recipes";
import { stepper } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(stepper);

export interface StepperRootProps
    extends UseStepperProps,
        Omit<HTMLDreamyProps<"div">, "id">,
        StepperVariantProps {}

/**
 * Stepper component — multi-step process indicator and navigation.
 *
 * @see Docs https://dreamy-ui.com/docs/components/stepper
 *
 * @example
 * ```tsx
 * <Stepper.Root count={3}>
 *   <Stepper.List>
 *     <Stepper.Item>
 *       <Stepper.Trigger>
 *         <Stepper.Indicator />
 *         <Stepper.Title>Step 1</Stepper.Title>
 *       </Stepper.Trigger>
 *     </Stepper.Item>
 *   </Stepper.List>
 * </Stepper.Root>
 * ```
 */
export const Root = withProvider(function StepperRoot(props: StepperRootProps) {
    const {
        count,
        defaultStep,
        step,
        onStepChange,
        orientation = "horizontal",
        id,
        children,
        ...rest
    } = props;

    const ctx = useStepper({
        count,
        defaultStep,
        step,
        onStepChange,
        orientation,
        id
    });

    return (
        <StepperProvider value={ctx}>
            <dreamy.div
                {...ctx.getRootProps()}
                {...rest}
            >
                {children}
            </dreamy.div>
        </StepperProvider>
    );
}, "root");

export interface StepperListProps extends HTMLDreamyProps<"ol"> {}

/**
 * Stepper List — ordered list of step items.
 */
export const List = withContext(function StepperList(props: StepperListProps) {
    const { getListProps } = useStepperContext();

    return (
        <dreamy.ol
            {...getListProps()}
            {...props}
        />
    );
}, "list");

export interface StepperItemProps extends Omit<HTMLDreamyProps<"li">, "title"> {
    index: number;
}

/**
 * Stepper Item — a single step in the sequence.
 */
export const Item = withContext(function StepperItem(props: StepperItemProps) {
    const { index, children, ...rest } = props;
    const { getItemProps } = useStepperContext();

    return (
        <dreamy.li
            {...getItemProps(index)}
            {...rest}
        >
            {children}
        </dreamy.li>
    );
}, "item");

export interface StepperTriggerProps extends HTMLDreamyProps<"div"> {
    index: number;
}

/**
 * Stepper Trigger — interactive area for a step.
 */
export const Trigger = withContext(function StepperTrigger(props: StepperTriggerProps) {
    const { index, children, ...rest } = props;
    const { getTriggerProps } = useStepperContext();

    return (
        <dreamy.div
            {...getTriggerProps(index)}
            {...rest}
        >
            {children}
        </dreamy.div>
    );
}, "trigger");

export interface StepperIndicatorProps extends HTMLDreamyProps<"div"> {
    index: number;
    /**
     * Custom icon to show in the indicator for all states.
     * When provided, overrides the default number and check icon.
     */
    icon?: React.ReactNode;
}

/**
 * Stepper Indicator — visual marker for step progress.
 */
export const Indicator = withContext(function StepperIndicator(props: StepperIndicatorProps) {
    const { index, icon, children, ...rest } = props;
    const { getIndicatorProps, step } = useStepperContext();

    function renderContent() {
        if (children) return children;
        if (icon) return icon;
        if (index < step) return <CheckIcon />;
        return index + 1;
    }

    return (
        <dreamy.div
            {...getIndicatorProps(index)}
            {...rest}
        >
            {renderContent()}
        </dreamy.div>
    );
}, "indicator");

export interface StepperTitleProps extends HTMLDreamyProps<"p"> {}

/**
 * Stepper Title — label for a step.
 */
export const Title = withContext(function StepperTitle(props: StepperTitleProps) {
    return <dreamy.p {...props} />;
}, "title");

export interface StepperDescriptionProps extends HTMLDreamyProps<"p"> {}

/**
 * Stepper Description — supporting text for a step.
 */
export const Description = withContext(function StepperDescription(props: StepperDescriptionProps) {
    return <dreamy.p {...props} />;
}, "description");

export interface StepperSeparatorProps extends HTMLDreamyProps<"div"> {
    index: number;
}

/**
 * Stepper Separator — connector between steps.
 */
export const Separator = withContext(function StepperSeparator(props: StepperSeparatorProps) {
    const { index, ...rest } = props;
    const { getSeparatorProps } = useStepperContext();

    return (
        <dreamy.div
            {...getSeparatorProps(index)}
            {...rest}
        />
    );
}, "separator");

export interface StepperContentProps extends HTMLDreamyProps<"div"> {
    index: number;
}

/**
 * Stepper Content — panel shown for the active step.
 */
export const Content = withContext(function StepperContent(props: StepperContentProps) {
    const { index, ...rest } = props;
    const { getContentProps } = useStepperContext();

    return (
        <dreamy.div
            {...getContentProps(index)}
            {...rest}
        />
    );
}, "content");

export interface StepperCompletedContentProps extends HTMLDreamyProps<"div"> {}

/**
 * Stepper Completed Content — content shown after all steps finish.
 */
export const CompletedContent = withContext(function StepperCompletedContent(
    props: StepperCompletedContentProps
) {
    const { isComplete } = useStepperContext();

    if (!isComplete) return null;

    return <dreamy.div {...props} />;
}, "completedContent");

const NextTriggerSlot = withContext(dreamy.button, "nextTrigger");
const PrevTriggerSlot = withContext(dreamy.button, "prevTrigger");

export interface StepperNextTriggerProps extends HTMLDreamyProps<"button"> {}

/**
 * Stepper Next Trigger — advances to the next step.
 * Use `asChild` to render your own element (e.g. a `Button`) as the trigger.
 */
export function NextTrigger(props: StepperNextTriggerProps) {
    const { onClick, ...rest } = props;
    const { getNextTriggerProps } = useStepperContext();
    const triggerProps = getNextTriggerProps();

    return (
        <NextTriggerSlot
            {...triggerProps}
            {...rest}
            onClick={callAllHandlers(onClick, triggerProps.onClick)}
        />
    );
}

export interface StepperPrevTriggerProps extends HTMLDreamyProps<"button"> {}

/**
 * Stepper Prev Trigger — returns to the previous step.
 * Use `asChild` to render your own element (e.g. a `Button`) as the trigger.
 */
export function PrevTrigger(props: StepperPrevTriggerProps) {
    const { onClick, ...rest } = props;
    const { getPrevTriggerProps } = useStepperContext();
    const triggerProps = getPrevTriggerProps();

    return (
        <PrevTriggerSlot
            {...triggerProps}
            {...rest}
            onClick={callAllHandlers(onClick, triggerProps.onClick)}
        />
    );
}

export interface StepperContextProps {
    children: (ctx: UseStepperReturn) => React.ReactNode;
}

/**
 * Stepper Context — render-prop access to stepper state.
 */
export function Context({ children }: StepperContextProps) {
    const ctx = useStepperContext();
    return <>{children(ctx)}</>;
}

function CheckIcon() {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="1em"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}
