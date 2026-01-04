import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const themeFn = /* @__PURE__ */ createRecipe('theme', {}, [])

const themeVariantMap = {}

const themeVariantKeys = Object.keys(themeVariantMap)

export const theme = /* @__PURE__ */ Object.assign(memo(themeFn.recipeFn), {
  __recipe__: true,
  __name__: 'theme',
  __getCompoundVariantCss__: themeFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: themeVariantKeys,
  variantMap: themeVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, themeVariantKeys)
  },
  getVariantProps: themeFn.getVariantProps,
})