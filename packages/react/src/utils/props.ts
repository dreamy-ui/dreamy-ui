export type Merge<M, N> = N extends Record<string, unknown> ? M : Omit<M, keyof N> & N;

interface DOMElement extends Element, HTMLOrSVGElement {}

interface DataAttributes {
    [dataAttr: string]: any;
}

export interface DOMAttributes<T = DOMElement>
    extends React.AriaAttributes,
        React.DOMAttributes<T>,
        DataAttributes {
    id?: string;
    role?: React.AriaRole;
    tabIndex?: number;
    style?: React.CSSProperties;
}

export type PropGetter<P = Record<string, unknown>, R = DOMAttributes> = (
    props?: Merge<DOMAttributes, P>,
    ref?: React.Ref<any>
) => R & React.RefAttributes<any>;

export type RequiredPropGetter<P = Record<string, unknown>, R = DOMAttributes> = (
    props: Merge<DOMAttributes, P>,
    ref?: React.Ref<any>
) => R & React.RefAttributes<any>;

export type MaybeRenderProp<P> = React.ReactNode | ((props: P) => React.ReactNode);

export function mergeProps<P extends Record<string, unknown>>(
    props: P,
    otherProps: Record<string, unknown>
) {
    return { ...props, ...otherProps };
}

export function omit<T extends Record<string, any>, K extends keyof T>(
    object: T,
    keysToOmit: K[] = []
) {
    const clone: Record<string, unknown> = Object.assign({}, object);
    for (const key of keysToOmit) {
        if (key in clone) {
            delete clone[key as string];
        }
    }
    return clone as Omit<T, K>;
}

export function pick<T extends Record<string, any>, K extends keyof T>(object: T, keysToPick: K[]) {
    const result = {} as {
        [P in K]: T[P];
    };
    for (const key of keysToPick) {
        if (key in object) {
            result[key] = object[key];
        }
    }
    return result;
}

export function splitProps<T extends Record<string, any>, K extends Array<keyof T>>(
    props: T,
    keys: K
): [Pick<T, K[number]>, Omit<T, K[number]>] {
    const picked: Pick<T, K[number]> = {} as Pick<T, K[number]>;
    const rest: Omit<T, K[number]> = {} as Omit<T, K[number]>;

    const keySet = new Set(keys);

    for (const key in props) {
        if (keySet.has(key as K[number])) {
            picked[key as K[number]] = props[key];
        } else {
            (rest as any)[key] = props[key];
        }
    }

    return [picked, rest];
}
