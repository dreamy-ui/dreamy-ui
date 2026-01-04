import { compact, getSlotCompoundVariant, memo, splitProps } from '../helpers.js';
import { createRecipe } from './create-recipe.js';

const breadcrumbDefaultVariants = {
  "size": "md",
  "variant": "underline"
}
const breadcrumbCompoundVariants = []

const breadcrumbSlotNames = [
  [
    "root",
    "breadcrumb__root"
  ],
  [
    "list",
    "breadcrumb__list"
  ],
  [
    "item",
    "breadcrumb__item"
  ],
  [
    "link",
    "breadcrumb__link"
  ],
  [
    "currentLink",
    "breadcrumb__currentLink"
  ],
  [
    "separator",
    "breadcrumb__separator"
  ],
  [
    "ellipsis",
    "breadcrumb__ellipsis"
  ]
]
const breadcrumbSlotFns = /* @__PURE__ */ breadcrumbSlotNames.map(([slotName, slotKey]) => [slotName, createRecipe(slotKey, breadcrumbDefaultVariants, getSlotCompoundVariant(breadcrumbCompoundVariants, slotName))])

const breadcrumbFn = memo((props = {}) => {
  return Object.fromEntries(breadcrumbSlotFns.map(([slotName, slotFn]) => [slotName, slotFn.recipeFn(props)]))
})

const breadcrumbVariantKeys = [
  "size",
  "variant"
]
const getVariantProps = (variants) => ({ ...breadcrumbDefaultVariants, ...compact(variants) })

export const breadcrumb = /* @__PURE__ */ Object.assign(breadcrumbFn, {
  __recipe__: false,
  __name__: 'breadcrumb',
  raw: (props) => props,
  classNameMap: {},
  variantKeys: breadcrumbVariantKeys,
  variantMap: {
  "size": [
    "sm",
    "md",
    "lg"
  ],
  "variant": [
    "plain",
    "underline"
  ]
},
  splitVariantProps(props) {
    return splitProps(props, breadcrumbVariantKeys)
  },
  getVariantProps
})