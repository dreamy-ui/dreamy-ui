---
name: dreamy-ui-monorepo
description: Navigate and edit the Dreamy UI monorepo correctly — registry source in components/, logic in @dreamy-ui/react, generated output in website/components/. Use when working on Dreamy UI components, recipes, patterns, hooks, CLI, or website docs in this repository. Covers creating new components, changing existing ones, and automatically updating Storybook and website documentation.
---

# Dreamy UI Monorepo

## Overview

This is a pnpm + Turbo monorepo. UI is split across **source registry**, **published logic**, and a **generated website copy**.

```
dreamy-ui/
├── components/          # SOURCE — edit Dreamy UI components here
│   ├── ui/              # Component implementations (.tsx)
│   ├── recipes/         # Panda CSS recipes (styling)
│   └── patterns/        # Panda CSS patterns (layout primitives)
├── packages/
│   ├── react/           # @dreamy-ui/react — hooks & headless logic
│   ├── cli/             # @dreamy-ui/cli — `dreamy` CLI
│   ├── panda-preset/    # @dreamy-ui/panda-preset — design tokens & preset
│   └── mcp/             # @dreamy-ui/mcp — MCP server for component metadata
└── website/             # Documentation & demo site (React Router v7)
    ├── app/             # Routes, docs, playground — safe to edit
    ├── docs/            # MDX documentation source
    ├── stories/         # Storybook stories
    ├── components/      # GENERATED — never edit
    ├── recipes/         # GENERATED — never edit
    ├── patterns/        # GENERATED — never edit
    └── public/          # Registry JSON — written by components build script
```

## Code quality bar

Dreamy UI is a **component library used by many developers**. Every change must meet this bar:

- **Performant** — avoid unnecessary re-renders, memoize only when it matters, use stable refs/callbacks, prefer CSS over JS for visual state, lazy-load heavy sub-trees. No slow patterns in hot paths.
- **Bug-free & accessible** — correct ARIA, keyboard navigation, focus management, form integration. Handle edge cases (disabled, loading, controlled/uncontrolled, SSR/RSC).
- **Ultra-readable** — clear names, small focused functions, JSDoc on public props. Other developers will read and copy this code.
- **Clean separation** — component files contain **composition and rendering only**. State, a11y, DOM behavior, and utilities live in `@dreamy-ui/react`.

**Component file rule:** `components/ui/<name>.tsx` should mostly be top-level components that call hooks from `@dreamy-ui/react` and apply recipes/patterns. Move helpers, formatters, and non-UI logic into `packages/react/src/`.

**No Panda styling in component files:** `components/ui/<name>.tsx` must **not** use Panda style props (`px`, `color`, `fontWeight`, `display`, `variant`, `size`, etc.) or layout pattern props for component-specific visuals. All visual styling belongs in `components/recipes/<name>.ts` or `components/patterns/<name>.ts`. Component files wire structure, behavior, and `createStyleContext` slots only. For conditional visuals, use `data-*` attributes (e.g. `data-selected`, `data-hidden`) and target them in the recipe with `&[data-selected=true]`.

```tsx
// ✅ Recipe handles styles
option: {
  color: "fg.medium",
  "&[data-selected=true]": { color: "fg" }
}

// ✅ Component sets state only
<OptionButton data-selected={dataAttr(isSelected)} type="button" />

// ❌ Do not put Panda props on component elements
<Button color="fg" px={2} variant="link" />
```

Use `withContext(dreamy.button, "option")` (or `dreamy.div`, etc.) for slot elements — not `Button`, `Flex`, or other styled components with their own recipes unless that component is intentionally reused as-is.

---

## Package roles

| Location | Package | Purpose |
|----------|---------|---------|
| `packages/react` | `@dreamy-ui/react` | Headless hooks and logic (`useSelect`, `useModal`, etc.). Components import from here. |
| `components/` | `@dreamy-ui/registry` | Raw Dreamy UI component source (UI + recipes + patterns). **Only place to edit component markup, styles, and recipes.** |
| `packages/cli` | `@dreamy-ui/cli` | Reads registry JSON and writes generated files into consumer projects (including `website/components/`). |
| `website/` | `dreamy-ui-website` | Docs site. Imports components via `@/ui` → `website/components/ui/`. |

