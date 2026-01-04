import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const snippetFn = /* @__PURE__ */ createRecipe('snippet', {
  "variant": "solid",
  "scheme": "none",
  "size": "md"
}, [])

const snippetVariantMap = {
  "variant": [
    "solid",
    "bordered"
  ],
  "scheme": [
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
    "none"
  ],
  "size": [
    "sm",
    "md",
    "lg"
  ]
}

const snippetVariantKeys = Object.keys(snippetVariantMap)

export const snippet = /* @__PURE__ */ Object.assign(memo(snippetFn.recipeFn), {
  __recipe__: true,
  __name__: 'snippet',
  __getCompoundVariantCss__: snippetFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: snippetVariantKeys,
  variantMap: snippetVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, snippetVariantKeys)
  },
  getVariantProps: snippetFn.getVariantProps,
})