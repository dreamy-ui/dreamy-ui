-- CreateTable
CREATE TABLE "DocSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "index" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DocPage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sectionId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mdxContent" TEXT NOT NULL,
    "mdxFrontmatterDescription" TEXT,
    "headings" TEXT NOT NULL,
    "searchText" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DocPage_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "DocSection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DocSection_index_key" ON "DocSection"("index");

-- CreateIndex
CREATE UNIQUE INDEX "DocSection_slug_key" ON "DocSection"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DocPage_slug_key" ON "DocPage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DocPage_filepath_key" ON "DocPage"("filepath");

-- CreateIndex
CREATE INDEX "DocPage_title_idx" ON "DocPage"("title");

-- CreateIndex
CREATE INDEX "DocPage_description_idx" ON "DocPage"("description");

-- CreateIndex
CREATE UNIQUE INDEX "DocPage_sectionId_index_key" ON "DocPage"("sectionId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "DocPage_sectionId_filename_key" ON "DocPage"("sectionId", "filename");
