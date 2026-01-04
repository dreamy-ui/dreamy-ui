import { compact, getSlotCompoundVariant, memo, splitProps } from '../helpers.js';
import { createRecipe } from './create-recipe.js';

const popoverDefaultVariants = {
  "size": "md"
}
const popoverCompoundVariants = []

const popoverSlotNames = [
  [
    "content",
    "popover__content"
  ],
  [
    "body",
    "popover__body"
  ],
  [
    "header",
    "popover__header"
  ],
  [
    "footer",
    "popover__footer"
  ],
  [
    "close",
    "popover__close"
  ]
]
const popoverSlotFns = /* @__PURE__ */ popoverSlotNames.map(([slotName, slotKey]) => [slotName, createRecipe(slotKey, popoverDefaultVariants, getSlotCompoundVariant(popoverCompoundVariants, slotName))])

const popoverFn = memo((props = {}) => {
  return Object.fromEntries(popoverSlotFns.map(([slotName, slotFn]) => [slotName, slotFn.recipeFn(props)]))
})

const popoverVariantKeys = [
  "size"
]
const getVariantProps = (variants) => ({ ...popoverDefaultVariants, ...compact(variants) })

export const popover = /* @__PURE__ */ Object.assign(popoverFn, {
  __recipe__: false,
  __name__: 'popover',
  raw: (props) => props,
  classNameMap: {},
  variantKeys: popoverVariantKeys,
  variantMap: {
  "size": [
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
    "7xl",
    "8xl"
  ]
},
  splitVariantProps(props) {
    return splitProps(props, popoverVariantKeys)
  },
  getVariantProps
})