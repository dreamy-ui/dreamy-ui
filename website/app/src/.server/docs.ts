import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import fs from "node:fs/promises";
import type { Root } from "node_modules/remark-parse/lib";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { cachified } from "~/src/.server/cache";
import { env } from "~/src/.server/env";
import { octokit } from "~/src/.server/github";
import { Logger } from "~/src/.server/logger";
import { capitalize } from "~/src/functions/string";
import { createHId } from "~/src/ui/docs/MDXContent";

export class Docs {
    private static shouldFetchGithubDocs = false; // make it `true` to fetch github docs instead from disk in development mode
    private static shouldCacheDocs =
        process.env.NODE_ENV === "production" || Docs.shouldFetchGithubDocs;
    private static docs = new Map<
        string,
        {
            index: number;
            files: DocsFile[];
        }
    >();

    private static async fetchLocalDocs() {
        const folderNames = await fs.readdir("docs");

        for (let folderName of folderNames) {
            const filenames = await fs.readdir(`docs/${folderName}`);

            const index = getIndex(folderName);

            const files = await Promise.all<DocsFile>(
                filenames.map(async (filename) => {
                    const content = await fs.readFile(`docs/${folderName}/${filename}`, "utf-8");

                    const mdxContent = await Docs.serialize(content);

                    const fileIndex = getIndex(filename);
                    filename = removeIndex(filename);

                    return new DocsFile(filename, content, mdxContent, fileIndex);
                })
            );

            folderName = removeIndex(folderName);
            Docs.docs.set(folderName, {
                index,
                files
            });
        }
    }

    private static async fetchLocalDoc(filepath: string) {
        let folder = filepath.split("/")[0];
        let file = filepath.split("/")[1];

        folder = removeIndex(folder);
        const fileIndex = getIndex(file);
        file = removeIndex(file);

        const content = await fs.readFile(`docs/${filepath}`, "utf-8");

        const serializeStart = performance.now();
        const mdxContent = await Docs.serialize(content);
        // console.log("mdxContent", mdxContent);
        Logger.debug(`Docs.serialize took ${performance.now() - serializeStart}ms`);

        const mdxFrontmatterDescription =
            mdxContent.frontmatter.description &&
            typeof mdxContent.frontmatter.description === "string"
                ? await Docs.serialize(mdxContent.frontmatter.description)
                : null;

        const doc = new DocsFile(
            file,
            content,
            mdxContent,
            fileIndex,
            mdxFrontmatterDescription,
            mdxContent.scope.headings as Heading[]
        ) as ValidDocsFile;

        const currentFolder = Docs.docs.get(folder);
        if (!currentFolder) {
            throw new Error(
                "Missing current folder in Docs.docs current: " + folder + " file: " + file
            );
        }

        Docs.docs.set(folder, {
            ...currentFolder,
            files: currentFolder.files.map((file) => {
                if (file.filename === doc.filename) {
                    return doc;
                }
                return file;
            })
        });

        // await Docs.fetchLocalDocs();

        // const doc = Docs.docs.get(folder)?.files.find((f) => f.filename === file);

        return doc ?? null;
    }

    /**
     * `SOURCE_REPO` env is required for this function to work
     */
    private static async fetchGithubDoc(filePath: string) {
        let folder = filePath.split("/")[0];
        let file = filePath.split("/")[1];

        folder = removeIndex(folder);
        const fileIndex = getIndex(file);
        file = removeIndex(file);

        // Fetch a single file from the GitHub repo
        if (!env.VITE_SOURCE_REPO) {
            throw new Error("Missing required environment variable SOURCE_REPO");
        }

        const gh = await octokit.rest.repos.getContent({
            owner: env.VITE_SOURCE_REPO.split("/")[0],
            repo: env.VITE_SOURCE_REPO.split("/")[1],
            path: "website/docs/" + filePath
        });

        if (!("data" in gh)) {
            throw new Error("Missing data in response from GitHub");
        }

        const downloadUrl = (gh.data as any)?.download_url;
        if (!downloadUrl) {
            throw new Error("Missing download_url in response from GitHub");
        }

        const response = await fetch(downloadUrl).then((res) => res.text());

        const mdxContent = await Docs.serialize(response);
        const mdxFrontmatterDescription =
            mdxContent.frontmatter.description &&
            typeof mdxContent.frontmatter.description === "string"
                ? await Docs.serialize(mdxContent.frontmatter.description)
                : null;

        const currentFolder = Docs.docs.get(folder);
        if (!currentFolder) {
            throw new Error(
                "Missing current folder in Docs.docs current: " + folder + " file: " + file
            );
        }

        const createdFile = new DocsFile(
            file,
            response,
            mdxContent,
            fileIndex,
            mdxFrontmatterDescription,
            mdxContent.scope.headings as Heading[]
        ) as ValidDocsFile;

        Docs.docs.set(folder, {
            ...currentFolder,
            files: currentFolder.files.map((file) => {
                if (file.filename === createdFile.filename) {
                    return createdFile;
                }
                return file;
            })
        });

        return createdFile;
    }

