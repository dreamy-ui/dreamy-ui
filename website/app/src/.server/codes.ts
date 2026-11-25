import { serialize } from "next-mdx-remote/serialize";
import { outdent } from "outdent";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import { cursorDarkTheme } from "./theme";

const codes = {
    panda: outdent`
import { Button, Card, Flex, Heading, Text } from "@/ui";

export function AgentPreview() {
    return (
        <Card.Root
            bg="bg.panel"
            border="1px solid"
            borderColor="border"
            p={6}
            rounded="xl"
        >
            <Flex col gap={3}>
                <Heading size="xl">Zero runtime CSS</Heading>
                <Text color="fg.medium" size="sm">
                    Typed JSX style props compiled to atomic CSS at build time.
                </Text>
                <Button size="sm" variant="primary" w="fit-content">
                    Ship interface
                </Button>
            </Flex>
        </Card.Root>
    );
}
`,
    theme: outdent`
import { createDreamyPresets, dreamyPlugin } from "@dreamy-ui/panda-preset";
import { defineConfig } from "@pandacss/dev";

export default defineConfig({
    presets: createDreamyPresets({
        backgrounds: { light: "#FFFFFF", dark: "#080808" },
        fonts: { body: "Geist", heading: "Manrope" },
        primaryColor: { light: "#3B82F6", dark: "#74a6f8" },
        secondaryColor: "#fd8ebc",
        rounded: "lg"
    }),
    plugins: [dreamyPlugin()]
});
`,
    mcp: outdent`
{
    "mcpServers": {
        "dreamy-ui": {
            "command": "npx",
            "args": ["-y", "@dreamy-ui/mcp"]
        }
    }
}
`
};

export async function getLandingPageCodes() {
    const [panda, theme, mcp] = await Promise.all([
        serializeCode(codes.panda, "tsx"),
        serializeCode(codes.theme, "ts"),
        serializeCode(codes.mcp, "json")
    ]);

    return {
        panda,
        theme,
        mcp
    };
}

async function serializeCode(code: string, lang: "tsx" | "ts" | "json" = "tsx") {
    return serialize(`\`\`\`${lang}\n${code}\n\`\`\``, {
        parseFrontmatter: true,
        mdxOptions: {
            rehypePlugins: [
                [
                    rehypePrettyCode,
                    {
                        defaultLang: lang,
                        theme: cursorDarkTheme as any
                    } satisfies Options
                ]
            ]
        }
    });
}