## Recipes vs patterns

| | Recipe | Pattern |
|---|--------|---------|
| **Use for** | Interactive / themed UI (Button, Select, Modal) | Layout primitives (Flex, Stack, Grid) |
| **Panda API** | `defineRecipe` or `defineSlotRecipe` | `definePattern` |
| **Has variants/sizes?** | Yes | No |
| **File** | `components/recipes/<name>.ts` | `components/patterns/<name>.ts` |
| **Import in UI** | `styled-system/recipes` | `styled-system/patterns` |

**Compound components** (e.g. `Select.Root`, `Select.Trigger`) use `defineSlotRecipe` with slots mapped to sub-components. Check `select.ts` / `select.tsx` as the reference.

**Layout-only components** (e.g. Flex) use a pattern, not a recipe. Check `flex.ts` / `flex.tsx`.

---

## Registry pipeline

Raw source in `components/` is **not** used directly by the website. It flows through a build + CLI sync:

```
components/ui|recipes|patterns
        │
        ▼  pnpm components  (or components:watch)
website/public/components|recipes|patterns/*.json
        │
        ▼  pnpm dreamy add (triggered by watch script)
website/components/ui|recipes|patterns
```

1. **`pnpm components`** — one-shot: serializes `components/` into JSON under `website/public/`.
2. **`pnpm components:watch`** — watches `components/`, re-runs the build on change, then runs `pnpm dreamy add` in `website/` to regenerate `website/components/`, `website/recipes/`, and `website/patterns/`.

The watch script expects the website dev server on `localhost:3000` (`pnpm dev`).

### Do NOT edit (generated)

- `website/components/` — generated by `dreamy add`
- `website/recipes/` — generated
- `website/patterns/` — generated
- `website/public/components|recipes|patterns/*.json` — generated by the registry build script

---

## Changing an existing component

When the user asks to add a variant, size, prop, behavior, or fix a component — treat it as a **full deliverable**, not just a source edit.

### Files to edit

| What changed | Edit |
|--------------|------|
| Markup, composition, visual structure | `components/ui/<name>.tsx` |
| Variants, sizes, colors, slots | `components/recipes/<name>.ts` (or pattern in `components/patterns/`) |
| State, a11y, keyboard, controlled logic | `packages/react/src/components/<name>/use-<name>.ts` |
| Shared utilities | `packages/react/src/utils/` or `packages/react/src/hooks/` |
| New hook exports | `packages/react/src/components/<name>/index.ts` + `packages/react/src/components/index.ts` |

**Only edit the main component file, its recipe/pattern, and logic in `@dreamy-ui/react`.** Do not scatter changes across unrelated files.

### Workflow

1. **Read similar components first** — find the closest existing component and mirror its patterns (compound API, recipe structure, hook shape, prop naming).
2. **Edit source** — component + recipe/pattern + hook as needed.
3. **Update Storybook automatically** — `website/stories/<name>.stories.tsx`. Add/update stories for every new variant, size, color scheme, or feature. **Do this without the user asking.**
4. **Update docs automatically** — `website/docs/5.components/<name>.mdx`. Add sections, live `<Wrapper>` demos, and code snippets for every new API surface. **Do this without the user asking.**
5. **Update interactive demos if needed** — for complex components, add demos in `website/app/src/ui/docs/components/<plural>.tsx` and register them in `website/app/src/ui/docs/MDXContent.tsx`.
6. Remind the developer to run `pnpm components:watch` + `pnpm dev` if changes are not visible — **do not** manually copy into `website/components/` or run `dreamy add` yourself.

### Storybook conventions

- Path: `website/stories/<kebab-name>.stories.tsx`
- Import from `@/ui`
- Export named story functions (`Base`, `Variants`, `Sizes`, `Color`, etc.)
- Cover every variant, size, and meaningful prop combination
- Use `Flex` / `Group` for layout in stories

### Documentation conventions

- Path: `website/docs/5.components/<kebab-name>.mdx`
- Frontmatter: `title`, `description`, `isServerComponent`, `source`, `themeSource`
- Structure: Installation (`pnpm dreamy add <name>`) → Usage → subsections per feature
- Each subsection: description → `<Wrapper>` live demo → fenced `tsx` code block
- Complex demos: lazy-load from `website/app/src/ui/docs/components/` via `MDXContent.tsx`

