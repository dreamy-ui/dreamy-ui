import { Box } from "@/components/box/box";
import { Text, type TextProps } from "@/components/text";
import { createContext } from "@/provider/create-context";
import { dataAttr } from "@/utils/attr";
import { type ElementType, forwardRef, useMemo } from "react";
import { type RadioCardVariantProps, radioCard } from "styled-system/recipes";
import { dreamy } from "../factory";
import { VisuallyHiddenInput } from "../visually-hidden";
import { type UseRadioProps, useRadio } from "./use-radio";

export const [RadioProvider, useRadioCardContext] = createContext<UseRadioProps>({
    strict: false
});

export interface RadioCardProps
    extends Omit<UseRadioProps, "children" | "title">,
        RadioCardVariantProps {
    /**
     * The title of the radio card
     */
    title?: React.ReactNode;
    /**
     * The description of the radio card
     */
    description?: React.ReactNode;
    /**
     * The tag of the title
     */
    titleTag?: ElementType;
    /**
     * The props of the title
     */
    titleProps?: TextProps;
    /**
     * The props of the description
     */
    descriptionProps?: TextProps;
    /**
     * Should hide the radio indicator
     */
    hideRadio?: boolean;
}

const StyledRadio = dreamy("div", radioCard);

/**
 * RadioCard component
 *
 * @See Docs https://dreamy-ui.com/docs/components/radio-card
 */
export const RadioCard = forwardRef<HTMLInputElement, RadioCardProps>((props, ref) => {
    const {
        title,
        description,
        titleTag = "p",
        titleProps,
        descriptionProps,
        hideRadio,
        ...rest
    } = props;
    const {
        children,
        isChecked,
        isDisabled,
        isInvalid,
        getRootProps,
        getWrapperProps,
        getInputProps,
        getControlProps,
        getLabelProps
    } = useRadio({ ...rest, isCard: true, ref });

    const ctx = useMemo(() => {
        return {
            children,
            isChecked,
            isDisabled,
            isInvalid,
            getRootProps,
            getWrapperProps,
            getInputProps,
            getControlProps,
            getLabelProps
        };
    }, [
        children,
        isChecked,
        isDisabled,
        isInvalid,
        getRootProps,
        getWrapperProps,
        getInputProps,
        getControlProps,
        getLabelProps
    ]);

    return (
        <RadioProvider value={ctx}>
            <StyledRadio
                {...(getRootProps() as any)}
                data-center={dataAttr(!description)}
            >
                <Box data-part={"header"}>
                    <Text
                        as={titleTag}
                        data-part={"title"}
                        {...titleProps}
                    >
                        {title}
                    </Text>
                    <VisuallyHiddenInput {...(getInputProps() as any)} />
                    {!hideRadio && (
                        <Box data-part={"radio-root"}>
                            <span {...getWrapperProps()}>
                                <span {...getControlProps()} />
                            </span>
                        </Box>
                    )}
                </Box>
                {description && (
                    <Text
                        data-part={"description"}
                        {...descriptionProps}
                    >
                        {description}
                    </Text>
                )}
            </StyledRadio>
        </RadioProvider>
    );
});

RadioCard.displayName = "RadioCard";
