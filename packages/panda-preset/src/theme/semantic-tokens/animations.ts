import { defineTokens } from "@pandacss/dev";

const animations = defineTokens.animations({
    "spinner-linear-spin": {
        value: "spinner-spin var(--spinner-speed, 0.8s) linear infinite"
    },
    "spinner-ease-spin": {
        value: "spinner-spin var(--spinner-speed, 0.8s) ease infinite"
    }
});

export default animations;
