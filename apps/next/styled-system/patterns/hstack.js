import { getPatternStyles, patternFns } from '../helpers.js';
import { css } from '../css/index.js';

const hstackConfig = {
transform(props) {
  const { justify, gap, align, ...rest } = props;
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: align,
    justifyContent: justify,
    gap,
    ...rest
  };
},
defaultValues:{gap:'8px',align:'center'}}

export const getHstackStyle = (styles = {}) => {
  const _styles = getPatternStyles(hstackConfig, styles)
  return hstackConfig.transform(_styles, patternFns)
}

export const hstack = (styles) => css(getHstackStyle(styles))
hstack.raw = getHstackStyle