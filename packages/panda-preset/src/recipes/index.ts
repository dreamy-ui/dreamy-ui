import { alert } from "@/recipes/alert";
import { avatar, avatarParts } from "@/recipes/avatar";
import { badge } from "@/recipes/badge";
import { button, buttonParts } from "@/recipes/button";
import { checkboxCard, checkboxCardParts } from "@/recipes/checkbox-card";
import { field, fieldParts } from "@/recipes/field";
import { icon } from "@/recipes/icon";
import { image, imageParts } from "@/recipes/image";
import { input } from "@/recipes/input";
import { kbd } from "@/recipes/kbd";
import { list } from "@/recipes/list";
import { modal } from "@/recipes/modal";
import { popover } from "@/recipes/popover";
import { progress, progressParts } from "@/recipes/progress";
import { radio, radioParts } from "@/recipes/radio";
import { select } from "@/recipes/select";
import { skeleton, skeletonParts } from "@/recipes/skeleton";
import { slider } from "@/recipes/slider";
import { spinner } from "@/recipes/spinner";
import { tabs } from "@/recipes/tabs";
import { textarea } from "@/recipes/textarea";
import { tooltip, tooltipParts } from "@/recipes/tooltip";
import { accordion } from "./accordion";
import { checkbox, checkboxParts } from "./checkbox";
import { editable } from "./editable";
import { group } from "./group";
import { menu } from "./menu";
import { progressCircular, progressCircularParts } from "./progress-circular";
import { snippet, snippetParts } from "./snippet";
import { switchParts, switchRecipe } from "./switch";
import { table } from "./table";
import { theme } from "./theme";
import { toast, toastParts } from "./toast";

export const recipes = {
    button,
    icon,
    modal,
    input,
    textarea,
    avatar,
    tooltip,
    spinner,
    field,
    popover,
    list,
    alert,
    image,
    tabs,
    progress,
    badge,
    kbd,
    slider,
    accordion,
    checkbox,
    checkboxCard,
    snippet,
    table,
    skeleton,
    radio,
    select,
    switchRecipe,
    menu,
    toast,
    editable,
    theme,
    group,
    progressCircular
};

export const parts = {
    button: buttonParts,
    checkbox: checkboxParts,
    field: fieldParts,
    image: imageParts,
    avatar: avatarParts,
    checkboxCard: checkboxCardParts,
    snippet: snippetParts,
    radio: radioParts,
    progressCircular: progressCircularParts,
    progress: progressParts,
    skeleton: skeletonParts,
    switch: switchParts,
    toast: toastParts,
    tooltip: tooltipParts
};
