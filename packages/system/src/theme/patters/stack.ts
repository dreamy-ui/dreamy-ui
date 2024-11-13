import { definePattern } from "@pandacss/dev";

export const stack = definePattern({
    jsx: ["Stack", "HStack", "VStack"],
    description: "stack pattern"
    // defaultValues: {
    //     direction: "row"
    // },
    // transform(props) {
    //     const { align, justify, direction, gap, ...rest } = props;
    //     return {
    //         display: "flex",
    //         flexDirection: direction,
    //         alignItems: align ,
    //         justifyContent: justify,
    //         gap,
    //         ...rest
    //     };
    // }
});
