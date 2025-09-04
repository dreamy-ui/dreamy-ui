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

        // Detect commands that start with `pnpm dreamy`
        const lines = node.value.split("\n").map((l: string) => l.trim());
        const firstDreamyLine = lines.find((l: string) => /^pnpm\s+dreamy\b/.test(l));
        if (!firstDreamyLine) continue;

        // Extract the sub-command after `pnpm `
        const sub = firstDreamyLine.replace(/^pnpm\s+/, "").trim(); // e.g. "dreamy components add card"

        const commands = {
            npm: `npx ${sub}`,
            pnpm: `pnpm ${sub}`,
            yarn: `yarn dlx ${sub}`,
            bun: `bunx ${sub}`
        };

        // <PMTabs>
        //   <PMTabs.Option name="npm">npx dreamy ...</PMTabs.Option>
        //   <PMTabs.Option name="pnpm">pnpm dreamy ...</PMTabs.Option>
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
