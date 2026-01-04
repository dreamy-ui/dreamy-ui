import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const buttonFn = /* @__PURE__ */ createRecipe('button', {
  "variant": "solid",
  "size": "md"
}, [
  {
    "variant": [
      "outline"
    ],
    "scheme": [
      "error",
      "warning",
      "info",
      "success",
      "primary",
      "secondary"
    ],
    "css": {
      "color": "var(--button-scheme)",
      "borderColor": "var(--button-scheme)/16",
      "_hover": {
        "bg": "var(--button-scheme)/08",
        "borderColor": "var(--button-scheme)/16"
      }
    }
  },
  {
    "variant": [
      "ghost",
      "solid"
    ],
    "scheme": [
      "error",
      "warning",
      "info",
      "success",
      "primary",
      "secondary"
    ],
    "css": {
      "color": "var(--button-scheme)"
    }
  }
])

const buttonVariantMap = {
  "variant": [
    "primary",
    "secondary",
    "solid",
    "outline",
    "ghost",
    "link"
  ],
  "size": [
    "xs",
    "sm",
    "md",
    "lg"
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

const buttonVariantKeys = Object.keys(buttonVariantMap)

export const button = /* @__PURE__ */ Object.assign(memo(buttonFn.recipeFn), {
  __recipe__: true,
  __name__: 'button',
  __getCompoundVariantCss__: buttonFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: buttonVariantKeys,
  variantMap: buttonVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, buttonVariantKeys)
  },
  getVariantProps: buttonFn.getVariantProps,
})