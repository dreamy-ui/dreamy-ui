export function remarkDreamyPMTabs() {
    return function transformer(tree: any) {
        transformTree(tree);
    };
}

function transformTree(parent: any) {
    if (!parent || !Array.isArray(parent.children)) return;

    for (let i = 0; i < parent.children.length; i++) {
        const node = parent.children[i];

        // Recurse first
        if (node?.children) {
            transformTree(node);
        }

        // Only consider code blocks
        if (!node || node.type !== "code" || typeof node.value !== "string") continue;

        // Detect commands that start with `pnpm` or `npx`
        const lines = node.value.split("\n").map((l: string) => l.trim());

        const firstCommandLine = lines.find((l: string) => /^(pnpm|npx)\s+/.test(l));
        if (!firstCommandLine) continue;

        // Determine if it's pnpm or npx
        const isPnpm = /^pnpm\s+/.test(firstCommandLine);
        const isNpx = /^npx\s+/.test(firstCommandLine);

        // Extract the sub-command after `pnpm ` or `npx `
        let sub = "";
        if (isPnpm) {
            sub = firstCommandLine.replace(/^pnpm\s+/, "").trim();
        } else if (isNpx) {
            sub = firstCommandLine.replace(/^npx\s+/, "").trim();
        }

        // Check if it's a dreamy command or an npx-style command
        const isDreamy = !!lines.find((l: string) => /^pnpm\s+dreamy\b/.test(l));
        const isNpxCommand = isNpx || isDreamy;

        const commands = isNpxCommand
            ? {
                  npm: `npx ${sub}`,
                  pnpm: `pnpm dlx ${sub}`,
                  yarn: `yarn dlx ${sub}`,
                  bun: `bunx ${sub}`
              }
            : {
                  npm: `npm ${sub}`,
                  pnpm: `pnpm ${sub}`,
                  yarn: `yarn ${sub}`,
                  bun: `bun ${sub}`
              };

        // <PMTabs>
        //   <PMTabs.Option name="npm">npx dreamy ...</PMTabs.Option>
        //   <PMTabs.Option name="pnpm">pnpm dlx dreamy ...</PMTabs.Option>
        //   <PMTabs.Option name="yarn">yarn dlx dreamy ...</PMTabs.Option>
        //   <PMTabs.Option name="bun">bunx dreamy ...</PMTabs.Option>
        // </PMTabs>
        const children = [
            createMdxEl("PMTabs.Option", [text(commands.npm)], [attr("name", "npm")]),
            createMdxEl("PMTabs.Option", [text(commands.pnpm)], [attr("name", "pnpm")]),
            createMdxEl("PMTabs.Option", [text(commands.yarn)], [attr("name", "yarn")]),
            createMdxEl("PMTabs.Option", [text(commands.bun)], [attr("name", "bun")])
        ];

        const root = createMdxEl("PMTabs", children);

        parent.children[i] = root;
    }
}

function text(value: string) {
    return { type: "text", value };
}

function attr(name: string, value: string) {
    return { type: "mdxJsxAttribute", name, value };
}

function createMdxEl(name: string, children: any[] = [], attributes: any[] = []) {
    return {
        type: "mdxJsxFlowElement",
        name,
        attributes,
        children
    };
}
