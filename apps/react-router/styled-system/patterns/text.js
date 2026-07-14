import { getPatternStyles, patternFns } from '../helpers.js';
import { css } from '../css/index.js';

const textConfig = {
transform(props, { map }) {
  const { variant, size, ...rest } = props;
  return {
    textStyle: size ?? map(variant, (v2) => v2 === "heading" ? "xl" : void 0),
    fontWeight: map(
      variant,
      (v2) => v2 === "heading" ? "bold" : v2 === "link" ? "semibold" : void 0
    ),
    fontFamily: map(variant, (v2) => v2 === "heading" ? "heading" : void 0),
    transition: map(variant, (v2) => v2 === "link" ? "colors" : void 0),
    _hover: map(
      variant,
      (v2) => v2 === "link" ? { color: "{colors.fg.max}" } : void 0
    ),
    ...rest
  };
}}

export const getTextStyle = (styles = {}) => {
  const _styles = getPatternStyles(textConfig, styles)
  return textConfig.transform(_styles, patternFns)
}

export const text = (styles) => css(getTextStyle(styles))
text.raw = getTextStyle