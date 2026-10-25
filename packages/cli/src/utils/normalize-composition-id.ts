export function normalizeCompositionId(id: string) {
    return id
        .replace(/^\.\//, "")
        .replace(/^compositions\/ui\//, "")
        .replace(/^\.\.\/[^/]+\/([^/]+?)(?:\.(tsx|ts|jsx|js))?$/, "$1")
        .replace(/\.(tsx|ts|jsx|js)$/, "");
}
