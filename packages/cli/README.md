# @dreamy-ui/cli

The official CLI for Dreamy UI projects.

## Installation

```bash
# npm
npm install -D @dreamy-ui/cli

# pnpm
pnpm add -D @dreamy-ui/cli

# yarn
yarn add -D @dreamy-ui/cli

# bun
bun add -D @dreamy-ui/cli
```

Or use it directly with `npx`:

```bash
npx @dreamy-ui/cli [command]
```

## Commands

### `init`

Initialize Dreamy UI in your project with automatic setup.

```bash
npx @dreamy-ui/cli init
```

**Features:**

- 🔍 Automatically detects your framework (React Router v7, Next.js, or Vite)
- 📦 Installs all required dependencies (Panda CSS + Dreamy UI)
- ⚙️ Creates and configures `panda.config.ts`
- 🧹 Removes default Tailwind CSS (React Router v7 only)
- 🎨 Sets up CSS files with proper imports
- 🚀 Creates a `DreamyProvider` component
- 📝 Updates your `tsconfig.json` (TypeScript projects)
- 🎯 Runs Panda CSS codegen
- 🎁 Adds default starter components (button, input, card)

**Options:**

- `--yes, -y` - Skip all prompts and use defaults
- `--skip-install` - Skip dependency installation
- `--skip-components` - Skip adding default components

### `add`

Add components to your project.

```bash
npx @dreamy-ui/cli add [components...]
```

**Examples:**

```bash
# Add a single component
npx @dreamy-ui/cli add button

# Add multiple components
npx @dreamy-ui/cli add button input card

# Add all components
npx @dreamy-ui/cli add --all
```

**Options:**

- `--all` - Add all available components
- `--force, -f` - Overwrite existing files
- `--dry-run, -d` - Preview changes without writing files
- `--outdir <dir>` - Specify output directory
- `--tsx` - Force TypeScript output

### `list`

List all available components.

```bash
npx @dreamy-ui/cli list
```

### `diff`

Compare local components with registry versions.

```bash
npx @dreamy-ui/cli diff [component]
```

## Quick Start

1. **Initialize Dreamy UI in your project:**

```bash
npx @dreamy-ui/cli init
```

2. **Add components you need:**

```bash
npx @dreamy-ui/cli add button input card
```

3. **Start building!**

```tsx
import { Button } from "@dreamy-ui/react";

export default function App() {
	return <Button>Hello Dreamy UI! 🌙</Button>;
}
```

## Supported Frameworks

- ✅ React Router v7 (Framework Mode)
- ✅ Next.js 13+ (App Router)
- ✅ Vite + React
- ✅ Remix (via Vite)

## Documentation

For detailed documentation, visit [dreamy-ui.com/docs](https://dreamy-ui.com/docs).

## License

MIT
