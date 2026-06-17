import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { Logger } from "~/src/.server/logger";
import { filenameToSlug } from "~/src/functions/string";
import { prisma } from "./db";
import { Docs, filenameToTitle, removeIndex, getIndex } from "./docs";

const DOCS_DIR = path.join(process.cwd(), "docs");

function extractSearchText(content: string) {
    const withoutFrontmatter = content.replace(/---[\s\S]*?---/, "");

    return withoutFrontmatter
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#*`<>]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

function hashContent(content: string) {
    return createHash("sha256").update(content).digest("hex");
}

export async function syncDocsFromFilesystem() {
    const start = performance.now();

    let folderNames: string[];
    try {
        folderNames = await fs.readdir(DOCS_DIR);
    } catch (error) {
        Logger.error(`Failed to read docs directory: ${String(error)}`);
        throw error;
    }

    const syncedFilepaths = new Set<string>();

    for (const folderName of folderNames) {
        const folderStat = await fs.stat(path.join(DOCS_DIR, folderName));
        if (!folderStat.isDirectory()) {
            continue;
        }

        const sectionIndex = getIndex(folderName);
        const sectionSlug = filenameToSlug(removeIndex(folderName));
        const sectionTitle = filenameToTitle(removeIndex(folderName));

        const section = await prisma.docSection.upsert({
            where: { index: sectionIndex },
            create: {
                index: sectionIndex,
                title: sectionTitle,
                slug: sectionSlug
            },
            update: {
                title: sectionTitle,
                slug: sectionSlug
            }
        });

        const filenames = await fs.readdir(path.join(DOCS_DIR, folderName));

        for (const filename of filenames) {
            if (!filename.endsWith(".mdx") && !filename.endsWith(".md")) {
                continue;
            }

            const filepath = `${folderName}/${filename}`;
            const fullPath = path.join(DOCS_DIR, filepath);
            const content = await fs.readFile(fullPath, "utf-8");
            const contentHash = hashContent(content);

            const existing = await prisma.docPage.findUnique({
                where: { filepath },
                select: { contentHash: true }
            });

            if (existing?.contentHash === contentHash) {
                syncedFilepaths.add(filepath);
                continue;
            }

            const mdxContent = await Docs.serialize(content);
            const mdxFrontmatterDescription =
                mdxContent.frontmatter.description &&
                typeof mdxContent.frontmatter.description === "string"
                    ? await Docs.serialize(mdxContent.frontmatter.description)
                    : null;

            const pageIndex = getIndex(filename);
            const pageFilename = removeIndex(filename);
            const pageName = filenameToTitle(pageFilename);
            const pageTitle =
                typeof mdxContent.frontmatter.title === "string"
                    ? mdxContent.frontmatter.title
                    : pageName;
            const pageDescription =
                typeof mdxContent.frontmatter.description === "string"
                    ? mdxContent.frontmatter.description
                    : null;
            const headings = mdxContent.scope.headings ?? [];
            const pageSlug = `/docs/${sectionSlug}/${filenameToSlug(pageName)}`;

            await prisma.docPage.upsert({
                where: { filepath },
                create: {
                    sectionId: section.id,
                    index: pageIndex,
                    filename: pageFilename,
                    name: pageName,
                    title: pageTitle,
                    description: pageDescription,
                    slug: pageSlug,
                    filepath,
                    content,
                    mdxContent: JSON.stringify(mdxContent),
                    mdxFrontmatterDescription: mdxFrontmatterDescription
                        ? JSON.stringify(mdxFrontmatterDescription)
                        : null,
                    headings: JSON.stringify(headings),
                    searchText: extractSearchText(content),
                    contentHash
                },
                update: {
                    sectionId: section.id,
                    index: pageIndex,
                    filename: pageFilename,
                    name: pageName,
                    title: pageTitle,
                    description: pageDescription,
                    slug: pageSlug,
                    content,
                    mdxContent: JSON.stringify(mdxContent),
                    mdxFrontmatterDescription: mdxFrontmatterDescription
                        ? JSON.stringify(mdxFrontmatterDescription)
                        : null,
                    headings: JSON.stringify(headings),
                    searchText: extractSearchText(content),
                    contentHash
                }
            });

            syncedFilepaths.add(filepath);
        }
    }

    const stalePages = await prisma.docPage.findMany({
        where: {
            filepath: {
                notIn: [...syncedFilepaths]
            }
        },
        select: { id: true, filepath: true }
    });

    if (stalePages.length > 0) {
        await prisma.docPage.deleteMany({
            where: {
                id: {
                    in: stalePages.map((page) => page.id)
                }
            }
        });
    }

    const staleSections = await prisma.docSection.findMany({
        include: {
            _count: {
                select: { pages: true }
            }
        }
    });

    const emptySectionIds = staleSections
        .filter((section) => section._count.pages === 0)
        .map((section) => section.id);

    if (emptySectionIds.length > 0) {
        await prisma.docSection.deleteMany({
            where: {
                id: {
                    in: emptySectionIds
                }
            }
        });
    }

    const duration = (performance.now() - start).toFixed(0);
    Logger.success(`Docs synced to database (${syncedFilepaths.size} pages, ${duration}ms)`);
}
