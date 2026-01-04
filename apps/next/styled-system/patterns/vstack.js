import { getPatternStyles, patternFns } from '../helpers.js';
import { css } from '../css/index.js';

const vstackConfig = {
transform(props) {
  const { justify, gap, align, ...rest } = props;
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: align,
    justifyContent: justify,
    gap,
    ...rest
  };
},
defaultValues:{gap:'8px',align:'start'}}

export const getVstackStyle = (styles = {}) => {
  const _styles = getPatternStyles(vstackConfig, styles)
  return vstackConfig.transform(_styles, patternFns)
}

export const vstack = (styles) => css(getVstackStyle(styles))
vstack.raw = getVstackStyle