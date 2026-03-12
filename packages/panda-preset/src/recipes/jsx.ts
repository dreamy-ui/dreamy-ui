export function mapJsx(root: string, jsx: string[]) {
    return jsx.map((item) => `${root}.${item}`);
}
