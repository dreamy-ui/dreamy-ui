import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const tooltipFn = /* @__PURE__ */ createRecipe('tooltip', {}, [])

const tooltipVariantMap = {}

const tooltipVariantKeys = Object.keys(tooltipVariantMap)

export const tooltip = /* @__PURE__ */ Object.assign(memo(tooltipFn.recipeFn), {
  __recipe__: true,
  __name__: 'tooltip',
  __getCompoundVariantCss__: tooltipFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: tooltipVariantKeys,
  variantMap: tooltipVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, tooltipVariantKeys)
  },
  getVariantProps: tooltipFn.getVariantProps,
})