    /**
     * `SOURCE_REPO` env is required for this function to work
     */
    private static async fetchGithubDocsFolder() {
        // Fetch a single file from the GitHub repo
        if (!env.VITE_SOURCE_REPO) {
            throw new Error("Missing required environment variable SOURCE_REPO");
        }

        const gh = await octokit.rest.repos.getContent({
            owner: env.VITE_SOURCE_REPO.split("/")[0],
            repo: env.VITE_SOURCE_REPO.split("/")[1],
            path: "website/docs"
        });

        if (!("data" in gh)) {
            throw new Error("Missing data in response from GitHub");
        }

        const folderArr = (gh.data as any).filter((item: any) => item.type === "dir");

        const folders = folderArr.map((folder: any) => folder.name) as string[];

        // fetch every folder file names and resort them
        for (let folder of folders) {
            const folderIndex = getIndex(folder);
            folder = removeIndex(folder);

            const filenamesRes = await octokit.rest.repos.getContent({
                owner: env.VITE_SOURCE_REPO.split("/")[0],
                repo: env.VITE_SOURCE_REPO.split("/")[1],
                path: `website/docs/${folderIndex}.${folder}`
            });

            const files = (filenamesRes.data as any).filter((item: any) => item.type === "file");

            const filenames = files.map((file: any) => file.name) as string[];

            const foundFolder = Docs.docs.get(folder);
            if (!foundFolder) {
                const newFiles = await Promise.all<DocsFile>(
                    files.map(async (file: any) => {
                        const index = getIndex(file.name);
                        const filename = removeIndex(file.name);

                        return new DocsFile(filename, null, null, index);
                    })
                );

                Docs.docs.set(folder, {
                    index: folderIndex,
                    files: newFiles
                });
                continue;
            }

            // update the index of folder
            Docs.docs.set(folder, {
                ...foundFolder,
                index: folderIndex
            });

            // update the index of files
            for (const filename of filenames) {
                const fileIndex = getIndex(filename);
                const fileName = removeIndex(filename);

                const foundFile = foundFolder.files.find((file) => file.filename === fileName);
                if (!foundFile) continue;

                Docs.docs.set(folder, {
                    ...foundFolder,
                    files: foundFolder.files.map((file) => {
                        if (file.filename === fileName) {
                            // console.log("found file", file.filename, fileName);
                            return {
                                ...file,
                                index: fileIndex
                            };
                        }
                        // console.log("not found file", file);
                        return file;
                    })
                });
            }
        }
    }

    /**
     * `SOURCE_REPO` env is required for this function to work
     */
    public static async fetchGithubDocsOnStartup() {
        Logger.info("Fetching GitHub docs on startup");

        // Fetch a single file from the GitHub repo
        if (!env.VITE_SOURCE_REPO) {
            throw new Error("Missing required environment variable SOURCE_REPO");
        }

        const gh = await octokit.rest.repos.getContent({
            owner: env.VITE_SOURCE_REPO.split("/")[0],
            repo: env.VITE_SOURCE_REPO.split("/")[1],
            path: "website/docs"
        });

        if (!("data" in gh)) {
            throw new Error("Missing data in response from GitHub");
        }

        const folders = (gh.data as any).filter((item: any) => item.type === "dir");

        for (const folder of folders) {
            // console.log("folder", folder);
            let folderName = folder.name;
            const files = await octokit.rest.repos.getContent({
                owner: env.VITE_SOURCE_REPO.split("/")[0],
                repo: env.VITE_SOURCE_REPO.split("/")[1],
                path: "website/docs/" + folderName
            });

            if (!("data" in files)) {
                throw new Error("Missing data in response from GitHub");
            }

            const index = getIndex(folderName);
            folderName = removeIndex(folderName);

            const fileContents = await Promise.all<DocsFile>(
                (files.data as any).map(async (file: any) => {
                    // console.log("file", file);
                    const downloadUrl = file.download_url;
                    if (!downloadUrl) {
                        throw new Error("Missing download_url in response from GitHub");
                    }

                    const content = await fetch(downloadUrl).then((res) => res.text());

                    const mdxContent = await Docs.serialize(content);
                    const mdxFrontmatterDescription =
                        mdxContent.frontmatter.description &&
                        typeof mdxContent.frontmatter.description === "string"
                            ? await Docs.serialize(mdxContent.frontmatter.description)
                            : null;

                    const index = getIndex(file.name);
                    const filename = removeIndex(file.name);

                    const doc = new DocsFile(
                        filename,
                        content,
                        mdxContent,
                        index,
                        mdxFrontmatterDescription,
                        mdxContent.scope.headings as Heading[]
                    ) as ValidDocsFile;

                    const key = `docs-${folderName}-${filename}`;
                    console.log("key", key);

                    return cachified({
                        key,
                        ttl: Docs.shouldCacheDocs ? minToMs(5) : 0,
                        staleWhileRevalidate: Docs.shouldCacheDocs ? minToMs(60) : 0,
                        getFreshValue: () => doc
                    });
                })
            );

            Docs.docs.set(folderName, {
                index,
                files: fileContents
            });
        }
    }

