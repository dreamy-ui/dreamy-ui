import { defineParts } from "@dreamy-ui/panda-preset";
import { defineRecipe } from "@pandacss/dev";

const parts = defineParts({
    root: { selector: "&" },
    icon: { selector: "& [data-part='icon']" },
    title: { selector: "& [data-part='title']" },
    description: { selector: "& [data-part='description']" },
    container: { selector: "& [data-part='container']" },
    close: { selector: "& [data-part='close']" }
});

export { parts as toastParts };

export const toast = defineRecipe({
    className: "toast",
    description:
        "A transient toast notification with icon, title, description, and close button for brief feedback. Default styling uses panel background with blur, border, and shadow; status drives icon color — no recipe variant keys beyond size.",
    staticCss: ["*"],
    jsx: ["Toast"],
    base: parts({
        root: {
            position: "relative",
            listStyle: "none",
            w: "fit-content",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingX: 4,
            paddingY: 3,
            borderRadius: "l2",
            gap: 2,
            boxShadow: "md",
            zIndex: "toast",
            pointerEvents: "auto",
            translate: "var(--toast-swipe-x, 0px) var(--toast-swipe-y, 0px)",
            "[data-variant='default']&": {
                bg: "bg.panel",
                backdropFilter: "blur({blurs.base})",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "border"
            }
        },
        container: {
            display: "flex",
            flexDirection: "column",
            gap: 0.5
        },
        title: {
            fontWeight: "semibold",
            fontSize: "md",
            textWrap: "wrap",
            display: "flex",
            alignItems: "center",
            gap: 2,
            margin: 0,
            "[data-closable]&": {
                mr: 4
            }
        },
        description: {
            ml: 7,
            margin: 0
        },
        icon: {
            width: "5",
            height: "5",
            flexShrink: 0,
            "[data-status='success']&, [data-type='success']&": {
                color: "{colors.success}",
                fill: "{colors.success}",
                stroke: "{colors.success}"
            },
            "[data-status='warning']&, [data-type='warning']&": {
                color: "{colors.warning}",
                fill: "{colors.warning}"
            },
            "[data-status='error']&, [data-type='error']&": {
                color: "{colors.error}",
                fill: "{colors.error}"
            },
            "[data-status='info']&, [data-type='info']&": {
                color: "{colors.info}",
                fill: "{colors.info}",
                stroke: "{colors.info}"
            },
            "[data-status='loading']&, [data-type='loading']&": {
                color: "{colors.info}",
                fill: "{colors.info}",
                stroke: "{colors.info}"
            }
        },
        close: {
            position: "absolute",
            top: 1,
            right: 1
        }
    })
});
