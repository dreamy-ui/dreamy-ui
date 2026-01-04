import { getPatternStyles, patternFns } from '../helpers.js';
import { css } from '../css/index.js';

const stackConfig = {
transform(props) {
  const { direction, gap, align, justify, ...rest } = props;
  return {
    display: "flex",
    flexDirection: direction === "horizontal" ? "row" : "column",
    alignItems: align,
    justifyContent: justify,
    gap,
    ...rest
  };
},
defaultValues:{gap:'8px',align:'center',direction:'vertical'}}

export const getStackStyle = (styles = {}) => {
  const _styles = getPatternStyles(stackConfig, styles)
  return stackConfig.transform(_styles, patternFns)
}

export const stack = (styles) => css(getStackStyle(styles))
stack.raw = getStackStyle