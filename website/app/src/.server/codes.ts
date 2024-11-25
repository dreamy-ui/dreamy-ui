import { serialize } from "next-mdx-remote/serialize";
import { outdent } from "outdent";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";

const codes = {
    panda: outdent`
<Flex col wFull gap={4}>
    <Heading size="4xl">
        Built on top of Panda CSS
    </Heading>
    <Text size="lg">
        Panda CSS is a powerful, flexible CSS-in-JS library that allows you to build
        performant, build-time styles using style props.
    </Text>
</Flex>
`
};

export async function getLandingPageCodes() {
    const [panda] = await Promise.all([serializeCode(codes.panda)]);

    return {
        panda
    };
}

async function serializeCode(code: string) {
    return serialize("```tsx\n" + code + "\n```", {
        parseFrontmatter: true,
        mdxOptions: {
            rehypePlugins: [
                [
                    rehypePrettyCode,
                    {
                        defaultLang: "tsx",
                        theme: "houston"
                    } satisfies Options
                ]
            ]
        }
    });
}
