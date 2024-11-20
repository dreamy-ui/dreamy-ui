export function capitalize(str: string) {
    return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

export function filenameToSlug(filename: string) {
    return (
        filename
            .replaceAll(" ", "-")
            // .replaceAll(".", "")
            .replaceAll("/", "")
            .replaceAll("?", "")
            .toLowerCase()
    );
}
