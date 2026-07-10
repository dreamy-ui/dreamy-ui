export function mapJsx(root: string, jsx: string[]): string[] {
    return jsx.map((item) => `${root}.${item}`);
}
