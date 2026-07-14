import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { Logger } from "~/src/.server/logger";
import { filenameToSlug } from "~/src/functions/string";
import { prisma } from "./db";
import {
    Docs,
    type LocalSection,
    type ValidDocsFile,
    filenameToTitle,
    getIndex,
    removeIndex
} from "./docs";

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

function diskFolderName(section: LocalSection) {
    return `${section.index}.${section.slugified}`;
}

export function resolveDocFilepath(folder: string, page: string, sections: LocalSection[]) {
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

    const pageIndexPrefix = pageEntry.index !== -1 ? `${pageEntry.index}.` : "";

    return `${diskFolderName(section)}/${pageIndexPrefix}${page}.mdx`;
}

export async function getSectionsFromFilesystem(): Promise<LocalSection[]> {
    let folderNames: string[];
    try {
        folderNames = await fs.readdir(DOCS_DIR);
    } catch (error) {
        Logger.error(`Failed to read docs directory: ${String(error)}`);
        throw error;
    }

    const sections: LocalSection[] = [];

    for (const folderName of folderNames) {
        const folderStat = await fs.stat(path.join(DOCS_DIR, folderName));
        if (!folderStat.isDirectory()) {
            continue;
        }

        const sectionIndex = getIndex(folderName);
        const sectionSlug = filenameToSlug(removeIndex(folderName));
        const sectionTitle = filenameToTitle(removeIndex(folderName));
        const filenames = await fs.readdir(path.join(DOCS_DIR, folderName));

        sections.push({
            title: sectionTitle,
            slugified: sectionSlug,
            index: sectionIndex,
            sections: filenames
                .filter((filename) => filename.endsWith(".mdx") || filename.endsWith(".md"))
                .map((filename) => {
                    const name = filenameToTitle(removeIndex(filename));
                    return {
                        name,
                        slug: `/docs/${sectionSlug}/${filenameToSlug(name)}`,
                        index: getIndex(filename)
                    };
                })
        });
    }

    return sections.sort((a, b) => a.index - b.index);
}

async function upsertDocPage(filepath: string, content: string) {
    const [folderName, filename] = filepath.split("/");

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
    const headings = (mdxContent.scope.headings ?? []) as ValidDocsFile["headings"];
    const pageSlug = `/docs/${sectionSlug}/${filenameToSlug(pageName)}`;
    const contentHash = hashContent(content);

    const pageData = {
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
    };

    const existingByFilepath = await prisma.docPage.findUnique({
        where: { filepath }
    });

    if (existingByFilepath) {
        await prisma.docPage.update({
            where: { id: existingByFilepath.id },
            data: pageData
        });
    } else {
        const existingBySectionFilename = await prisma.docPage.findUnique({
            where: {
                sectionId_filename: {
                    sectionId: section.id,
                    filename: pageFilename
                }
            }
        });

        if (existingBySectionFilename) {
            await prisma.docPage.update({
                where: { id: existingBySectionFilename.id },
                data: pageData
            });
        } else {
            await prisma.docPage.create({
                data: pageData
            });
        }
    }

    return {
        filename: pageFilename,
        content,
        mdxContent,
        index: pageIndex,
        mdxFrontmatterDescription,
        headings
    } satisfies ValidDocsFile;
}

export async function syncDocFromFilesystem(filepath: string): Promise<ValidDocsFile | null> {
    const fullPath = path.join(DOCS_DIR, filepath);

    let content: string;
    try {
        content = await fs.readFile(fullPath, "utf-8");
    } catch {
        return null;
    }

    return upsertDocPage(filepath, content);
}

export async function syncChangedDocsFromFilesystem() {
    let folderNames: string[];
    try {
        folderNames = await fs.readdir(DOCS_DIR);
    } catch (error) {
        Logger.error(`Failed to read docs directory: ${String(error)}`);
        throw error;
    }

    for (const folderName of folderNames) {
        const folderStat = await fs.stat(path.join(DOCS_DIR, folderName));
        if (!folderStat.isDirectory()) {
            continue;
        }

        const filenames = await fs.readdir(path.join(DOCS_DIR, folderName));

        for (const filename of filenames) {
            if (!filename.endsWith(".mdx") && !filename.endsWith(".md")) {
                continue;
            }

            const filepath = `${folderName}/${filename}`;
            const content = await fs.readFile(path.join(DOCS_DIR, filepath), "utf-8");
            const contentHash = hashContent(content);

            const existing = await prisma.docPage.findUnique({
                where: { filepath },
                select: { contentHash: true }
            });

            if (existing?.contentHash === contentHash) {
                continue;
            }

            await upsertDocPage(filepath, content);
        }
    }
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

        const filenames = await fs.readdir(path.join(DOCS_DIR, folderName));

        for (const filename of filenames) {
            if (!filename.endsWith(".mdx") && !filename.endsWith(".md")) {
                continue;
            }

            const filepath = `${folderName}/${filename}`;
            const content = await fs.readFile(path.join(DOCS_DIR, filepath), "utf-8");
            const contentHash = hashContent(content);

            const existing = await prisma.docPage.findUnique({
                where: { filepath },
                select: { contentHash: true }
            });

            if (existing?.contentHash === contentHash) {
                syncedFilepaths.add(filepath);
                continue;
            }

            await upsertDocPage(filepath, content);
            syncedFilepaths.add(filepath);
        }
    }

    const stalePages = await prisma.docPage.findMany({
        where: {
            filepath: {
                notIn: [...syncedFilepaths]
            }
        },
        select: { id: true }
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
