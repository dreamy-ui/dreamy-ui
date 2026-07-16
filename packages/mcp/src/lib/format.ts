import type { ParsedDocs, DocsExample } from "./parse-docs.js";
import type { ParsedExport, ParsedInterface } from "./parse-props.js";
import type { ParsedPattern, ParsedRecipe } from "./parse-recipe.js";

export function formatPropTable(interfaces: ParsedInterface[]): string {
	if (!interfaces.length) {
		return "_No exported props interfaces found._";
	}

	const parts: string[] = [];

	for (const item of interfaces) {
		parts.push(`### \`${item.name}\``);

		if (item.description) {
			parts.push(item.description);
		}

		if (item.extendsTypes.length > 0) {
			parts.push(`Extends: ${item.extendsTypes.map(function (typeName) {
				return `\`${typeName}\``;
			}).join(", ")}`);
		}

		if (!item.props.length) {
			parts.push("_No direct props (inherits from extended types)._");
			continue;
		}

		parts.push("| Prop | Type | Required | Default | Description |");
		parts.push("| --- | --- | --- | --- | --- |");

		for (const prop of item.props) {
			parts.push(
				`| \`${prop.name}\` | \`${prop.type.replace(/\|/g, "\\|")}\` | ${prop.required ? "yes" : "no"} | ${prop.defaultValue ? `\`${prop.defaultValue}\`` : "—"} | ${prop.description?.replace(/\|/g, "\\|") ?? "—"} |`
			);
		}
	}

	return parts.join("\n");
}

export function formatVariants(recipe: ParsedRecipe | null): string {
	if (!recipe) {
		return "_No recipe (layout pattern or unstyled component)._";
	}

	const parts: string[] = [];

	if (recipe.description) {
		parts.push(recipe.description);
	}

	if (Object.keys(recipe.defaultVariants).length > 0) {
		parts.push(
			"**Defaults:** " +
				Object.entries(recipe.defaultVariants)
					.map(function ([key, value]) {
						return `\`${key}="${value}"\``;
					})
					.join(", ")
		);
	}

	const variantNames = Object.keys(recipe.variants);

	if (variantNames.length === 0) {
		parts.push("_No style variants defined._");
	} else {
		const table = [
			"| Variant prop | Values |",
			"| --- | --- |"
		];

		for (const name of variantNames) {
			table.push(
				`| \`${name}\` | ${recipe.variants[name]
					.map(function (value) {
						return `\`${value}\``;
					})
					.join(", ")} |`
			);
		}

		parts.push(table.join("\n"));
	}

	if (recipe.slots.length > 0) {
		parts.push(
			"**Slots:** " +
				recipe.slots
					.map(function (slot) {
						return `\`${slot}\``;
					})
					.join(", ")
		);
	}

	return parts.join("\n\n");
}

export function formatPattern(pattern: ParsedPattern | null): string {
	if (!pattern) {
		return "";
	}

	if (!pattern.properties.length) {
		return "_Pattern has no declared properties._";
	}

	const lines = [
		"| Prop | Maps to |",
		"| --- | --- |"
	];

	for (const prop of pattern.properties) {
		lines.push(`| \`${prop.name}\` | \`${prop.value ?? prop.type}\` |`);
	}

	return lines.join("\n");
}

export function formatExports(
	componentName: string,
	exportsList: ParsedExport[]
): string {
	if (!exportsList.length) {
		return `\`${componentName}\``;
	}

	const isCompound = exportsList.some(function (item) {
		return item.name === "Root";
	});

	if (isCompound) {
		return exportsList
			.map(function (item) {
				const full = `${componentName}.${item.name}`;
				return item.description ? `- \`${full}\` — ${item.description}` : `- \`${full}\``;
			})
			.join("\n");
	}

	return exportsList
		.map(function (item) {
			return item.description ? `- \`${item.name}\` — ${item.description}` : `- \`${item.name}\``;
		})
		.join("\n");
}

export function formatExample(example: DocsExample): string {
	const parts = [`### ${example.title}`];

	if (example.description) {
		parts.push(example.description);
	}

	parts.push(`\`\`\`${example.language}\n${example.code}\n\`\`\``);

	return parts.join("\n\n");
}

export function formatExamples(docs: ParsedDocs, limit?: number): string {
	const list = typeof limit === "number" ? docs.examples.slice(0, limit) : docs.examples;

	if (!list.length) {
		return "_No code examples found in docs._";
	}

	return list.map(formatExample).join("\n\n");
}

export interface ComponentReferenceInput {
	id: string;
	component: string;
	description?: string;
	docsUrl: string;
	installCommand: string;
	npmDependencies: string[];
	fileDependencies: string[];
	exports: ParsedExport[];
	interfaces: ParsedInterface[];
	recipe: ParsedRecipe | null;
	pattern: ParsedPattern | null;
	primaryExample?: DocsExample;
	warnings?: string[];
}

export function formatComponentReference(input: ComponentReferenceInput): string {
	const parts: string[] = [
		`# ${input.component}`,
		"",
		input.description ?? `_Dreamy UI \`${input.id}\` component._`,
		"",
		`**Id:** \`${input.id}\`  `,
		`**Install:** \`${input.installCommand}\`  `,
		`**Docs:** ${input.docsUrl}  `,
		`**Import:** \`import { ${input.component} } from "@/ui";\``
	];

	parts.push("", "## API / exports", "", formatExports(input.component, input.exports));
	parts.push("", "## Styling variants", "", formatVariants(input.recipe));

	if (input.pattern) {
		parts.push("", "## Pattern props", "", formatPattern(input.pattern));
	}

	parts.push("", "## Props", "", formatPropTable(input.interfaces));

	if (input.primaryExample) {
		parts.push("", "## Usage example", "", formatExample(input.primaryExample));
	}

	if (input.npmDependencies.length > 0 || input.fileDependencies.length > 0) {
		parts.push("", "## Dependencies");

		if (input.npmDependencies.length > 0) {
			parts.push(
				"",
				"**npm:** " +
					input.npmDependencies
						.map(function (dep) {
							return `\`${dep}\``;
						})
						.join(", ")
			);
		}

		if (input.fileDependencies.length > 0) {
			parts.push(
				"",
				"**components:** " +
					input.fileDependencies
						.map(function (dep) {
							return `\`${dep.replace(/^\.\//, "")}\``;
						})
						.join(", ")
			);
		}
	}

	if (input.warnings?.length) {
		parts.push("", "## Warnings", "", ...input.warnings.map(function (warning) {
			return `- ${warning}`;
		}));
	}

	parts.push(
		"",
		"_Tip: use `get_component_examples` for more snippets, or `get_component_source` for full source/recipe._"
	);

	return parts.join("\n");
}

export function formatComponentListItem(item: {
	id: string;
	component: string;
	description?: string;
	hasRecipe: boolean;
	hasPattern: boolean;
	installCommand: string;
}): string {
	const tags: string[] = [];

	if (item.hasRecipe) {
		tags.push("recipe");
	}

	if (item.hasPattern) {
		tags.push("pattern");
	}

	const tagText = tags.length ? ` [${tags.join(", ")}]` : "";
	const description = item.description ? ` — ${item.description}` : "";

	return `- **${item.component}** (\`${item.id}\`)${tagText}${description}`;
}
