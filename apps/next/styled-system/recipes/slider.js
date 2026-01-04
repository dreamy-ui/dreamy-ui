import { compact, getSlotCompoundVariant, memo, splitProps } from '../helpers.js';
import { createRecipe } from './create-recipe.js';

const sliderDefaultVariants = {
  "scheme": "primary"
}
const sliderCompoundVariants = []

const sliderSlotNames = [
  [
    "root",
    "slider__root"
  ],
  [
    "track",
    "slider__track"
  ],
  [
    "trackFilled",
    "slider__trackFilled"
  ],
  [
    "thumb",
    "slider__thumb"
  ],
  [
    "marker",
    "slider__marker"
  ]
]
const sliderSlotFns = /* @__PURE__ */ sliderSlotNames.map(([slotName, slotKey]) => [slotName, createRecipe(slotKey, sliderDefaultVariants, getSlotCompoundVariant(sliderCompoundVariants, slotName))])

const sliderFn = memo((props = {}) => {
  return Object.fromEntries(sliderSlotFns.map(([slotName, slotFn]) => [slotName, slotFn.recipeFn(props)]))
})

const sliderVariantKeys = [
  "scheme"
]
const getVariantProps = (variants) => ({ ...sliderDefaultVariants, ...compact(variants) })

export const slider = /* @__PURE__ */ Object.assign(sliderFn, {
  __recipe__: false,
  __name__: 'slider',
  raw: (props) => props,
  classNameMap: {},
  variantKeys: sliderVariantKeys,
  variantMap: {
  "scheme": [
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
    "none"
  ]
},
  splitVariantProps(props) {
    return splitProps(props, sliderVariantKeys)
  },
  getVariantProps
})