    public static async fetchDocsOnStartup() {
        if (process.env.NODE_ENV === "production" || Docs.shouldFetchGithubDocs) {
            return Docs.fetchGithubDocsOnStartup();
        }

        return Docs.fetchLocalDocs();
    }

    private static async fetchFreshDocsStructure() {
        if (process.env.NODE_ENV === "production" || Docs.shouldFetchGithubDocs) {
            return Docs.fetchGithubDocsFolder();
        }

        return Docs.fetchLocalDocs();
    }

    private static async fetchFreshDoc(filepath: string) {
        if (process.env.NODE_ENV === "production" || Docs.shouldFetchGithubDocs) {
            return Docs.fetchGithubDoc(filepath);
        }

        return Docs.fetchLocalDoc(filepath);
    }

    public static getDocsAsArray() {
        return Array.from(Docs.docs);
    }

    public static async getSections(): Promise<ISection[]> {
        return await cachified({
            key: "docs-sections",
            ttl: Docs.shouldCacheDocs ? minToMs(10) : 10_000,
            staleWhileRevalidate: Docs.shouldCacheDocs ? daysToMs(30) : 30_000,
            getFreshValue: async () => {
                await Docs.fetchFreshDocsStructure();

                // return sorted sections
                return Array.from(Docs.docs)
                    .map(([folderName, { index, files }]) => {
                        const title = capitalize(folderName);
                        // console.log("files", files);
                        const sections = files
                            .map(({ filename, index }) => {
                                return {
                                    name: filenameToTitle(filename),
                                    slug: `/docs/${folderName}/${filenameToSlug(filename)}`,
                                    index
                                };
                            })
                            .sort((a, b) => a.index - b.index);

                        return {
                            title,
                            sections,
                            index
                        };
                    })
                    .sort((a, b) => a.index - b.index);
            }
        });
    }

    public static async getDoc(folder: string, page: string): Promise<ValidDocsFile | null> {
        return cachified({
            key: `docs-${folder}-${page}`,
            ttl: Docs.shouldCacheDocs ? minToMs(5) : 0,
            staleWhileRevalidate: Docs.shouldCacheDocs ? minToMs(60) : 0,
            getFreshValue: async () => {
                const folderIndex = Docs.docs.get(folder)?.index;
                const fileIndex = Docs.docs
                    .get(folder)
                    ?.files.find((file) => file.filename === page)?.index;

                if (!folderIndex) {
                    throw new Error(
                        "Missing folder index: " + folder + ", in docs: " + Docs.docs.get(folder)
                    );
                }

                // if (!fileIndex) {
                // throw new Error(
                //     "Missing file index: " +
                //         page +
                //         ", in docs: " +
                //         JSON.stringify(
                //             Docs.docs.get(folder)?.files.map((file) => file.filename)
                //         )
                // );
                // }

                const filepath = `${folderIndex}.${folder}/${fileIndex !== -1 ? `${fileIndex}.` : ""}${page}.mdx`;

                const doc = await Docs.fetchFreshDoc(filepath);

                return doc;
            }
        });
    }

    private static async serialize(content: string) {
        const headings = await extractHeadings(content);

        return await serialize(content, {
            parseFrontmatter: true,
            scope: {
                headings
            },
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
}

export function filenameToTitle(filename: string) {
    return capitalize(
        filename
            .replaceAll("-", " ")
            .replaceAll(".", "")
            .replaceAll("/", "")
            .replaceAll("?", "")
            .toLowerCase()
    );
}

function filenameToSlug(filename: string) {
    return filename
        .replaceAll(" ", "-")
        .replaceAll(".", "")
        .replaceAll("/", "")
        .replaceAll("?", "")
        .toLowerCase();
}

function removeIndex(filename: string) {
    if (Number.isNaN(Number.parseInt(filename[0]))) {
        return filename.split(".")[0];
    }

    return filename.split(".")[1];
}

function getIndex(filename: string) {
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

class DocsFile {
    filename: string;
    content: string | null;
    mdxContent: MdxContent | null;
    mdxFrontmatterDescription: MdxContent | null;
    index: number;
    headings: Heading[] | null;

    constructor(
        filename: string,
        content: string | null,
        mdxContent: MdxContent | null,
        index: number,
        mdxFrontmatterDescription?: MdxContent | null,
        headings?: Heading[]
    ) {
        this.filename = filename;
        this.content = content;
        this.mdxContent = mdxContent;
        this.index = index;
        this.mdxFrontmatterDescription = mdxFrontmatterDescription ?? null;
        this.headings = headings ?? null;
    }
}

interface ValidDocsFile extends DocsFile {
    content: string;
    mdxContent: MdxContent;
    headings: Heading[];
}

export interface MdxContent
    extends MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>> {}

export interface ISection {
    title: string;
    sections: Page[];
}

interface Page {
    name: string;
    slug: string;
}

function getHeadings(tree: Root) {
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
