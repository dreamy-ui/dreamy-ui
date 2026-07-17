export interface DocsCatalogEntry {
	id: string;
	section: string;
	page: string;
	title: string;
	description: string;
	path: string;
}

/**
 * Non-component documentation pages (guide, ai-agents, frameworks, theming, hooks).
 * Component docs are served via get_component / get_component_examples.
 */
export const DOCS_CATALOG: DocsCatalogEntry[] = [
	{
		id: "guide/introduction",
		section: "guide",
		page: "introduction",
		title: "Introduction",
		description: "What Dreamy UI is and why to use it.",
		path: "/docs/guide/introduction"
	},
	{
		id: "guide/installation",
		section: "guide",
		page: "installation",
		title: "Installation",
		description: "CLI and manual setup for Dreamy UI.",
		path: "/docs/guide/installation"
	},
	{
		id: "guide/cli",
		section: "guide",
		page: "cli",
		title: "CLI Reference",
		description: "dreamy CLI commands and options.",
		path: "/docs/guide/cli"
	},
	{
		id: "guide/charts",
		section: "guide",
		page: "charts",
		title: "Charts",
		description: "Using charts with Dreamy UI.",
		path: "/docs/guide/charts"
	},
	{
		id: "ai-agents/llms",
		section: "ai-agents",
		page: "llms",
		title: "LLMs",
		description: "LLM-oriented documentation endpoints.",
		path: "/docs/ai-agents/llms"
	},
	{
		id: "ai-agents/mcp-server",
		section: "ai-agents",
		page: "mcp-server",
		title: "MCP Server",
		description: "Dreamy UI Model Context Protocol server setup and tools.",
		path: "/docs/ai-agents/mcp-server"
	},
	{
		id: "ai-agents/skills",
		section: "ai-agents",
		page: "skills",
		title: "Skills",
		description: "Agent skills for Dreamy UI.",
		path: "/docs/ai-agents/skills"
	},
	{
		id: "frameworks/next.js",
		section: "frameworks",
		page: "next.js",
		title: "Using Next.js",
		description: "Dreamy UI with Next.js.",
		path: "/docs/frameworks/next.js"
	},
	{
		id: "frameworks/react-router",
		section: "frameworks",
		page: "react-router",
		title: "Using React Router",
		description: "Dreamy UI with React Router.",
		path: "/docs/frameworks/react-router"
	},
	{
		id: "frameworks/vite",
		section: "frameworks",
		page: "vite",
		title: "Using Vite",
		description: "Dreamy UI with Vite.",
		path: "/docs/frameworks/vite"
	},
	{
		id: "theming/customization",
		section: "theming",
		page: "customization",
		title: "Customization",
		description: "Extend Panda config, component recipes, and motion variants.",
		path: "/docs/theming/customization"
	},
	{
		id: "theming/panda-preset",
		section: "theming",
		page: "panda-preset",
		title: "Panda Preset",
		description: "createDreamyPreset options and color generation.",
		path: "/docs/theming/panda-preset"
	},
	{
		id: "theming/tokens",
		section: "theming",
		page: "tokens",
		title: "Tokens",
		description: "Design and semantic tokens shipped with the Dreamy UI Panda preset.",
		path: "/docs/theming/tokens"
	},
	{
		id: "theming/fonts",
		section: "theming",
		page: "fonts",
		title: "Fonts",
		description: "Custom fonts with Dreamy UI and Panda.",
		path: "/docs/theming/fonts"
	},
	{
		id: "theming/gotchas",
		section: "theming",
		page: "gotchas",
		title: "Gotchas",
		description: "Common pitfalls when using Dreamy UI.",
		path: "/docs/theming/gotchas"
	},
	{
		id: "hooks/use-action-key",
		section: "hooks",
		page: "use-action-key",
		title: "useActionKey",
		description: "Returns the action key of the current platform.",
		path: "/docs/hooks/use-action-key"
	},
	{
		id: "hooks/use-can-use-dom",
		section: "hooks",
		page: "use-can-use-dom",
		title: "useCanUseDOM",
		description: "Whether the user has hydrated.",
		path: "/docs/hooks/use-can-use-dom"
	},
	{
		id: "hooks/use-clipboard",
		section: "hooks",
		page: "use-clipboard",
		title: "useClipboard",
		description: "Copy text to the clipboard.",
		path: "/docs/hooks/use-clipboard"
	},
	{
		id: "hooks/use-color-mode",
		section: "hooks",
		page: "use-color-mode",
		title: "useColorMode",
		description: "Get, set, or toggle color mode.",
		path: "/docs/hooks/use-color-mode"
	},
	{
		id: "hooks/use-controllable",
		section: "hooks",
		page: "use-controllable",
		title: "useControllable",
		description: "Control component state.",
		path: "/docs/hooks/use-controllable"
	},
	{
		id: "hooks/use-event-listener",
		section: "hooks",
		page: "use-event-listener",
		title: "useEventListener",
		description: "Listen to events on a target.",
		path: "/docs/hooks/use-event-listener"
	},
	{
		id: "hooks/use-reduced-motion",
		section: "hooks",
		page: "use-reduced-motion",
		title: "useReducedMotion",
		description: "Reduced motion preference from the provider.",
		path: "/docs/hooks/use-reduced-motion"
	},
	{
		id: "hooks/use-safe-layout-effect",
		section: "hooks",
		page: "use-safe-layout-effect",
		title: "useSafeLayoutEffect",
		description: "useLayoutEffect that falls back to useEffect during SSR.",
		path: "/docs/hooks/use-safe-layout-effect"
	},
	{
		id: "hooks/use-update-effect",
		section: "hooks",
		page: "use-update-effect",
		title: "useUpdateEffect",
		description: "Run an effect only after dependencies update, skipping the first render.",
		path: "/docs/hooks/use-update-effect"
	},
];

export function getDocsCatalogIds(): string[] {
	return DOCS_CATALOG.map(function (entry) {
		return entry.id;
	});
}

export function resolveDocsEntry(input: string): DocsCatalogEntry | null {
	const normalized = input.trim().toLowerCase().replace(/^\/docs\//, "").replace(/\.mdx$/, "");

	for (const entry of DOCS_CATALOG) {
		if (entry.id === normalized) {
			return entry;
		}

		if (entry.page === normalized) {
			return entry;
		}

		if (entry.path.replace(/^\/docs\//, "") === normalized) {
			return entry;
		}
	}

	return null;
}
