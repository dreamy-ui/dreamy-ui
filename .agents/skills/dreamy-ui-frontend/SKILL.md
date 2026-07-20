---
name: dreamy-ui-frontend
description: >-
  Write React UI with Dreamy UI components: imports, JSX style props, semantic
  tokens, fallback composition, and cva recipes. Use when building or editing
  pages, components, layouts, forms, or any Dreamy UI markup and styling.
metadata:
  tags: frontend, react, dreamy-ui, styling, tokens
---

# Dreamy UI — Frontend

How to write real React UI with Dreamy UI. Read the main [dreamy-ui](../dreamy-ui/SKILL.md) skill first for the library rule and MCP flow.

For theme / Panda config changes, use [dreamy-ui-theming](../dreamy-ui-theming/SKILL.md).

---

## Imports

Import components from the CLI-generated UI entry (path alias is set up by `dreamy init`):

```tsx
import { Button, EmptyState, Flex, Text } from "@/ui";
```

- Install missing components with `npx dreamy add <id>` (or the install command from MCP `get_component`).
- Prefer MCP `get_component` for the exact export names (including compound parts).

---

## Styling: JSX style props only

Style Dreamy components with **JSX style props** (Panda props on the component):

```tsx
<Flex bg="bg.panel" p={4} gap={3} rounded="l2" border="1px solid" borderColor="border">
  <Text color="fg">Title</Text>
</Flex>
```

**Do not** use these unless the user explicitly asks:

- `className={css(...)}`
- `css={{ ... }}` prop
- raw `className` utility dumps for layout/color that style props already cover

Exception: `className` is fine when applying a **`cva()` recipe** you defined for a custom (non-Dreamy) element, or when the user requests it.

---

## Prefer semantic tokens everywhere

Prefer **semantic tokens** over raw design tokens or hardcoded values. Semantic tokens (`fg`, `bg`, `primary`, `border`, `l2`, …) follow the theme and color mode — one change in `createDreamyPreset` updates the whole UI. Design tokens (`blue.500`, `4`, `md`) and fixed CSS (`#3B82F6`, `16px`) lock you to one look and break dark mode or rebrands.

### Prefer

```tsx
<Flex
  bg="bg.panel"
  border="default"
  gap={4}
  p={4}
  rounded="l2"
>
  <Text color="fg">Account settings</Text>
  <Text color="fg.medium">Manage your profile and preferences.</Text>
  <Button variant="primary">Save changes</Button>
</Flex>
```

### Avoid

```tsx
{/* Fragile: breaks in dark mode and ignores your brand */}
<Flex
  bg="#ffffff"
  border="1px solid #e5e7eb"
  gap="16px"
  p="16px"
  rounded="8px"
>
  <Text color="gray.900">Account settings</Text>
  <Text color="gray.500">Manage your profile and preferences.</Text>
  <Button bg="blue.500" color="white">
    Save changes
  </Button>
</Flex>
```

Hardcoded hex values and palette steps like `blue.500` or `gray.900` bypass the semantic layer. Use design tokens / fixed values **only** when you need a one-off accent that is not part of the theme API.

---

## Dynamic token strings are impossible

Panda CSS is static. It **cannot** resolve dynamic token paths built at runtime:

```tsx
{/* NEVER — Panda cannot see `${accent}.500` */}
<Box color={`${accent}.500`} />
<Box bg={`${colorScheme}.100`} />
```

That will not generate CSS. Do not do it.

**Conditionals with literal token strings are fine** — Panda extracts both branches:

```tsx
<Box color={isHovered ? "success" : "error"} />
<Text color={isActive ? "fg" : "fg.medium"} />
```

---

## Main semantic tokens (defaults)

If unsure whether a token exists, call the **Panda CSS MCP** (`get_semantic_tokens`, `get_tokens`, `get_color_palette`). Do not invent token names.

| Token | Use for |
|-------|---------|
| `fg` | Default body text |
| `fg.max` | Strongest text (headings, emphasis) |
| `fg.medium` | Secondary / muted text |
| `fg.disabled` | Disabled text |
| `bg` | Page / app background |
| `bg.panel` | Cards, panels, elevated surfaces |
| `bg.subtle` / `bg.muted` | Quieter surface fills |
| `primary` / `primary.hover` / `primary.active` | Brand primary |
| `primary.fg` | Text on primary |
| `secondary` / `secondary.hover` / `secondary.active` | Brand secondary |
| `secondary.fg` | Text on secondary |
| `border` / `border.muted` / `border.hover` | Borders |
| `success` / `warning` / `error` / `info` | Status colors (`*.fg` for text on them) |
| `alpha.50`…`alpha.950` | Translucent overlays |
| `inverted` | Opposite of current bg |
| `l1` / `l2` / `l3` | Semantic radii (from preset `rounded`) |

Spacing/sizing: prefer numeric scale tokens via props (`p={4}`, `gap={3}`, `w="full"`) over raw `px` strings.

---

## Custom recipes: prefer `cva()`, not config recipes

Dreamy UI's own components already use **config recipes** (`defineRecipe` / `defineSlotRecipe` in Panda config). Those are JIT — only variants Panda finds in your code ship in CSS.

For **app-level** custom multi-variant styles, prefer **atomic recipes (`cva`)** colocated with the component:

| | Config recipe | Atomic recipe (`cva`) |
|--|---------------|------------------------|
| Theme tokens / utilities | Yes | Yes |
| JIT (only used variants) | Yes | No — all variants always |
| Shareable in a preset | Yes | No |
| Responsive variant props | Yes (no compoundVariants) | No |
| Colocate with components | No — define in config | Yes |
| Runtime merge with `css()` | No | Yes |

**Default for consumer apps:** use `cva()` from `styled-system/css`. Do **not** add new config recipes for ordinary app components — leave config recipes to Dreamy's design-system components.

```tsx
import { cva } from "styled-system/css";

const cardRecipe = cva({
  base: { p: 4, rounded: "l2", bg: "bg.panel" },
  variants: {
    tone: {
      quiet: { borderWidth: "1px", borderColor: "border.muted" },
      loud: { borderWidth: "1px", borderColor: "border" }
    }
  },
  defaultVariants: { tone: "quiet" }
});
```

---

## Fallback policy

If a requested UI pattern is not a Dreamy component:

1. Recreate it from existing Dreamy primitives (e.g. no `<Header />` → compose with `Flex`, `Heading`, `Button`, etc.). There is a `Modal`, but many layouts are just patterns + components.
2. If still impossible, ask the user **before** introducing any external UI library.

Always confirm missing pieces with MCP `list_components` first.
