import { alert } from "@/recipes/alert";
import { avatar, avatarParts } from "@/recipes/avatar";
import { badge } from "@/recipes/badge";
import { button, buttonParts } from "@/recipes/button";
import { checkboxCard, checkboxCardParts } from "@/recipes/checkbox-card";
import { divider } from "@/recipes/divider";
import { field } from "@/recipes/field";
import { flex } from "@/recipes/flex";
import { icon } from "@/recipes/icon";
import { image } from "@/recipes/image";
import { input } from "@/recipes/input";
import { kbd } from "@/recipes/kbd";
import { list } from "@/recipes/list";
import { modal } from "@/recipes/modal";
import { popover } from "@/recipes/popover";
import { progress } from "@/recipes/progress";
import { slider } from "@/recipes/slider";
import { spinner } from "@/recipes/spinner";
import { tabs } from "@/recipes/tabs";
import { text } from "@/recipes/text";
import { textarea } from "@/recipes/textarea";
import { tooltip } from "@/recipes/tooltip";
import { visuallyHidden } from "@/recipes/visually-hidden";
import { accordion } from "./accordion";
import { checkbox, checkboxParts } from "./checkbox";
import { snippet, snippetParts } from "./snippet";
import { table } from "./table";

export const recipes = {
    button,
    text,
    flex,
    icon,
    modal,
    input,
    textarea,
    avatar,
    tooltip,
    spinner,
    field,
    popover,
    divider,
    list,
    alert,
    image,
    tabs,
    progress,
    visuallyHidden,
    badge,
    kbd,
    slider,
    accordion,
    checkbox,
    checkboxCard,
    snippet,
    table
};

export const parts = {
    button: buttonParts,
    checkbox: checkboxParts,
    avatar: avatarParts,
    checkboxCard: checkboxCardParts,
    snippet: snippetParts
};