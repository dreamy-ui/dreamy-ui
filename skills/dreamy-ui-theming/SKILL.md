---
name: dreamy-ui-theming
description: >-
  Customize Dreamy UI theme via Panda CSS config and createDreamyPreset —
  colors, fonts, radii, semantic tokens, component recipes, and motion.
  Use when changing brand colors, dark mode, panda.config, presets, tokens,
  fonts, or component recipe overrides.
metadata:
  tags: dreamy-ui, theming, panda-css, tokens
---

# Dreamy UI — Theming

Customize Dreamy UI through **Panda CSS**. Styling customization lives in `panda.config.ts` and component recipes/patterns — not in ad-hoc CSS files.

For writing UI with existing tokens, see [dreamy-ui-frontend](../dreamy-ui-frontend/SKILL.md). For the library rule and MCP, see [dreamy-ui](../dreamy-ui/SKILL.md).

When this skill is not enough, call Dreamy UI MCP `list_docs` / `get_doc` (e.g. `theming/panda-preset`, `theming/tokens`, `theming/customization`).

---

## Panda config basics

Dreamy UI depends on Panda as a build-time CSS-in-JS engine. Extend the theme with `theme.extend`:

```ts
import createDreamyPreset, { dreamyPlugin } from "@dreamy-ui/panda-preset";
import { defineConfig } from "@pandacss/dev";
import { patterns } from "./components/patterns";
import { recipes } from "./components/recipes";

export default defineConfig({
  preflight: true,
  jsxFramework: "react",
  jsxStyleProps: "all",
  jsxFactory: "dreamy",
  outExtension: "js",
  include: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [createDreamyPreset()],
  plugins: [dreamyPlugin()],
  theme: {
    extend: {
      // tokens, semanticTokens, breakpoints, keyframes, …
    }
  },
  globalCss: { extend: {} },
  staticCss: { extend: {} }
});
```

After recipe/pattern/token changes, regenerate:

```bash
pnpm panda codegen
```

---

## `createDreamyPreset` options

Pass brand options into the preset (colors must be hex, rgb, or hsl):

| Option | Purpose |
|--------|---------|
| `backgrounds` | `{ light, dark }` app backgrounds |
| `fonts` | `{ body, heading, mono }` — if heading omitted, body is used |
| `primaryColor` | Brand primary (`string` or `{ light, dark }`) |
| `secondaryColor` | Brand secondary |
| `rounded` | Base radius token (`sm` / `md` / `lg` / …) → drives `l1`/`l2`/`l3` |
| `buttonPrimaryTextColor` | Text on primary (auto contrast if omitted) |
| `buttonSecondaryTextColor` | Text on secondary (auto contrast if omitted) |
| `colorTuning` | Fine-tune generated `fg` / `border` / `alpha` |

```ts
createDreamyPreset({
  backgrounds: { light: "#fff", dark: "#0D0D0E" },
  fonts: { body: "Geist", heading: "Manrope", mono: "JetBrains Mono" },
  primaryColor: { light: "#000000", dark: "#ffffff" },
  secondaryColor: { light: "#000000", dark: "#ffffff" },
  rounded: "md"
})
```

### Color generation & `colorTuning`

Foreground, border, and alpha tokens are generated from backgrounds. Tune with `colorTuning.fg`, `.border`, `.alpha` (chroma / lightness / hue). Prefer tuning over hardcoding when possible.

To **replace** generated colors, override `theme.extend.semanticTokens.colors` in panda config (e.g. custom `fg`, `border`).

---

## Extending the theme

Use `theme.extend` for anything beyond preset options:

- **Tokens** — `tokens.colors`, `spacing`, `sizes`, `radii`, …
- **Semantic tokens** — mode-aware colors/shadows
- **Breakpoints** — e.g. `"3xl": "1800px"`
- **Keyframes** — custom animations

Prefer semantic tokens for UI; add raw tokens only for new design primitives.

---

## Customizing components

CLI-added components ship with recipes/patterns under your project's `components/recipes` and `components/patterns`. Edit those files to change component visuals, then run `panda codegen`.

Do not put one-off brand colors on every JSX call site — change the preset / semantic tokens / recipe instead.

---

## Fonts

1. Load font files (`globalFontface` in panda config, or framework font loaders).
2. Point `createDreamyPreset({ fonts: { … } })` at those family names.

See docs: `get_doc` with `theming/fonts`.

---

## Motion (runtime)

Animations are configured on `DreamyProvider`, not Panda:

- `motionVariants` — per-component Motion `Variants` (all keys required; spread `defaultMotionVariants` to override a few)
- `defaultTransition` — global Motion transition
- Presets: `defaultMotionVariants`, `bouncyMotionVariants`, `bouncyDefaultTransition`

```tsx
import { DreamyProvider, defaultMotionVariants, type MotionVariants } from "@dreamy-ui/react";

const motionVariants: MotionVariants = {
  ...defaultMotionVariants,
  modal: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }
};

<DreamyProvider motionVariants={motionVariants}>{children}</DreamyProvider>
```

---

## Docs to pull via MCP

| Doc id | Topic |
|--------|--------|
| `theming/customization` | Panda extend, recipes, motion |
| `theming/panda-preset` | Preset options & colorTuning |
| `theming/tokens` | Full token reference |
| `theming/fonts` | Font setup |
| `theming/gotchas` | Common pitfalls |

Use `list_docs` then `get_doc` when you need full detail.
