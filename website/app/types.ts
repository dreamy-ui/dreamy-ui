/**
 * @property `source` and `themeSource` should contain only paths, without origin.
 */
export interface ComponentDocFrontmatter {
    title: string;
    description: string;
    isServerComponent: boolean;
    source: string;
    themeSource: string;
}