---

## Creating a new component

When the user says e.g. *"make me a new Color Picker with recipe variants and sizes"* — deliver a **complete, production-ready component** in one pass. Do not stop at the `.tsx` file.

### Step 1 — Research before writing

Pick 2–3 similar existing components and read:

- Their `components/ui/<name>.tsx` (API shape, `"use client"` usage, `dreamy()` calls)
- Their recipe/pattern file
- Their hook(s) in `packages/react/src/components/<name>/`
- Their story and MDX doc

| Component type | Study these |
|----------------|-------------|
| Simple styled control (Button, Badge) | `button.tsx`, `button.ts`, `button.stories.tsx`, `button.mdx` |
| Compound / overlay (Select, Modal) | `select.tsx`, `select.ts`, `use-select.ts`, `select.stories.tsx`, `select.mdx` |
| Layout primitive | `flex.tsx`, `flex.ts`, `flex.stories.tsx`, `flex.mdx` |
| Form input with a11y | `checkbox.tsx`, `use-checkbox.ts`, `field/` utilities |

### Step 2 — Create source files

| File | Action |
|------|--------|
| `components/ui/<kebab-name>.tsx` | Main component(s). PascalCase exports. `"use client"` when hooks/browser APIs are used. |
| `components/recipes/<kebab-name>.ts` | Recipe with variants, sizes, color schemes. Set `jsx` array to all component names that use it. |
| `components/patterns/<kebab-name>.ts` | Only if it is a layout primitive (no variants). |
| `packages/react/src/components/<kebab-name>/use-<kebab-name>.ts` | Headless hook: state, a11y, prop getters, context if compound. |
| `packages/react/src/components/<kebab-name>/index.ts` | Re-export hook(s) and context. |
| `packages/react/src/components/index.ts` | Add `export * from "./<kebab-name>"` |

### Step 3 — Hook design (`@dreamy-ui/react`)

- File: `packages/react/src/components/<name>/use-<name>.ts`
- Export `usePascalCase` function returning prop getters, state, and refs
- For compound components: export `Provider` + `useContext` via `createContext` (see `use-select.ts`)
- Reuse shared hooks: `useControllable`, `useDOMRef`, `mergeRefs`, `dataAttr`, `ariaAttr`, `useField`, etc.
- Use `interface` for props (not `type` aliases for objects)
- Use normal `function` declarations (not arrow functions) where possible
- Keep the component `.tsx` thin — it should wire hook output to styled elements

### Step 4 — Recipe design

- Use `defineRecipe` for single-element components, `defineSlotRecipe` for compound
- Use `defineParts` for multi-part styling
- Include `defaultVariants`, `variants` (variant, size, scheme), and `staticCss: ["*"]`
- List all JSX component names in the recipe's `jsx` array
- Follow token names from `@dreamy-ui/panda-preset` (see existing recipes for `getColorSchemes` usage)

### Step 5 — Component file design

```tsx
"use client"; // only when needed

import { useColorPicker, dataAttr } from "@dreamy-ui/react";
import { createStyleContext, dreamy } from "styled-system/jsx";
import { colorPicker } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(colorPicker);
const Trigger = withContext(dreamy.button, "trigger");

export function ColorPicker(props: ColorPickerProps) {
    const { getRootProps, getTriggerProps, isOpen } = useColorPicker(props);
    return (
        <dreamy.div {...getRootProps()}>
            <Trigger data-open={dataAttr(isOpen)} {...getTriggerProps()} />
        </dreamy.div>
    );
}
```

- **No Panda style props in `.tsx`** — colors, spacing, typography, layout, and variants live in the recipe/pattern only; use `data-*` + recipe selectors for stateful styles
- Public props get JSDoc comments
- Link to docs: `@See Docs https://dreamy-ui.com/docs/components/<name>`
- Use `dataAttr` / `ariaAttr` from `@dreamy-ui/react` for state attributes

### Step 6 — Storybook (required, automatic)

Create `website/stories/<kebab-name>.stories.tsx` with stories for:

