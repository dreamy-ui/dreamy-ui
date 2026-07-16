export interface DocsFrontmatter {
	title?: string;
	description?: string;
	isServerComponent?: boolean;
}

export interface DocsExample {
	title: string;
	description?: string;
	code: string;
	language: string;
}

export interface ParsedDocs {
	frontmatter: DocsFrontmatter;
	examples: DocsExample[];
	importHint?: string;
}

function parseFrontmatter(mdx: string): { frontmatter: DocsFrontmatter; body: string } {
	const match = mdx.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

	if (!match) {
		return { frontmatter: {}, body: mdx };
	}

	const frontmatter: DocsFrontmatter = {};
	const lines = match[1].split(/\r?\n/);

	for (const line of lines) {
		const separator = line.indexOf(":");

		if (separator === -1) {
			continue;
		}

		const key = line.slice(0, separator).trim();
		const value = line.slice(separator + 1).trim();

		if (key === "title") {
			frontmatter.title = value;
		} else if (key === "description") {
			frontmatter.description = value;
		} else if (key === "isServerComponent") {
			frontmatter.isServerComponent = value === "true";
		}
	}

	return {
		frontmatter,
		body: mdx.slice(match[0].length)
	};
}

function stripMdxNoise(text: string): string {
	return text
		.replace(/<Wrapper>[\s\S]*?<\/Wrapper>/g, "")
		.replace(/<\/?[A-Za-z][^>]*>/g, "")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

/**
 * Parse MDX docs into structured usage examples for LLMs.
 */
export function parseDocs(mdx: string): ParsedDocs {
	const { frontmatter, body } = parseFrontmatter(mdx);
	const examples: DocsExample[] = [];

	const sectionRegex = /^(#{2,3})\s+(.+)$/gm;
	const sections: Array<{ title: string; start: number; end: number }> = [];
	let sectionMatch: RegExpExecArray | null;

	while ((sectionMatch = sectionRegex.exec(body)) !== null) {
		sections.push({
			title: sectionMatch[2].trim(),
			start: sectionMatch.index + sectionMatch[0].length,
			end: body.length
		});
	}

	for (let i = 0; i < sections.length; i++) {
		if (i + 1 < sections.length) {
			sections[i].end = sections[i + 1].start - 1;
		}
	}

	const firstHeading = body.search(/^#{2,3}\s+/m);
	const preamble = firstHeading === -1 ? body : body.slice(0, firstHeading);

	function collectExamples(title: string, content: string) {
		const codeBlockRegex = /```(\w+)?\r?\n([\s\S]*?)```/g;
		let codeMatch: RegExpExecArray | null;
		let blockIndex = 0;

		while ((codeMatch = codeBlockRegex.exec(content)) !== null) {
			const language = (codeMatch[1] || "tsx").toLowerCase();
			const code = codeMatch[2].trim();

			if (language === "bash" || language === "sh" || language === "shell") {
				continue;
			}

			if (!code) {
				continue;
			}

			const before = content.slice(0, codeMatch.index);
			const description = stripMdxNoise(before).slice(-400);

			examples.push({
				title: blockIndex === 0 ? title : `${title} (${blockIndex + 1})`,
				description: description || undefined,
				code,
				language
			});

			blockIndex++;
		}
	}

	if (preamble.includes("```")) {
		collectExamples("Usage", preamble);
	}

	for (const section of sections) {
		if (section.title.toLowerCase() === "installation") {
			continue;
		}

		const content = body.slice(section.start, section.end);
		collectExamples(section.title, content);
	}

	return {
		frontmatter,
		examples,
		importHint: 'import { ComponentName } from "@/ui";'
	};
}

export function getPrimaryExample(docs: ParsedDocs): DocsExample | undefined {
	const usage = docs.examples.find(function (example) {
		return example.title.toLowerCase() === "usage";
	});

	return usage ?? docs.examples[0];
}
