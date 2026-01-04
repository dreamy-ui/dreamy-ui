import { compact, getSlotCompoundVariant, memo, splitProps } from '../helpers.js';
import { createRecipe } from './create-recipe.js';

const modalDefaultVariants = {
  "size": "md",
  "placement": "center"
}
const modalCompoundVariants = []

const modalSlotNames = [
  [
    "overlay",
    "modal__overlay"
  ],
  [
    "container",
    "modal__container"
  ],
  [
    "content",
    "modal__content"
  ],
  [
    "body",
    "modal__body"
  ],
  [
    "header",
    "modal__header"
  ],
  [
    "footer",
    "modal__footer"
  ],
  [
    "close",
    "modal__close"
  ]
]
const modalSlotFns = /* @__PURE__ */ modalSlotNames.map(([slotName, slotKey]) => [slotName, createRecipe(slotKey, modalDefaultVariants, getSlotCompoundVariant(modalCompoundVariants, slotName))])

const modalFn = memo((props = {}) => {
  return Object.fromEntries(modalSlotFns.map(([slotName, slotFn]) => [slotName, slotFn.recipeFn(props)]))
})

const modalVariantKeys = [
  "size",
  "placement"
]
const getVariantProps = (variants) => ({ ...modalDefaultVariants, ...compact(variants) })

export const modal = /* @__PURE__ */ Object.assign(modalFn, {
  __recipe__: false,
  __name__: 'modal',
  raw: (props) => props,
  classNameMap: {},
  variantKeys: modalVariantKeys,
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
    "8xl",
    "full"
  ],
  "placement": [
    "top",
    "center"
  ]
},
  splitVariantProps(props) {
    return splitProps(props, modalVariantKeys)
  },
  getVariantProps
})