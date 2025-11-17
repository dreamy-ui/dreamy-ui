import { getPatternStyles, patternFns } from '../helpers.js';
import { css } from '../css/index.js';

const dividerConfig = {
transform(props, { map }) {
  const { orientation, thickness, color, backgroundColor, background, bg, ...rest } = props;
  return {
    "--thickness": thickness,
    width: map(orientation, (v) => v === "vertical" ? void 0 : "100%"),
    height: map(orientation, (v) => v === "horizontal" ? void 0 : "100%"),
    borderTop: "none",
    borderBlockEndWidth: map(
      orientation,
      (v) => v === "horizontal" ? "var(--thickness)" : void 0
    ),
    borderInlineStartWidth: map(
      orientation,
      (v) => v === "vertical" ? "var(--thickness)" : void 0
    ),
    borderColor: color ?? backgroundColor ?? background ?? bg,
    ...rest
  };
},
defaultValues:{orientation:'horizontal',thickness:'1px',color:'alpha.300'}}

export const getDividerStyle = (styles = {}) => {
  const _styles = getPatternStyles(dividerConfig, styles)
  return dividerConfig.transform(_styles, patternFns)
}

export const divider = (styles) => css(getDividerStyle(styles))
divider.raw = getDividerStyle