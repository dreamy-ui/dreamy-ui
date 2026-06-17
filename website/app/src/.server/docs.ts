import { matchSorter } from "match-sorter";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { log } from "~/src/.server/als";
import { prisma } from "~/src/.server/db";
import { capitalize, filenameToSlug } from "~/src/functions/string";
import { createHId } from "~/src/ui/docs/MDXContent";
import { remarkDreamyPMTabs } from "./remark-tabs";
import { cursorDarkTheme } from "./theme";

export class Docs {
    public static async getSections(): Promise<LocalSection[]> {
        const sections = await prisma.docSection.findMany({
            include: {
                pages: {
                    orderBy: { index: "asc" }
                }
            },
            orderBy: { index: "asc" }
        });

        return sections.map((section) => ({
            index: section.index,
            slugified: section.slug,
            title: section.title,
            sections: section.pages.map((page) => ({
                name: page.name,
                slug: page.slug,
                index: page.index
            }))
        }));
    }

    public static async getDoc(
        folder: string,
        page: string,
        sectionsArg?: Sections
    ): Promise<ValidDocsFile | null> {
        const start = performance.now();

        const sections = sectionsArg ?? (await Docs.getSections());
        const normalizedFolder = folder.replaceAll("-", " ").toLowerCase();

        const section = sections.find(
            (item) =>
                item.slugified.toLowerCase() === folder.toLowerCase() ||
                removeIndex(item.title).toLowerCase() === normalizedFolder
        );

        if (!section) {
            return null;
        }

        const pageEntry = section.sections.find(
            (item) =>
                filenameToSlug(item.name).toLowerCase() === page.toLowerCase() ||
                item.name.toLowerCase() === filenameToTitle(page).toLowerCase()
        );

        if (!pageEntry) {
            return null;
        }

        const doc = await prisma.docPage.findUnique({
            where: {
                slug: pageEntry.slug
            },
            include: {
                section: true
            }
        });

        if (!doc) {
            return null;
        }

        log().set({ doc: (performance.now() - start).toFixed(2) + "ms" });

        return Docs.mapDocPage(doc);
    }

    public static async searchDocs(query: string, limit = 10): Promise<DocSearchResult[]> {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            return [];
        }

        const pages = await prisma.docPage.findMany({
            include: {
                section: true
            }
        });

        const ranked = matchSorter(pages, trimmedQuery, {
            keys: [
                { key: "title", threshold: matchSorter.rankings.CONTAINS },
                { key: "description", threshold: matchSorter.rankings.CONTAINS },
                { key: "searchText", threshold: matchSorter.rankings.CONTAINS },
                { key: "name", threshold: matchSorter.rankings.CONTAINS }
            ]
        }).slice(0, limit);

        return ranked.map((page) => ({
            title: page.title,
            description: page.description,
            sectionTitle: page.section.title,
            path: page.slug,
            filename: page.name
        }));
    }

    public static async serialize(content: string) {
        const headings = await extractHeadings(content);

        return await serialize(content, {
            parseFrontmatter: true,
            scope: {
                headings
            },
            mdxOptions: {
                remarkPlugins: [remarkGfm, remarkDreamyPMTabs],
                rehypePlugins: [
                    [
                        rehypePrettyCode,
                        {
                            defaultLang: "tsx",
                            theme: cursorDarkTheme as any
                        } satisfies Options
                    ]
                ]
            }
        });
    }

    private static mapDocPage(doc: {
        filename: string;
        content: string;
        mdxContent: string;
        mdxFrontmatterDescription: string | null;
        headings: string;
        index: number;
    }): ValidDocsFile {
        const mdxContent = JSON.parse(doc.mdxContent) as MdxContent;
        const mdxFrontmatterDescription = doc.mdxFrontmatterDescription
            ? (JSON.parse(doc.mdxFrontmatterDescription) as MdxContent)
            : null;
        const headings = JSON.parse(doc.headings) as Heading[];

        return {
            filename: doc.filename,
            content: doc.content,
            mdxContent,
            index: doc.index,
            mdxFrontmatterDescription,
            headings
        };
    }
}

export interface DocSearchResult {
    title: string;
    description: string | null;
    sectionTitle: string;
    path: string;
    filename: string;
}

export function filenameToTitle(filename: string) {
    return capitalize(filename.replaceAll("-", " ").replaceAll("/", "").replaceAll("?", ""));
}

export function removeIndex(filename: string) {
    if (Number.isNaN(Number.parseInt(filename[0]))) {
        return filename.split(".")[0];
    }

    return filename
        .slice(filename.indexOf(".") + 1)
        .replaceAll(".mdx", "")
        .replaceAll(".md", "");
}

export function getIndex(filename: string) {
    const num = Number.parseInt(filename.split(".")[0]);
    return Number.isNaN(num) ? -1 : num;
}

export function minToMs(minutes: number) {
    return minutes * 60 * 1000;
}

export function hourToMs(hours: number) {
    return hours * 60 * 60 * 1000;
}

export function daysToMs(days: number) {
    return days * 24 * 60 * 60 * 1000;
}

export interface MdxContent
    extends MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>> {}

export interface ISection {
    title: string;
    slugified: string;
    sections: Page[];
}

interface Page {
    name: string;
    slug: string;
}

interface LocalPage extends Page {
    index: number;
}

export interface LocalSection {
    index: number;
    slugified: string;
    title: string;
    sections: LocalPage[];
}

export type Sections = LocalSection[];

interface ValidDocsFile {
    filename: string;
    content: string;
    mdxContent: MdxContent;
    mdxFrontmatterDescription: MdxContent | null;
    index: number;
    headings: Heading[];
}

function getHeadings(tree: any) {
    const headings = new Array<Heading>();

    for (const node of tree.children) {
        if (node.type === "heading") {
            const text = node.children
                .filter((child: any) => child.type === "text")
                .map((child: any) => child.value)
                .join("");

            if (node.depth === 2) {
                headings.push({
                    depth: node.depth,
                    text,
                    id: createHId(text) as string,
                    headings: []
                });
            } else if (node.depth === 3) {
                const parent = headings[headings.length - 1];

                if (!parent || parent.depth === 3) {
                    headings.push({
                        depth: node.depth,
                        text,
                        id: createHId(text) as string,
                        headings: []
                    });
                } else {
                    parent?.headings?.push({
                        depth: node.depth,
                        text,
                        id: createHId(text) as string
                    });
                }
            }
        }
    }

    return headings;
}

interface Heading {
    depth: number;
    text: string;
    id: string;
    headings?: Heading[];
}

async function extractHeadings(content: string) {
    const tree = unified().use(remarkParse).parse(removeFrontmatter(content));

    return getHeadings(tree);
}

function removeFrontmatter(content: string) {
    return content.replace(/---[\s\S]*?---/, "");
}

export type { ValidDocsFile };
