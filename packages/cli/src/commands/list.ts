import { fetchCompositions } from "@/utils/fetch";
import * as p from "@clack/prompts";
import { Command } from "commander";

export const ListCommand = new Command("list")
	.description("List all available components")
	.action(async () => {
		const { default: Table } = await import("cli-table");

		const table = new Table({
			head: ["name", "dependencies", "recipes", "patterns"],
			colWidths: [20, 30, 20, 20],
			style: { compact: true }
		});

		const items = await fetchCompositions();

		if (!Array.isArray(items)) {
			throw new Error("[dreamy-ui] invalid json response");
		}

		items.forEach((item) => {
			const deps = item.fileDependencies;
			const depsString = deps.length ? deps.join(", ") : "-";
			const recipesString =
				item.recipeIds && item.recipeIds.length > 0 ? item.recipeIds.join(", ") : "-";
			const patternsString =
				item.patternIds && item.patternIds.length > 0 ? item.patternIds.join(", ") : "-";
			table.push([item.id, depsString, recipesString, patternsString]);
		});

		p.log.info(`Found ${items.length} components`);

		p.log.info(table.toString());

		p.outro("🎉 Done!");
	});
