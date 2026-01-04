import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const checkboxCardFn = /* @__PURE__ */ createRecipe('checkbox-card', {
  "size": "md",
  "checkboxVariant": "solid",
  "variant": "outline",
  "scheme": "primary"
}, [])

const checkboxCardVariantMap = {
  "size": [
    "sm",
    "md",
    "lg"
  ],
  "variant": [
    "outline",
    "subtle"
  ],
  "checkboxVariant": [
    "outline",
    "solid"
  ],
  "scheme": [
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
    "none"
  ]
}

const checkboxCardVariantKeys = Object.keys(checkboxCardVariantMap)

export const checkboxCard = /* @__PURE__ */ Object.assign(memo(checkboxCardFn.recipeFn), {
  __recipe__: true,
  __name__: 'checkboxCard',
  __getCompoundVariantCss__: checkboxCardFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: checkboxCardVariantKeys,
  variantMap: checkboxCardVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, checkboxCardVariantKeys)
  },
  getVariantProps: checkboxCardFn.getVariantProps,
})