import { compact, getSlotCompoundVariant, memo, splitProps } from '../helpers.js';
import { createRecipe } from './create-recipe.js';

const menuDefaultVariants = {
  "size": "md",
  "variant": "plain"
}
const menuCompoundVariants = []

const menuSlotNames = [
  [
    "root",
    "menu__root"
  ],
  [
    "content",
    "menu__content"
  ],
  [
    "item",
    "menu__item"
  ],
  [
    "control",
    "menu__control"
  ]
]
const menuSlotFns = /* @__PURE__ */ menuSlotNames.map(([slotName, slotKey]) => [slotName, createRecipe(slotKey, menuDefaultVariants, getSlotCompoundVariant(menuCompoundVariants, slotName))])

const menuFn = memo((props = {}) => {
  return Object.fromEntries(menuSlotFns.map(([slotName, slotFn]) => [slotName, slotFn.recipeFn(props)]))
})

const menuVariantKeys = [
  "variant",
  "size"
]
const getVariantProps = (variants) => ({ ...menuDefaultVariants, ...compact(variants) })

export const menu = /* @__PURE__ */ Object.assign(menuFn, {
  __recipe__: false,
  __name__: 'menu',
  raw: (props) => props,
  classNameMap: {},
  variantKeys: menuVariantKeys,
  variantMap: {
  "variant": [
    "plain",
    "stretched"
  ],
  "size": [
    "xs",
    "sm",
    "md",
    "lg"
  ]
},
  splitVariantProps(props) {
    return splitProps(props, menuVariantKeys)
  },
  getVariantProps
})