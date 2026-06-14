import { defineSlotRecipe } from "@pandacss/dev";

export const fileUpload = defineSlotRecipe({
    className: "file-upload",
    description: "Dreamy UI FileUpload component",
    slots: [
        "root",
        "label",
        "dropzone",
        "dropzoneContent",
        "trigger",
        "item",
        "itemGroup",
        "itemName",
        "itemContent",
        "itemSizeText",
        "itemDeleteTrigger",
        "itemPreview",
        "itemPreviewImage",
        "fileText"
    ],
    jsx: [
        "FileUpload.Root",
        "FileUpload.Label",
        "FileUpload.Dropzone",
        "FileUpload.DropzoneContent",
        "FileUpload.Trigger",
        "FileUpload.Item",
        "FileUpload.ItemGroup",
        "FileUpload.ItemName",
        "FileUpload.ItemContent",
        "FileUpload.ItemSizeText",
        "FileUpload.ItemDeleteTrigger",
        "FileUpload.ItemPreview",
        "FileUpload.ItemPreviewImage",
        "FileUpload.FileText"
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            width: "100%",
            alignItems: "flex-start"
        },
        label: {
            fontWeight: "medium",
            fontSize: "sm"
        },
        dropzone: {
            // background: "bg",
            borderRadius: "l3",
            borderWidth: "2px",
            borderStyle: "dashed",
            borderColor: "{colors.border}",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "3",
            justifyContent: "center",
            minHeight: "2xs",
            px: "3",
            py: "6",
            width: "100%",
            cursor: "pointer",
            transitionDuration: "normal",
            transitionTimingFunction: "default",
            transitionProperty: "background, border-color",
            outline: "none",
            _hover: {
                bg: "{colors.alpha.50}"
            },
            "&[data-dragging]": {
                bg: "{colors.alpha.100}",
                borderStyle: "solid",
                borderColor: "{colors.primary}"
            },
            _focusVisible: {
                boxShadow: "0 0 0 1.5px {colors.primary}",
                borderColor: "{colors.primary}"
            },
            "&[data-disabled]": {
                opacity: 0.4,
                cursor: "not-allowed"
            }
        },
        dropzoneContent: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1",
            fontSize: "sm",
            color: "fg.medium"
        },
        trigger: {},
        item: {
            position: "relative",
            fontSize: "sm",
            animationName: "fadeIn",
            animationDuration: "0.2s",
            background: "bg",
            borderRadius: "l2",
            borderWidth: "1px",
            borderColor: "{colors.border}",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "3",
            p: "3"
        },
        itemGroup: {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "3"
        },
        itemName: {
            color: "fg",
            fontWeight: "medium",
            lineClamp: 1
        },
        itemContent: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5",
            flex: "1",
            minWidth: 0
        },
        itemSizeText: {
            color: "fg.medium",
            fontSize: "xs"
        },
        itemDeleteTrigger: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "flex-start",
            width: "5",
            height: "5",
            p: "2px",
            color: "fg.medium",
            cursor: "pointer",
            borderRadius: "l1",
            transitionDuration: "normal",
            transitionTimingFunction: "default",
            transitionProperty: "color, background",
            _hover: {
                color: "fg",
                bg: "{colors.alpha.100}"
            }
        },
        itemPreview: {
            color: "fg.medium",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& svg": {
                width: "4.5",
                height: "4.5"
            }
        },
        itemPreviewImage: {
            width: "10",
            height: "10",
            objectFit: "cover",
            borderRadius: "l1"
        },
        fileText: {
            fontSize: "sm",
            color: "fg",
            lineClamp: 1,
            "&[data-placeholder]": {
                color: "fg.medium"
            }
        }
    },
    variants: {},
    defaultVariants: {}
});
