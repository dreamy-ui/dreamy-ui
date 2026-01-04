import { compact, getSlotCompoundVariant, memo, splitProps } from '../helpers.js';
import { createRecipe } from './create-recipe.js';

const tabsDefaultVariants = {
  "variant": "filled",
  "orientation": "horizontal"
}
const tabsCompoundVariants = [
  {
    "orientation": "vertical",
    "variant": "underline",
    "css": {
      "tabList": {
        "width": "fit-content",
        "overflow": "visible",
        "borderBottomWidth": 0,
        "borderRightWidth": "1px"
      },
      "tab": {
        "width": "100%",
        "justifyContent": "flex-start"
      },
      "tabIndicator": {
        "left": "auto",
        "height": "100%",
        "right": "-1px",
        "top": 0,
        "width": "2px"
      }
    }
  }
]

const tabsSlotNames = [
  [
    "root",
    "tabs__root"
  ],
  [
    "tabList",
    "tabs__tabList"
  ],
  [
    "tab",
    "tabs__tab"
  ],
  [
    "tabPanels",
    "tabs__tabPanels"
  ],
  [
    "tabPanel",
    "tabs__tabPanel"
  ],
  [
    "tabIndicator",
    "tabs__tabIndicator"
  ]
]
const tabsSlotFns = /* @__PURE__ */ tabsSlotNames.map(([slotName, slotKey]) => [slotName, createRecipe(slotKey, tabsDefaultVariants, getSlotCompoundVariant(tabsCompoundVariants, slotName))])

const tabsFn = memo((props = {}) => {
  return Object.fromEntries(tabsSlotFns.map(([slotName, slotFn]) => [slotName, slotFn.recipeFn(props)]))
})

const tabsVariantKeys = [
  "variant",
  "fitted",
  "orientation"
]
const getVariantProps = (variants) => ({ ...tabsDefaultVariants, ...compact(variants) })

export const tabs = /* @__PURE__ */ Object.assign(tabsFn, {
  __recipe__: false,
  __name__: 'tabs',
  raw: (props) => props,
  classNameMap: {},
  variantKeys: tabsVariantKeys,
  variantMap: {
  "variant": [
    "filled",
    "underline",
    "filled-simple"
  ],
  "fitted": [
    "true"
  ],
  "orientation": [
    "vertical",
    "horizontal"
  ]
},
  splitVariantProps(props) {
    return splitProps(props, tabsVariantKeys)
  },
  getVariantProps
})