- Base usage
- Every variant
- Every size
- Color schemes (if applicable)
- Loading / disabled / error states
- Any compound sub-component examples

### Step 7 — Documentation (required, automatic)

Create `website/docs/5.components/<kebab-name>.mdx` with:

```yaml
---
title: Color Picker
description: Short one-line description.
isServerComponent: false
source: /components/ui/color-picker.tsx
themeSource: /components/recipes/color-picker.ts
---
```

Include Installation, Usage, and a subsection per feature (variants, sizes, controlled mode, etc.) with live demos and code blocks.

For complex interactive examples, create `website/app/src/ui/docs/components/<plural>.tsx` and register lazy imports in `MDXContent.tsx`.

### Step 8 — Verify

- No edits in generated `website/components/`, `website/recipes/`, `website/patterns/`
- Hook exported from `packages/react/src/components/index.ts`
- Story and MDX reflect the full public API
- Code is performant, accessible, and readable

### Naming cheat sheet

| Layer | Convention | Example |
|-------|------------|---------|
| UI source file | `kebab-case.tsx` | `color-picker.tsx` |
| Recipe / pattern file | `kebab-case.ts` | `color-picker.ts` |
| Hook file | `use-kebab-case.ts` | `use-color-picker.ts` |
| Hook export | `usePascalCase` | `useColorPicker` |
| React export | `PascalCase` | `ColorPicker` |
| Story file | `kebab-case.stories.tsx` | `color-picker.stories.tsx` |
| Docs MDX | `kebab-case.mdx` in `5.components/` | `5.components/color-picker.mdx` |
| Interactive demo | plural `kebab-case.tsx` | `color-pickers.tsx` |
| Docs URL | `/docs/components/<slug>` | `/docs/components/color-picker` |

---

## Agent rules

### Always do (component work)

- Edit root `components/` and `packages/react/` for component changes
- **Automatically** update `website/stories/<name>.stories.tsx` when the component API or visuals change
- **Automatically** update `website/docs/5.components/<name>.mdx` (and interactive demos if needed) — **never wait for the user to ask**
- Study existing similar components before implementing
- Keep component files thin; put logic in `@dreamy-ui/react`
- **Never put Panda style props in `components/ui/*.tsx`** — recipes/patterns only
- Write the best, most performant, cleanest code possible

### Never do

- Manually copy files from `components/` into `website/components/`
- Run `pnpm dreamy add` yourself to sync the website
- Edit `website/components/`, `website/recipes/`, or `website/patterns/` as a shortcut
- Ship a component change without matching Storybook and docs updates
- Put heavy logic or utility functions in `components/ui/*.tsx`

### Registry watch

Assume the developer runs `pnpm components:watch` during component work. Only suggest `pnpm components` (one-shot) when watch is clearly not running. Do **not** start or suggest `components:watch` when not working on components.

### Imports

**Website app code:**
```ts
import { Button, Flex } from "@/ui";
```
Never import from root `components/ui` in website app code.

**Registry source:**
```ts
import { useSelect } from "@dreamy-ui/react";
import { button } from "styled-system/recipes";
import { flex } from "styled-system/patterns";
```

TypeScript in `components/` resolves `styled-system/*` via `components/tsconfig.json` → `website/styled-system/*`. Run `pnpm codegen` in the website if those types are missing.

---

## Common scripts

| Script | When |
|--------|------|
| `pnpm dev` | Start website (and turbo dev tasks) |
| `pnpm dev:lib` | Watch-build react, cli, panda-preset |
| `pnpm components:watch` | Developer runs while editing registry — agent should not duplicate this |
| `pnpm components` | One-shot registry JSON build |
| `pnpm build:dev` | Build all packages for local development |
| `pnpm typecheck` | Typecheck packages + website |

---

## Related skills & rules

- Consumer skills: [dreamy-ui](../../../skills/dreamy-ui/SKILL.md), [dreamy-ui-frontend](../../../skills/dreamy-ui-frontend/SKILL.md), [dreamy-ui-theming](../../../skills/dreamy-ui-theming/SKILL.md) + Dreamy UI MCP
- Website routing: `.cursor/rules/react-router.mdc`
- Frontend conventions: `.cursor/rules/dreamy-ui.mdc`
